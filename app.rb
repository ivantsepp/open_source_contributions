require 'sinatra'
require 'octokit'

Octokit.auto_paginate = true

stack = Faraday::RackBuilder.new do |builder|
  builder.response :logger
  builder.use Octokit::Response::RaiseError
  builder.adapter Faraday.default_adapter
end
Octokit.middleware = stack

configure do
  set :repos, {}
  set :client, Octokit::Client.new
end

module Helpers
  def repo_string(url)
    /repos\/([^\/]*\/[^\/]*)/.match(url)[1]
  end

  def repository(url)
    repo = repo_string(url)
    settings.repos[repo] ||= settings.client.repository(repo)
  end

  def repo_rating(repo)
    repo.forks_count + repo.subscribers_count + repo.stargazers_count
  end

  # http://stackoverflow.com/questions/195740/how-do-you-do-relative-time-in-rails
  def time_ago_in_words(time)
    a = (Time.now - time).to_i

    case a
      when 0 then 'just now'
      when 1 then 'a second ago'
      when 2..59 then a.to_s+' seconds ago'
      when 60..119 then 'a minute ago' #120 = 2 minutes
      when 120..3540 then (a/60).to_i.to_s+' minutes ago'
      when 3541..7100 then 'an hour ago' # 3600 = 1 hour
      when 7101..82800 then ((a+99)/3600).to_i.to_s+' hours ago'
      when 82801..172000 then 'a day ago' # 86400 = 1 day
      when 172001..518400 then ((a+800)/(60*60*24)).to_i.to_s+' days ago'
      when 518400..1036800 then 'a week ago'
      else ((a+180000)/(60*60*24*7)).to_i.to_s+' weeks ago'
    end
  end

  def repo_icon_for(repo, user)
    repo.owner.login == user.login ? 'octicon-repo' : 'octicon-repo-forked'
  end
end

helpers Helpers

get '/test' do
  @sorted_pull_requests = Marshal.load(File.read('./test.txt'))
  @user = Marshal.load(File.read('./user.txt'))
  erb :contributions, :layout => :layout
end

get '/:user' do
  user = params[:user]
  @user = settings.client.user(user)
  results = settings.client.search_issues "author:#{user} type:pr is:merged"
  pull_requests = results.items.group_by do |pr|
    repository(pr.url)
  end
  public_pull_requests = pull_requests.select { |repo| !repo.private? }.to_a
  @sorted_pull_requests = public_pull_requests.sort_by { |p| -repo_rating(p[0]) }
  erb :contributions, :layout => :layout
end
