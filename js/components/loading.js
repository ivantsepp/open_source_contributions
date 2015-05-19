/** @jsx React.DOM */
var React = require('react/addons');
var Loading = React.createClass({

  render: function(){
    return (
      <div className="column three-fourths contributions-container">
        <div className="sk-spinner sk-spinner-three-bounce loading-container">
          <div className="sk-bounce1"></div>
          <div className="sk-bounce2"></div>
          <div className="sk-bounce3"></div>
        </div>
      </div>
    );
  }
 });

 module.exports = Loading;
