/**
 * percentage
 */
import React from "react";
import _ from "lodash";

export default React.createClass({
  displayName: "percentage",

  propTypes: {
    data: React.PropTypes.any.isRequired
  },

  render() {
    let percentage = +this.props.data,
      className;
    if (_.isNaN(percentage)) { return null; }

    className = (percentage >= 50) ? "level-green" : "level-red";
    return (
      <span className={className}>
        {percentage + "%"}
      </span>
    );
  }
});
