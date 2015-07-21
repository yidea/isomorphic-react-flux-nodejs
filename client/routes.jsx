/**
 * routes
 */
import React, {cloneElement} from "react/addons";
import {Route, DefaultRoute, RouteHandler} from "react-router";
import AltContainer from "alt/AltContainer";
import _ from "lodash";

import {Body, Heading} from "@walmart/wmreact-base";
import AddItem from "./components/addItem";
import Shelf from "./components/shelf";
import Review from "./components/review";

let {CSSTransitionGroup} = React.addons;

const Container = React.createClass({
  propTypes: {
    flux: React.PropTypes.object.isRequired
  },

  _wrapAlt(component) {
    const Store = this.props.flux.getStore("Store");
    const Action = this.props.flux.getActions("Action");
    return (
      <AltContainer
        actions={{ Action: Action }}
        stores={{ Store: Store }}
        >
        {component}
      </AltContainer>
    );
  },

  render() {
    return (
      <Body showFooter={false} title="" navText="Review Items" navTarget="/#/review">
        <div className="item-setup ResponsiveContainer">
          <Heading.H1 className="no-margin">New Item Setup</Heading.H1>
          <div className="item-setup-body">
            <CSSTransitionGroup transitionName="example">
              {this._wrapAlt(<RouteHandler/>)}
            </CSSTransitionGroup>
          </div>
        </div>
      </Body>
    );
  }
});

export default (
  <Route path="/" handler={Container}>
    <DefaultRoute name="home" handler={AddItem} />
    <Route name="shelf" path="/shelf/:productName" handler={Shelf} />
    <Route name="review" path="/review" handler={Review} />
  </Route>
);
