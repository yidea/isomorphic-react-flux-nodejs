/**
 * routes
 */
import React from "react";
import {Route, DefaultRoute, NotFoundRoute} from "react-router";
import Configs from "config/configs";

import Container from "./components/container";
import Home from "./components/home";
import AddItem from "./components/qarth/addItem";
import Suggest from "./components/qarth/suggest";
import Review from "./components/qarth/review";

export default (
  <Route name="app" path="/" handler={Container}>
    <DefaultRoute name="home" handler={Home} />
    /* shelf */
    <Route name={Configs.ROUTE_SHELF} path={Configs.ROUTE_SHELF}>
      <DefaultRoute name="shelf-add" handler={AddItem} />
      <Route name="shelf-suggest" path="suggest/:productName" handler={Suggest} />
      <Route name="shelf-review" path="review" handler={Review} />
      <NotFoundRoute handler={AddItem} />
    </Route>
    /* product-type */
    <Route name={Configs.ROUTE_PRODUCT_TYPE} path={Configs.ROUTE_PRODUCT_TYPE}>
      <DefaultRoute otherprop="test" name="product-type-add" handler={AddItem} />
      <Route name="product-type-suggest" path="suggest/:productName" handler={Suggest} />
      <Route name="product-type-review" path="review" handler={Review} />
      <NotFoundRoute handler={AddItem} />
    </Route>
  </Route>
);
