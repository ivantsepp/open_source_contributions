/** @jsx React.DOM */
var React = require('react/addons');

var Profile = React.createClass({
  companyNode: function(){
    if (!this.props.user.company){
      return null;
    }
    return (
      <li className="profile__detail">
        <span className="octicon octicon-organization"></span>
        <span>{this.props.user.company}</span>
      </li>
    );
  },
  blogNode: function(){
    if (!this.props.user.blog){
      return null;
    }
    return (
      <li className="profile__detail">
        <span className="octicon octicon-link"></span>
        <span><a href={this.props.user.blog} rel="nofollow me">{this.props.user.blog}</a></span>
      </li>
    );
  },
  locationNode: function(){
    if (!this.props.user.location){
      return null;
    }
    return (
      <li className="profile__detail">
        <span className="octicon octicon-location"></span>
        <span>{this.props.user.location}</span>
      </li>
    );
  },
  emailNode: function(){
    if (!this.props.user.email){
      return null;
    }
    return (
      <li className="profile__detail">
        <span className="octicon octicon-mail"></span>
        <span><a href={"mailto:" + this.props.user.email}>{this.props.user.email}</a></span>
      </li>
    );
  },
  render: function(){
    var createdAt = moment(this.props.user.created_at).format("MMM D, YYYY");
    return (
      <div className="column one-fourth fixed profile">
        <a href={this.props.user.html_url}>
          <img alt="Profile Picture" className="avatar" height="230" src={this.props.user.avatar_url} width="230" />
        </a>
        <div className="profile__full-name">{this.props.user.name}</div>
        <div className="profile__username">{this.props.user.login}</div>
        <ul className="profile__section">
          {this.companyNode()}
          {this.blogNode()}
          {this.locationNode()}
          {this.emailNode()}
          <li className="profile__detail">
            <span className="octicon octicon-clock"></span>
            <span>Joined on <time dateTime={this.props.user.created_at}>{createdAt}</time></span>
          </li>
        </ul>
        <div className="profile__section">
          <a className="profile__stat" href={"https://github.com/" + this.props.user.login + "/followers"}>
            <strong className="profile__stat-count">{this.props.user.followers}</strong>
            <span className="text-muted">Followers</span>
          </a>
          <a className="profile__stat" href={"https://gist.github.com/" + this.props.user.login}>
            <strong className="profile__stat-count">{this.props.user.public_gists}</strong>
            <span className="text-muted">Gists</span>
          </a>
          <a className="profile__stat" href={"https://github.com/" + this.props.user.login + "/following"}>
            <strong className="profile__stat-count">{this.props.user.following}</strong>
            <span className="text-muted">Following</span>
          </a>
        </div>
      </div>
    );
  }
});

module.exports = Profile;
