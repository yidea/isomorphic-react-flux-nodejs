/**
 *  Suggest.
 */
import React from "react";
import Router from "react-router";
import Firebase from "firebase";
import Configs from "../../config/configs";

import {Button} from "@walmart/wmreact-interactive";

export default React.createClass({
  displayName: "Shelf",

  mixins: [Router.Navigation, Router.State],

  propTypes: {
    Action: React.PropTypes.object,
    Store: React.PropTypes.object
  },

  componentWillMount() {
    this.firebaseRef = new Firebase(Configs.API_FIREBASE).child("items");
    // if qarthResponse is null but params has productName, issue a fetch
    let productName = this.props.params.productName;
    if (productName && this.props.Store.qarthResponse == null) {
      this.props.Action.setProductName(productName);
      this.props.Action.fetchQarth(this.props.params.productName);
    }
  },

  componentWillUnmount() {
    // cleanup firebase events
    this.firebaseRef.off();
  },

  _onClickBack() {
    this.transitionTo("shelf");
  },

  _onClickAccept() {
    // store in database title, shelf, confidence, date
    // firebase push array data
    const res = this.props.Store.qarthResponse;
    if (!res) { return; }

    this.firebaseRef.push({
      productName: res.productName,
      shelfName: res.shelfName,
      confidenceLevel: res.confidence + "%",
      date: Firebase.ServerValue.TIMESTAMP
    }, function () {
      this.transitionTo("shelf-review");
    }.bind(this));
  },

  render() {
    // let { productName } = this.context.router.getCurrentParams();
    let store = this.props.Store,
      content;
    if (!store.loaded) {
      content = (<div>Loading..</div>);
    } else if (store.qarthError) {
      content = (<div>{store.qarthError}</div>);
    } else {
      if (store.qarthResponse) {
        let level = store.qarthResponse.confidence,
          classNames;
        if (level <= 50) {
          classNames = "level-red";
        } else {
          classNames = "level-green";
        }
        content = (
          <div className="shelf">
            <h4 className="shelf-title">Item Title</h4>
            <span className="shelf-content no-margin">{store.value}</span>
            <h4 className="shelf-title shelf-title-border">Item Shelf</h4>
            <div className="shelf-result">
              <span>{store.qarthResponse.shelfName}</span>
              <span className={classNames}>{store.qarthResponse.confidence + "% confidence"}</span>
            </div>
            <div className="shelf-action pull-right">
              <Button inverse={true} onClick={this._onClickBack}>Back</Button>
              <Button onClick={this._onClickAccept}>Accept</Button>
            </div>
          </div>
        );
      }
    }

    return (
      <div>
        {content}
      </div>
    );
  }
});