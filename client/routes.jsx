/**
 * routes
 */
import React from "react/addons";
import {Route, DefaultRoute, RouteHandler} from "react-router";
import AltContainer from "alt/AltContainer";

import {Body, Heading} from "@walmart/wmreact-base";
import AddItem from "./components/addItem";
import Suggest from "./components/suggest";
import Review from "./components/review";

let {CSSTransitionGroup} = React.addons;

const Container = React.createClass({
  propTypes: {
    flux: React.PropTypes.object.isRequired
  },

  _wrapAlt(component) {
    const Store = this.props.flux.getStore("Store"),
      Action = this.props.flux.getActions("Action");
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
      <Body showFooter={false} title="" navText="Review Items" navTarget="/#/shelf/review">
        <div className="item-setup ResponsiveContainer">
          <Heading.H1 className="no-margin">New Item Setup-Shelf</Heading.H1>
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

// add->suggest->review
export default (
  <Route path="/" handler={Container}>
    <Route name="shelf" path="/shelf">
      <DefaultRoute name="shelf-add" handler={AddItem} />
      <Route name="shelf-suggest" path="suggest/:productName" handler={Suggest} />
      <Route name="shelf-review" path="review" handler={Review} />
    </Route>
  </Route>
);
