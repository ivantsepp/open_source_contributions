/** @jsx React.DOM */
var React = require('react/addons');
var SearchBar = require('./search_bar');
var Profile = require('./profile');
var PullRequestsList = require('./pull_requests_list');

var Contributions = React.createClass({
  getInitialState: function() {
    return {
      user: this.props.user,
      pullRequests: this.props.pullRequests,
    };
  },
  componentWillMount: function() {
    this.getUserInfo();
    this.getPullRequests();
  },
  getUserInfo: function(){
    if (this.state.user){
      return;
    }

    $.getJSON(this.props.baseUrl + "/users/" + this.props.username, function(data){
      this.setState({user: data});
    }.bind(this));
  },
  getPullRequests: function(){
    if (this.state.pullRequests){
      return;
    }
    var url = this.props.baseUrl + "/search/issues?" + "&q=author:" + this.props.username + "+type:pr+is:merged+is:public&per_page=100";
    this.getPullRequestsByUrl(url);
  },
  getPullRequestsByUrl: function(url){
    var self = this, pullRequests = this.state.pullRequests || [];
    $.getJSON(url, function(data, status, jqXHR){
      pullRequests = pullRequests.concat(data.items);
      this.setState({pullRequests: pullRequests});
      if (jqXHR.getResponseHeader("Link")){
        var links = jqXHR.getResponseHeader("Link").split(",");
        var next = _.find(links, function(link) { return /rel="next"/.test(link); });
        if (next) {
          next = (/<(.*)>/.exec(next) || [])[1];
          self.getPullRequestsByUrl(next);
        }
      }
    }.bind(this));
  },
  profileNode: function(){
    if (!this.state.user){
      return null;
    }
    return <Profile user={this.state.user} />;
  },
  pullRequestsListNode: function(){
    if (!this.state.pullRequests){
      return null;
    }
    return (
      <PullRequestsList
        pullRequests={this.state.pullRequests}
        user={this.state.user}
        repoInfoHash={this.props.repoInfoHash}
        baseUrl={this.props.baseUrl} />
    );
  },
  render: function(){

    return (
      <div>
        <SearchBar loggedIn={this.props.loggedIn} baseUrl={this.props.baseUrl} />
        <div className="main-content">
          <div className="container">
            <div className="columns">
              {this.profileNode()}
              {this.pullRequestsListNode()}
            </div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = Contributions;
