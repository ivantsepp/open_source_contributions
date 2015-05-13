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
      notFound: false
    };
  },
  componentWillMount: function() {
    this.getUserInfo();
  },
  getUserInfo: function(){
    if (this.state.user){
      return;
    }

    $.getJSON(this.props.baseUrl + "/users/" + this.props.username, function(data){
      if (data.message === "Not Found"){
        this.setState({notFound: true});
      } else {
        this.setState({user: data});
        this.getPullRequests();
      }
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
        baseUrl={this.props.baseUrl}
        loggedIn={this.props.loggedIn} />
    );
  },
  userFoundNode: function(){
    return (
      <div className="columns">
        {this.profileNode()}
        {this.pullRequestsListNode()}
      </div>
    )
  },
  userNotFoundNode: function(){
    return (
      <div className="columns not-found__container">
        <div className="two-thirds column centered flash flash-warn not-found__message">
          <span className="mega-octicon octicon-question not-found__icon"></span>
          <h2>Username not found</h2>
        </div>
      </div>
    )
  },
  render: function(){

    return (
      <div>
        <SearchBar loggedIn={this.props.loggedIn} baseUrl={this.props.baseUrl} />
        <div className="main-content">
          <div className="container">
            {this.state.notFound ? this.userNotFoundNode() : this.userFoundNode() }
          </div>
        </div>
      </div>
    );
  }
});

module.exports = Contributions;
