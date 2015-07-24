/**
 * Webpack production configuration
 */
/*globals __dirname:false */
var path = require("path");
var webpack = require("webpack");
var CleanPlugin = require("clean-webpack-plugin");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var StatsWriterPlugin = require("webpack-stats-plugin").StatsWriterPlugin;
var autoprefixer = require("autoprefixer-stylus");

module.exports = {
  cache: true,
  context: path.join(__dirname, "client"),
  entry: "./app.jsx",
  output: {
    path: path.join(__dirname, "dist/js"),
    filename: "bundle.[hash].js"
  },
  module: {
    loaders: [
      {
        test: /\.js(x|)?$/,
        include: path.join(__dirname, "client"),
        loaders: ["babel-loader?optional=runtime"]
      },
      {
        test: /\.styl$/,
        loader: ExtractTextPlugin.extract("style-loader", "css-loader!stylus-loader")
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract("style-loader", "css-loader")
      },
      {
        test: /\.woff(2)?$/,
        loader: "url-loader?limit=10000&minetype=application/font-woff"
      },
      {
        test: /\.(ttf|eot|svg|png)$/,
        loader: "file-loader"
      }
    ]
  },
  stylus: {
    use: [autoprefixer({ browsers: ["last 2 versions"] })]
  },
  resolve: {
    modulesDirectories: ["node_modules", "client", "node_modules/@walmart"],
    extensions: ["", ".js", ".jsx"],
    // make alias for module import at /config import Configs from "config/configs";
    alias: {
      config: path.resolve(__dirname, "config")
    }
  },
  plugins: [
    // TODO: add webpack-notifier for dev ?
    // Clean
    new CleanPlugin(["dist"]),
    new ExtractTextPlugin("style.[hash].css"),

    // Optimize
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin(),

    // Meta, debug info.
    new webpack.DefinePlugin({
      "process.env": {
        // Signal production mode for React JS libs.
        NODE_ENV: process.env.NODE_ENV
      }
    }),

    new webpack.SourceMapDevToolPlugin(
      "../map/bundle.[hash].js.map",
      "\n//# sourceMappingURL=http://127.0.0.1:3001/dist/map/[url]"
    ),
    new StatsWriterPlugin({
      path: path.join(__dirname, "dist/server"),
      filename: "stats.json"
    })
  ]
};
