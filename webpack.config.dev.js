/**
 * Webpack development configuration
 */
/*globals __dirname:false */
var path = require("path");
var webpack = require("webpack");
var base = require("./webpack.config");

module.exports = {
  cache: true,
  context: base.context,
  entry: base.entry,
  output: {
    path: path.join(__dirname, "dist/js"),
    filename: "bundle.js",
    publicPath: "http://127.0.0.1:2992/js"
  },
  module: {
    loaders: [
      { test: /\.js(x|)?$/, include: path.join(__dirname, "client"),
        loaders: ["babel-loader?optional=runtime"] },
      {
        test: /\.css$/,
        loader: "style-loader!css-loader"
      },
      { test: /\.styl$/,
        loader: "style-loader!css-loader!stylus-loader" },
      { test: /\.woff(2)?$/,
        loader: "url-loader?limit=10000&minetype=application/font-woff" },
      { test: /\.(ttf|eot|svg|png)$/,
        loader: "file-loader" }
    ]
  },
  resolve: base.resolve,
  devtool: "eval-source-map",
  plugins: [
    new webpack.NoErrorsPlugin()
  ]
};
