/**
 * Fetch data from rest API.
 *
 * API:
 * - http://127.0.0.1:3000/api/qarth/shelf?productName=ipad
 */
require("es6-promise").polyfill();
require("isomorphic-fetch");

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


  fetchQarth: (type, productName) => new Promise(function (resolve, reject) {
    let url = `${api.BASE_URL}/api/qarth/${type}?productName=${encodeURIComponent(productName)}`;
    return fetch(url)
      .then(res => {
        if (res.status >= 400) {
          reject();
          throw new Error("Bad server response");
        }
        return res.json();
      })
      .then(data => {
        resolve(data);
      }
    );
  })
};

export default api;
