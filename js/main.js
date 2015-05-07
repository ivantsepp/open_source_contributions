/** @jsx React.DOM */
var React = require('react/addons');
var Contributions = require('./components/contributions');

var user = window.user || null;
var pullRequests = window.pullRequests || null;
var repoInfoHash = window.repoInfoHash || null;

var loggedIn = false, baseUrl = "https://api.github.com";

$.ajax({url: '/api/login', async: false, dataType: "json"}).done(function(){
  loggedIn = true;
  baseUrl = "/api"
});
window.loggedIn = loggedIn;

React.render(
  <Contributions
    loggedIn={loggedIn}
    username={username}
    baseUrl={baseUrl}
    user={user}
    pullRequests={pullRequests}
    repoInfoHash={repoInfoHash} />,
  document.getElementById('react-contributions')
);
