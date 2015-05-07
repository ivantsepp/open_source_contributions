/** @jsx React.DOM */
var React = require('react/addons');
var RepoInfo = require('./repo_info');

var PullRequestsList = React.createClass({
  getInitialState: function() {
    return {
      pullRequestsByRepo: {},
      repoInfoHash: this.props.repoInfoHash || {},
      isLoading: false
    };
  },
  componentWillMount: function() {
    if (this.props.pullRequests){
      var pullRequestsByRepo = _.groupBy(this.props.pullRequests, function(pullRequest){
        return /repos\/([^\/]*\/[^\/]*)/.exec(pullRequest.url)[1];
      });
      this.setState({pullRequestsByRepo: pullRequestsByRepo});
      this.populateRepoInfo(_.keys(pullRequestsByRepo));
    }
  },
  populateRepoInfo: function(repos){
    if (!_.isEmpty(this.state.repoInfoHash)){
      return;
    }
    this.setState({isLoading: true});
    var self = this, promises = [];
    _.each(repos, function(repo){
      var url = self.props.baseUrl + "/repos/" + repo;
      var promise = $.getJSON(url, function(data){
        self.state.repoInfoHash[repo] = data;
        self.setState({repoInfoHash: self.state.repoInfoHash});
      }).promise();
      promises.push(promise);
    });

    Promise.all(promises).then(function(){

      self.setState({isLoading: false});
    });
  },
  tabNode: function(){
    return (
      <div className="fixed contributions-container__nav">
        <div className="tabnav">
          <nav className="tabnav-tabs">
            <a href="" className="tabnav-tab selected">
              <span className="octicon octicon-diff-added"></span>
              &nbsp;Pull Requests
            </a>
          </nav>
        </div>
      </div>
    );
  },
  reposByRating: function(){
    return _.sortBy(_.keys(this.state.pullRequestsByRepo), function(name){
      var repoInfo = this.state.repoInfoHash[name];
      return (repoInfo.forks_count + repoInfo.subscribers_count + repoInfo.stargazers_count) * -1;
    }, this);
  },
  repoInfoNodes: function(){
    if (_.isEmpty(this.state.repoInfoHash) || this.state.isLoading){
      return;
    }
    var self = this, nodes = [];
    var reposToShow = _.first(this.reposByRating(), 10);
    _.each(reposToShow, function(repo){
      var pullRequests = self.state.pullRequestsByRepo[repo];
      nodes.push(
        <RepoInfo key={repo} pullRequests={pullRequests} repo={self.state.repoInfoHash[repo]} user={self.props.user} />
      );
    });

    return nodes;
  },
  render: function(){
    return (
      <div className="column three-fourths contributions-container">
        {this.tabNode()}
        <div className="contributions-container__list">
          {this.repoInfoNodes()}
        </div>
      </div>
    );
  }
});

module.exports = PullRequestsList;