/**
 * routesApi
 * /api
 */
import express from "express";
import request from "superagent";
import _ from "lodash";
import NodeCahce from "node-cache";

import Configs from "../../config/configs";
import Taxonomy from "../data/taxonomy-shelves.json";
import ProductType from "../data/product-type-attributes.json";

let router = express.Router(),
  apiCache = new NodeCahce({ stdTTL: 360 * 60, checkperiod: 60 * 60 });

// example proxy
// http://127.0.0.1:3000/api/qarth/productType?productName=ipad
router.get("/user/:id", (req, res) => {
  res.send(req.params.id);
});

// example qarth
// http://127.0.0.1:3000/api/qarth/shelf?productName=ipad
// http://127.0.0.1:3000/api/qarth/product-type?productName=ipad
router.get("/qarth/:type", (req, res) => {
  let type = req.params.type || "",
    productName = req.query.productName || "",
    response,
    apiUrl = "",
    mockFileUrl = "",
    lookupMap,
    key = `${type}-${productName}`;

  if (type === Configs.ROUTE_SHELF) {
    apiUrl = Configs.API_QARTH_SHELF;
    mockFileUrl = "../data/mock/shelf-ipad.json";
    lookupMap = Taxonomy;
  } else if (type === Configs.ROUTE_PRODUCT_TYPE) {
    apiUrl = Configs.API_QARTH_PRODUCT_TYPE;
    mockFileUrl = "../data/mock/product-type-ipad.json";
    lookupMap = ProductType;
  }
  if (!productName || !type || !apiUrl) { return res.json({error: "wrong path or param"}); }

  // get from cache if cached, otherwize request service
  apiCache.get(key, (err, cache) => {
    if (err) { throw new Error(err); }
    if (cache !== undefined) {
      return res.json(cache);
    } else {
      request
        .post(apiUrl)
        .send([{"data": [{"attr_id": "Product Name", "value": productName}], "product_id": "1"}])
        .set("Accept", "application/json")
        .end((error, data) => {
          if (error) {
            console.log(error);
            response = require(mockFileUrl); // fallback data for offline dev
          } else {
            response = data.body;
          }
          let item = response._items;
          if (item) {
            item = item[0];
            let guess = item.tags.model_guess[0];
            if (guess) {
              let shelfId = guess.value_id;
              response.productName = productName;
              response.shelfId = shelfId;
              response.confidence = Math.round(guess.confidence * 100);
              if (lookupMap[shelfId]) {
                if (Configs.ROUTE_SHELF === type) {
                  response.shelfName = lookupMap[shelfId];
                } else if (Configs.ROUTE_PRODUCT_TYPE === type) {
                  response.shelfName = lookupMap[shelfId].name;
                  response.attr = _.slice(lookupMap[shelfId].attr, 0, 10);
                }
              }
            }
          }
          // cache data
          apiCache.set(key, response);
          return res.json(response);
        });
    }
  });
});

export default router;
