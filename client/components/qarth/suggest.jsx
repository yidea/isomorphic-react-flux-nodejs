/**
 *  Suggest
 */
import React from "react";
import Router from "react-router";
import Firebase from "firebase";
import Configs from "config/configs";

import {Button} from "@walmart/wmreact-interactive";

export default React.createClass({
  displayName: "Suggest",

  mixins: [Router.Navigation, Router.State],

  propTypes: {
    Action: React.PropTypes.object,
    Store: React.PropTypes.object,
    params: React.PropTypes.object,
    routeName: React.PropTypes.string
  },

  componentWillMount() {
    let productName = this.props.params.productName;
    // setup Firebase connection
    let route;
    if (this.props.routeName) {
      route = (this.props.routeName === Configs.ROUTE_SHELF) ?
        Configs.ROUTE_SHELF : Configs.ROUTE_PRODUCT_TYPE;
    }
    this.firebaseRef = new Firebase(Configs.API_FIREBASE).child(route);
    // fetch data if land on url with productName
    if (productName && this.props.Store.qarthResponse == null) {
      this.props.Action.setProductName(productName);
      this.props.Action.fetchQarth(route, this.props.params.productName);
    }
  },

  componentWillUnmount() {
    // cleanup Firebase events
    this.firebaseRef.off();
  },

  _onClickBack() {
    let route;
    if (this.props.routeName) {
      route = (this.props.routeName === Configs.ROUTE_SHELF) ?
        Configs.ROUTE_SHELF : Configs.ROUTE_PRODUCT_TYPE;
      this.transitionTo(route);
    }
  },

  _onClickAccept() {
    // store in database title, shelf, confidence, date
    const res = this.props.Store.qarthResponse;
    if (!res) { return; }

    let data = {
      productName: res.productName,
      shelfName: res.shelfName,
      confidenceLevel: res.confidence + "%",
      date: Firebase.ServerValue.TIMESTAMP
    }

    this.firebaseRef.push(data, function () {
      let route;
      if (this.props.routeName) {
        route = (this.props.routeName === Configs.ROUTE_SHELF) ?
          Configs.ROUTE_SHELF : Configs.ROUTE_PRODUCT_TYPE;
        route += "-review";
        this.transitionTo(route);
      }

    }.bind(this));
  },

  _renderAttribute() {
    let attributes;
    if (this.props.Store.qarthResponse.attr) {
      attributes = this.props.Store.qarthResponse.attr.map((item) => {
        return (<button type="button" className="btn btn-badge btn-badge-alt">{item}</button>);
      });
      return (
        <div>
          <h4 className="shelf-title">Required Attributes</h4>
          <div className>
            {attributes}
          </div>
        </div>
      );
    }
    return null;
  },

  render() {
    let store = this.props.Store,
      content;
    if (!store.loaded) {
      content = (<div>Loading..</div>);
    } else if (store.qarthError) {
      content = (<div>{store.qarthError}</div>);
    } else if (store.qarthResponse) {
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
          <h4 className="shelf-title shelf-title-border">
            {this.props.routeName === Configs.ROUTE_PRODUCT_TYPE ? "Product Type" : "Item Shelf"}
          </h4>
          <div className="shelf-result">
            <span>{store.qarthResponse.shelfName}</span>
            <span className={classNames}>{store.qarthResponse.confidence + "% confidence"}</span>
          </div>
          {this.props.routeName === Configs.ROUTE_PRODUCT_TYPE ? this._renderAttribute() : null}
          <div className="shelf-action pull-right">
            <Button inverse={true} onClick={this._onClickBack}>Back</Button>
            <Button onClick={this._onClickAccept}>Accept</Button>
          </div>
        </div>
      );
    }
    return (
      <div>
        {content}
      </div>
    );
  }
});