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
    var reposToShow;
    if (this.props.pullRequests){
      var pullRequestsByRepo = _.groupBy(this.props.pullRequests, function(pullRequest){
        return /repos\/([^\/]*\/[^\/]*)/.exec(pullRequest.url)[1];
      });
      this.setState({pullRequestsByRepo: pullRequestsByRepo});
      if (this.props.loggedIn){
        reposToShow = _.keys(pullRequestsByRepo);
      } else {
        reposToShow = _.first(_.keys(pullRequestsByRepo), 10);
      }
      this.populateRepoInfo(reposToShow);
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
    return _.sortBy(_.keys(this.state.repoInfoHash), function(name){
      var repoInfo = this.state.repoInfoHash[name];
      return (repoInfo.forks_count + repoInfo.subscribers_count + repoInfo.stargazers_count) * -1;
    }, this);
  },
  repoInfoNodes: function(){
    if (_.isEmpty(this.state.repoInfoHash) || this.state.isLoading){
      return;
    }
    var self = this, nodes = [];
    _.each(this.reposByRating(), function(repo){
      var pullRequests = self.state.pullRequestsByRepo[repo];
      nodes.push(
        <RepoInfo key={repo} pullRequests={pullRequests} repo={self.state.repoInfoHash[repo]} user={self.props.user} />
      );
    });

    return nodes;
  },
  noPullRequestsNode: function(){
    return (
      <div className="blankslate spacious contributions-container__empty-list">
        <span className="mega-octicon octicon-git-commit"></span>
        <span className="mega-octicon octicon-tag"></span>
        <span className="mega-octicon octicon-git-branch"></span>
        <h3>Could not find any open source pull requests</h3>
        <p>
          Contribute to open source by creating pull requests! You can
          <a href="https://github.com/explore"> explore GitHub</a> to find an interesting project.
        </p>
      </div>
    )
  },
  pullRequestsNode: function(){
    return (
      <div className="contributions-container__list">
        {this.repoInfoNodes()}
      </div>
    );
  },
  render: function(){
    return (
      <div className="column three-fourths contributions-container">
        {this.tabNode()}
        {this.props.pullRequests.length ? this.pullRequestsNode() : this.noPullRequestsNode()}
      </div>
    );
  }
});

module.exports = PullRequestsList;
