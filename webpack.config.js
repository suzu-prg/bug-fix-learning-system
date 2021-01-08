const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const isProduction = process.env.NODE_ENV === "production";
const mode = isProduction ? "production" : "development";

module.exports = {
  entry: "./src/index.tsx",
  target: "web",
  mode,
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".json", ".jsx"],
  },
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        options: {
          cacheDirectory: false,
        },
      },
      {
        test: /\.(gif|jpe?g|png|svg)$/,
        loader: "file-loader",
        options: {
          publicPath: "/",
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve("src", `index.ejs`),
    }),
  ],
  devtool: isProduction ? false : "eval-source-map",
  devServer: {
    contentBase: [path.resolve("dist")],
    historyApiFallback: true,
    open: true,
  },
};
