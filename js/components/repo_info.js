/** @jsx React.DOM */
var React = require('react/addons');

var RepoInfo = React.createClass({
  pullRequestsNode: function(){

    var self = this, nodes = [];
    _.each(this.props.pullRequests, function(pullRequest){
      var closedAt = moment(pullRequest.closed_at).format("MMM D, YYYY");
      nodes.push(
        <div key={"PR" + pullRequest.id} className="pull-request-container">
          <a href={pullRequest.html_url} className="pull-request-container__link">
            {pullRequest.title}
          </a>
          <div className="issue-meta">
            <span className="text-muted">
              {"#" + pullRequest.number + " merged at "}
              <time dateTime={pullRequest.closed_at}>
                {closedAt}
              </time>
            </span>
          </div>
        </div>
      );
    });
    return nodes;
  },
  repoIconFor: function(repo){
    return repo.owner.login === this.props.user.login ? 'octicon-repo' : 'octicon-repo-forked';
  },
  render: function(){
    var pushedAtAgo = moment(this.props.repo.pushed_at).fromNow();
    return (
      <div className="repo_item">
        <div className="repo_item__icon">
          <span className={"octicon mega-octicon " + this.repoIconFor(this.props.repo)}></span>
        </div>
        <div className="repo_item__stats">
          <span className="repo_item__stat-item">{this.props.repo.language}</span>
          <a className="repo_item__stat-item" href={this.props.repo.html_url + "/stargazers"}>
            <span className="tooltipped tooltipped-s" aria-label="Stargazers">
              <span className="octicon octicon-star"></span>
              {this.props.repo.stargazers_count}
            </span>
          </a>
          <a className="repo_item__stat-item" href={this.props.repo.html_url + "/network"}>
            <span className="tooltipped tooltipped-s" aria-label="Forks">
              <span className="octicon octicon-git-branch"></span>
              {this.props.repo.forks}
            </span>
          </a>
        </div>
        <h2 className="repo_item__name">
          <a href={this.props.repo.html_url}>{this.props.repo.full_name}</a>
        </h2>
        <p className="text-muted repo_item__updated-at">
          <small>
            Updated&nbsp;
            <time dateTime={this.props.repo.pushed_at}>
              {pushedAtAgo}
            </time>
          </small>
        </p>
        <p className="repo_item__description">{this.props.repo.description}</p>
        {this.pullRequestsNode()}
      </div>
    );
  }
});

module.exports = RepoInfo;
