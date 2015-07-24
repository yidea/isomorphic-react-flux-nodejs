/**
 * jsonTransform
 *
 * transform a json [] to {}
 */
var fs = require("fs");
var _ = require("lodash");
var ProductType = require("../server/data/product-type-attributes.json");

var obj = _.indexBy(ProductType, "id");
fs.writeFile("../server/data/new.json", JSON.stringify(obj, null, 2), function(err) {
  if (err) {
    console.log(err);
  } else {
    console.log("success");
  }
});

