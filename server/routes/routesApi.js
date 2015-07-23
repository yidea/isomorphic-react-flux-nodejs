/**
 * routesApi
 * /api
 */
import express from "express";
import request from "superagent";
import Configs from "../../config/configs";
import taxonomy from "../data/taxonomy-shelves.json";
let router = express.Router();

// example 1
// http://127.0.0.1:3000/api/camel?from=test
router.get("/camel", (req, res) => {
  let from = req.query.from || "";
  res.json({ from: from, to: from });
});

// example proxy
// http://127.0.0.1:3000/api/qarth/productType?productName=ipad
router.get("/user/:id", (req, res) => {
  console.log(req.params.id);
  res.send(req.params.id);

});

// http://127.0.0.1:3000/api/qarth/shelf?productName=ipad
router.get("/qarth/:type", (req, res) => {
  let type = req.params.type || "",
    productName = req.query.productName || "",
    response = {},
    API_URL = "";
  if (!productName || !type) { return res.json(response); }

  if (type === "shelf") {
    API_URL = Configs.API_QARTH_SHELF;
  } else if (type === "producttype") {
    API_URL = Configs.API_QARTH_PRODTYPE;
  }
  request
    .post(API_URL)
    .send([
      {
        "data": [{"attr_id": "Product Name", "value": productName}], "product_id": "1"
      }])
    .set("Accept", "application/json")
    .end((err, data) => {
      if (err) {
        console.log(err);
        response = require("../data/shelf-ipad.json"); // fallback for offline dev
      } else {
        response = data.body;
      }
      let item = response._items;
      if (item) {
        item = item[0];
        let guess = item.tags.model_guess[0];
        if (guess) {
          let shelfId = guess.value_id;
          if (shelfId && taxonomy[shelfId]) {
            response.productName = productName;
            response.shelfId = shelfId;
            response.shelfName = taxonomy[shelfId];
            if (guess.confidence) {
              response.confidence = Math.round(guess.confidence * 100);
            }
          }
        }
      }
      return res.json(response);
    });
});

export default router;
