/**
 *  Review
 */
import React from "react";
import Router from "react-router";
import Firebase from "firebase";
import _ from "lodash";
import moment from "moment";
import Configs from "config/configs";

import Griddle from "griddle-react";

export default React.createClass({
  displayName: "Review",

  mixins: [Router.Navigation],

  propTypes: {
    Action: React.PropTypes.object,
    Store: React.PropTypes.object,
    params: React.PropTypes.object,
    routeName: React.PropTypes.string
  },

  getInitialState: function () {
    return {items: null};
  },

  componentWillMount() {
    let route;
    if (this.props.routeName) {
      route = (this.props.routeName === Configs.ROUTE_SHELF) ?
        Configs.ROUTE_SHELF : Configs.ROUTE_PRODUCT_TYPE;
    }
    this.firebaseRef = new Firebase(Configs.API_FIREBASE).child(route);
    // firebase init load event
    this.firebaseRef.on("value", function (snapshot) {
      let data = snapshot.val();
      if (data) {
        data = _.chain(data)
          .map(function (item) {
            if (item.date) {
              item.date = moment.utc(item.date).format("MMM DD");
            }
            return item;
          })
          .uniq("productName")
          .sortBy("date")
          .reverse()
          .value();

        this.state.items = data;
        this.forceUpdate();
      }
    }.bind(this));
  },

  componentWillUnmount() {
    //cleanup firebase events
    this.firebaseRef.off();
  },

  render() {
    let columnMeta = [
      {
        columnName: "productName",
        displayName: "Title",
        order: 1
      },
      {
        columnName: "shelfName",
        displayName: "Shelf",
        order: 2
      },
      {
        columnName: "confidenceLevel",
        displayName: "Confidence",
        order: 3
      },
      {
        columnName: "date",
        displayName: "Date",
        order: 4
      }
    ];
    if (this.state.items) {
      return (
        <div>
          <h4 className="item-setup-title">Review My Items</h4>
          <Griddle
            results={this.state.items}
            columnMetadata={columnMeta}
            resultsPerPage="20"
            useFixedLayout={false}
            tableClassName="table"
            showFilter={true}
            showSettings={false}
            />
        </div>
      );
    }
    return null;
  }
});