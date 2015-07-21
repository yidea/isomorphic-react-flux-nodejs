/**
 *  AddItem
 */
import React from "react";
import Router from "react-router";

import {Button} from "@walmart/wmreact-interactive";

export default React.createClass({
  displayName: "AddItem",

  mixins: [Router.Navigation],

  propTypes: {
    Action: React.PropTypes.object,
    Store: React.PropTypes.object
  },

  _onChange(ev) {
    this.props.Action.setProductName(ev.target.value);
  },

  _onSubmit(ev) {
    ev.preventDefault();
    const store = this.props.Store;
    let productName = this.props.Store.value;
    if (!productName) { return; }

    this.props.Action.fetchQarth(productName)
      .then(function () {
        this.transitionTo(`/shelf/${encodeURIComponent(productName)}`);
      }.bind(this));
  },

  render() {
    return (
      <div className="add-item">
        <h4 className="item-setup-title">Add Item Title</h4>
        <form className="arrange form-arrange" onSubmit={this._onSubmit}>
          <label className="arrange-fill">
            <input
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
