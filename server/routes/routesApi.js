/**
 * routesApi
 * /api
 */
import express from "express";
import request from "superagent";
import Configs from "../../config/configs";
import Taxonomy from "../data/taxonomy-shelves.json";
import ProductType from "../data/product-type-attributes.json";
let router = express.Router();

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
    lookupMap;
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

  request
    .post(apiUrl)
    .send([{"data": [{"attr_id": "Product Name", "value": productName}], "product_id": "1"}])
    .set("Accept", "application/json")
    .end((err, data) => {
      if (err) {
        console.log(err);
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
            if (type === Configs.ROUTE_SHELF) {
              response.shelfName = lookupMap[shelfId];
            } else if (type === Configs.ROUTE_PRODUCT_TYPE) {
              response.shelfName = lookupMap[shelfId].name;
              response.attr = lookupMap[shelfId].attr;
            }
          }
        }
      }
      return res.json(response);
    });
});

export default router;
