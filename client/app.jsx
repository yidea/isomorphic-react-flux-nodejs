/**
 * Client entry point.
 */
/*globals document:false, location:false */
import React from "react";
import Router from "react-router";
import chromeDebug from "alt/utils/chromeDebug";
// import AltIso from "alt/utils/AltIso";

import Flux from "./flux";
import routes from "./routes";

// styles
import "./styles/base.styl";

const rootEl = document.querySelector(".js-content");

// Although our Flux store is not a singleton, from the point of view of the
// client-side application, we instantiate a single instance here which the
// entire app will share. (So the client app _has_ an effective singleton).
const flux = new Flux();
// chromeDebug(flux); //debug alt flux

// Try server bootstrap _first_ because doesn't need a fetch.
const serverBootstrapEl = document.querySelector(".js-bootstrap");
let serverBootstrap;
if (serverBootstrapEl) {
  try {
    serverBootstrap = JSON.parse(serverBootstrapEl.innerHTML);
    flux.bootstrap(JSON.stringify(serverBootstrap));
  } catch (err) {
    // Ignore error.
  }
}

// Then try client bootstrap: Get types, value from URL, then _fetch_ data.
//if (!serverBootstrap) {
//  const clientBootstrap = parseBootstrap(location.search);
//
//  if (clientBootstrap) {
//    flux.bootstrap(JSON.stringify({
//      Store: clientBootstrap
//    }));
//    flux.getActions("Action").fetchQarth(
//      clientBootstrap.value
//    );
//  }
//}


Router.run(routes, Router.HashLocation, (Container, state) => { // Router.HistoryLocation
  React.render(<Container flux={flux} router={state}/>, rootEl);
});
