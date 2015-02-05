require 'sinatra'
require 'octokit'
# require 'sinatra/reloader'
Octokit.auto_paginate = true

# stack = Faraday::RackBuilder.new do |builder|
#   builder.response :logger
#   builder.use Octokit::Response::RaiseError
#   builder.adapter Faraday.default_adapter
# end
# Octokit.middleware = stack

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
end
helpers Helpers

# get '/test' do
#   user = 'ivantsepp'
#   @sorted_pull_requests = Marshal.load(File.read('./test.txt'))
#   @user = Marshal.load(File.read('./user.txt'))
#   erb :list
# end
get '/:user' do
  user = params[:user]
  @user = settings.client.user(user)
  results = settings.client.search_issues "author:#{user} type:pr is:merged"
  pull_requests = results.items.group_by do |pr|
    repository(pr.url)
  end
  public_pull_requests = pull_requests.select { |repo| !repo.private? }.to_a
  @sorted_pull_requests = public_pull_requests.sort_by { |p| -repo_rating(p[0]) }
  erb :list
end
