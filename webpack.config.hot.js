/**
 * Webpack hot configuration
 */
var base = require("./webpack.config.dev");
var path = require("path");
var webpack = require("webpack");
var ExtractTextPlugin = require("extract-text-webpack-plugin");

// **Hackage**: Inject the react hot loader into the **first** entry, which we assume will be
// the base JavaScript transform.
//
// Note that this actually _mutates_ the object, so you can't use the dev config in same process.
var jsLoader = base.module.loaders[0];
jsLoader.loaders = ["react-hot"].concat(jsLoader.loaders);

module.exports = {
  cache: true,
  context: base.context,
  entry: [
    "webpack-dev-server/client?http://127.0.0.1:2992",
    "webpack/hot/only-dev-server",
    base.entry
  ],
  output: base.output,
  module: base.module,
  resolve: base.resolve,
  devtool: "eval-source-map",
  plugins: base.plugins
};
