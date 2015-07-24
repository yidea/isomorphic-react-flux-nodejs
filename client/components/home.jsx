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
        <li><Link to="shelf">Tool: Shelf Suggestion</Link></li>
        <li><Link to="product-type">Tool: Product Type Suggestion</Link></li>
      </ul>
    );
  }
});
