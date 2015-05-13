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
  search: function(){
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
  handleKeyPress: function(event){
    if (event.which === 13 ) {
      this.search();
    }
  },
  render: function(){
    return (
      <div className="search-bar-container">
        <div className="search-bar">
          <div className="container">
            <div className="columns">
              <div className="column one-half">
                <a className="search-bar__logo" href="/"><span className="mega-octicon octicon-terminal"></span></a>
                <input
                  className="right search-bar__search-input"
                  type="text"
                  placeholder="Search for a GitHub username (ex: ivantsepp)"
                  onChange={this.handleChange}
                  onKeyPress={this.handleKeyPress} />
              </div>
              <div className="column one-half">
                <button className="btn" type="submit" onClick={this.search}><span className="octicon octicon-search"></span> Search</button>
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
                     <button type="button" className="btn" onClick={this.logOut}><span className="octicon octicon-sign-out"></span> Log Out</button> :
                     <button type="button" className="btn btn-primary" onClick={this.signIn}><span className="octicon octicon-sign-in"></span> Sign In</button>}
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
