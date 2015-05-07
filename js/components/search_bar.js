/** @jsx React.DOM */
var React = require('react/addons');

var SearchBar = React.createClass({
  getInitialState: function() {
    return {
      search: '',
      coreRemaining: null,
      searchRemaining: null
    };
  },
  handleChange: function(event) {
    this.setState({search: event.target.value});
  },
  handleClick: function(){
    window.location.href = "/" + this.state.search;
  },
  componentWillMount: function() {
    this.refreshLimitCounter();
  },
  refreshLimitCounter: function(){
    var url = this.props.baseUrl + "/rate_limit";
    $.getJSON(url, function(data){
      if (data.resources){
        this.setState({coreRemaining: data.resources.core.remaining, searchRemaining: data.resources.search.remaining});
      } else {
        this.setState({coreRemaining: data.remaining});
      }
    }.bind(this));
  },
  signIn: function(){
    window.location.href = "/login";
  },
  logOut: function(){
    window.location.href = "/logout";
  },
  render: function(){
    return (
      <div className="search-bar-container">
        <div className="search-bar">
          <div className="container">
            <div className="columns">
              <div className="column one-half">
                <input
                  className="input-block"
                  type="text"
                  placeholder="Search for a GitHub username (ex: ivantsepp)"
                  onChange={this.handleChange} />
              </div>
              <div className="column one-half">
                <button className="btn" type="submit" onClick={this.handleClick}>Search</button>
                <div className="right">
                  <span
                    className="search-bar__counter tooltipped tooltipped-s"
                    aria-label="Number of Core API requests remaining"
                    onClick={this.refreshLimitCounter}>
                    Core: <span className="counter">{this.state.coreRemaining}</span>
                  </span>
                  {this.state.searchRemaining ?
                    <span
                      className="search-bar__counter search-bar__counter--last tooltipped tooltipped-s"
                      aria-label="Number of Search API requests remaining"
                      onClick={this.refreshLimitCounter}>
                      Search: <span className="counter">{this.state.searchRemaining}</span>
                    </span> : null}
                  {loggedIn ?
                     <button type="button" className="btn" onClick={this.logOut}>Log Out</button> :
                     <button type="button" className="btn btn-primary" onClick={this.signIn}>Sign In</button>}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
});

module.exports = SearchBar;
