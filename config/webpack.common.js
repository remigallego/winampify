const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const isDevelopment = process.env.NODE_ENV !== "production";

console.log(isDevelopment ? "DEV" : "PROD");
module.exports = {
  mode: isDevelopment ? "development" : "production",
  resolve: {
    extensions: [".js", ".ts", ".tsx"]
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.(js|ts|tsx)$/,
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader",
          options: {
            envName: "library",
            plugins: [
              isDevelopment && require.resolve("react-refresh/babel")
            ].filter(Boolean)
          }
        }
      },
      {
        test: /\.(wsz|mp3|png|ico|jpg|svg)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              emitFile: true,
              name: "[path][name]-[hash].[ext]"
            }
          }
        ]
      }
    ],
    noParse: [/jszip\.js$/]
  },
  plugins: [
    isDevelopment && new ReactRefreshWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: "./index.html"
    })
  ].filter(Boolean),
  entry: {
    winampify: ["./js/index.tsx"]
  },
  devServer: {
    hot: true
  },
  output: {
    filename: "[name]-[hash].js",
    chunkFilename: "[name]-[hash].js",
    publicPath: "/",
    path: path.resolve(__dirname, "../built")
  },
  node: {
    fs: "empty"
  }
};
