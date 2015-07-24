/**
 *  AddItem
 */
import React from "react";
import Router from "react-router";
import {Button} from "@walmart/wmreact-interactive";
import Configs from "config/configs";

export default React.createClass({
  displayName: "AddItem",

  mixins: [Router.Navigation, Router.State],

  propTypes: {
    Action: React.PropTypes.object,
    Store: React.PropTypes.object,
    routeName: React.PropTypes.string
  },

  _onChange(ev) {
    this.props.Action.setProductName(ev.target.value);
  },

  componentDidMount() {
    React.findDOMNode(this.refs.input).setAttribute("results", 10); // add history
  },

  _onSubmit(ev) {
    ev.preventDefault();
    let productName = this.props.Store.value,
      route = "/";
    if (!productName) { return; }

    if (this.props.routeName) {
      route = (this.props.routeName === Configs.ROUTE_SHELF) ?
        Configs.ROUTE_SHELF : Configs.ROUTE_PRODUCT_TYPE;
    }
    this.props.Action.fetchQarth(route, productName)
      .then(() => {
        this.transitionTo(`${route}-suggest`, { productName: encodeURIComponent(productName) });
      });
  },

  render() {
    return (
      <div className="add-item">
        <h4 className="item-setup-title">Add Item Title</h4>
        <form className="arrange form-arrange" onSubmit={this._onSubmit}>
          <label className="arrange-fill">
            <input
              name="title"
              ref="input"
              type="text"
              className="form-control"
              placeholder="example: Champion Women's Short Sleeve Printed V-neck"
              spellCheck="true"
              value={this.props.Store.value}
              onChange={this._onChange}
              />
          </label>
          <div className="arrange-fit">
            <Button type="submit">Continue</Button>
          </div>
        </form>
      </div>
    );
  }
});
