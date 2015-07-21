/**
 * routesApi
 */
var express = require("express"),
  request = require("superagent"),
  configs = require("../../config/configs"),
  taxonomy = require("../data/taxonomy-shelves.json");
var router = express.Router();

router.get("/api/camel", function (req, res) {
  var from = req.query.from || "";
  res.json({ from: from, to: from });
});

//http://127.0.0.1:3000/api/qarth?productName=ipad
router.get("/qarth", function (req, res) {
  var productName = req.query.productName || "";
  if (!productName) { return {}; }
  request
    .post(configs.API_QARTH)
    .set("Content-Type", "application/json")
    .send([
      {
        "data": [{"attr_id": "Product Name", "value": productName}], "product_id": "1"
      }])
    .end(function (err, data) {
      var response;
      if (err) {
        console.log(err);
        response = require("../data/qarth-ipad.json");
      } else {
        response = JSON.parse(data.text);
      }
      var item = response["_items"];
      if (item) {
        item = item[0];
        var guess = item.tags["model_guess"][0];
        if (guess) {
          var shelfId = guess.value_id;
          if (shelfId && taxonomy[shelfId]) {
            response.productName = productName;
            response.shelfId = shelfId;
            response.shelfName = taxonomy[shelfId];
            if (guess.confidence) {
              // round confidence
              response.confidence = Math.round(guess.confidence * 100);
            }
          }
        }
      }
      return res.json(response)
    });
});

module.exports = router;
