/**
 *  Review
 */
import React from "react";
import Router from "react-router";
import Firebase from "firebase";
import _ from "lodash";
import moment from "moment";

import {Button} from "@walmart/wmreact-interactive";
import Griddle from "griddle-react";

const FIREBASE_API = "https://sweltering-heat-7932.firebaseio.com/";

export default React.createClass({
  displayName: "Review",

  mixins: [Router.Navigation],

  getInitialState: function () {
    return {items: null};
  },

  componentWillMount() {
    this.firebaseRef = new Firebase(FIREBASE_API).child("items");
    //firebase init load event
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
        //use store
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
        displayName:"Shelf",
        order: 2
      },
      {
        columnName: "confidenceLevel",
        displayName:"Confidence",
        order: 3
      },
      {
        columnName: "date",
        displayName:"Date",
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
      )
    }
    return null;
  }
});
