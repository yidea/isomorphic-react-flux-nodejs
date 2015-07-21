/**
 * Fetch data from rest API.
 */
require("es6-promise").polyfill();
require("isomorphic-fetch");
let request = require("superagent");
import _ from "lodash";

let api = {
  BASE_URL: "",

  // Statefully set the base port and host (for server-side).
  setBase: (host, port) => {
    if (host) {
      api.BASE_URL = "http://" + host;
      if (port) {
        api.BASE_URL = api.BASE_URL + ":" + port;
      }
    }
  },

  fetchQarth: (productName) => new Promise(function (resolve, reject) {
    let url = `${api.BASE_URL}/api/qarth?productName=${encodeURIComponent(productName)}`;
    console.log(url);
    return fetch(url).then(res => {
      if (res.status >= 400) {
        reject();
        throw new Error("Bad server response");
      }
      return res.json();
      })
    .then(data => {
        resolve(data);
      }
    )
  })
};

export default api;
