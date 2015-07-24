/**
 * home
 */
import React from "react";
import {Link} from "react-router";

export default React.createClass({
  displayName: "home",

  render() {
    return (
      <ul>
        <li><Link to="shelf">Experiment: Shelf Suggestion</Link></li>
        <li><Link to="product-type">Experiment: Product Type Suggestion</Link></li>
      </ul>
    );
  }
});
