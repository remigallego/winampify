const webpack = require("webpack");
const merge = require("webpack-merge");
const workboxPlugin = require("workbox-webpack-plugin");
const common = require("./webpack.common.js");

const config = merge(common, {
  devtool: "source-map",
  plugins: [
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify("production")
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      // TODO: Is this needed with the devtool setting above?
      sourceMap: true
    }),
    new workboxPlugin.GenerateSW({
      // Note: CloudFlare is configued to not cache this file, as suggested in the:
      // "Avoid changing the URL of your service worker script" sectio of:
      // https://developers.google.com/web/fundamentals/primers/service-workers/lifecycle
      swDest: "service-worker.js",
      clientsClaim: true,
      skipWaiting: true
    })
  ]
});

module.exports = config;
