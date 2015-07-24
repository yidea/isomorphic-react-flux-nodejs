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
import Percentage from "./griddle-component/percentage";

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
            // treatment for product type
            if (item.attr) {
              item.attr = item.attr.join(", ");
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
    // cleanup firebase events
    this.firebaseRef.off();
  },

  _configTableMeta() {
    let columnMetadata = [
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
        customComponent: Percentage,
        order: 3
      },
      {
        columnName: "date",
        displayName: "Date",
        order: 4
      }
    ];
    if (this.props.routeName === Configs.ROUTE_PRODUCT_TYPE) {
      columnMetadata = [
        {
          columnName: "productName",
          displayName: "Title",
          order: 1
        },
        {
          columnName: "shelfName",
          displayName: "Product Type",
          order: 2
        },
        {
          columnName: "attr",
          displayName: "Required Attributes",
          cssClassName: "column-attr",
          order: 3
        },
        {
          columnName: "confidenceLevel",
          displayName: "Confidence",
          customComponent: Percentage,
          order: 4
        },
        {
          columnName: "date",
          displayName: "Date",
          order: 5
        }
      ];
    }
    return columnMetadata;
  },

  render() {
    let columnMetadata = this._configTableMeta();
    if (this.state.items) {
      return (
        <div>
          <h4 className="item-setup-title">Review My Items</h4>
          <Griddle
            noDataMessage={"No data could be found."}
            results={this.state.items}
            columnMetadata={columnMetadata}
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
