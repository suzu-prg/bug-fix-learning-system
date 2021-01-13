const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");

const packageJson = require("./package.json");

const isProduction = process.env.NODE_ENV === "production";
const mode = isProduction ? "production" : "development";

module.exports = {
  entry: "./src/index.tsx",
  target: "web",
  output: {
    publicPath: "/",
    filename: "[chunkhash].bundle.mjs",
    chunkFilename: "[chunkhash].chunk.mjs",
  },
  externals: {
    firebase: "firebase",
    "@firebase/app": "firebase",
    react: "React",
    "react-dom": "ReactDOM",
  },
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
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": JSON.stringify(mode),
    }),
    new HtmlWebpackPlugin({
      template: path.resolve("src", `index.ejs`),
      templateParameters: {
        isProd: isProduction,
        firebaseVersion: getDependencyVersion("firebase"),
        reactVersion: getDependencyVersion("react"),
      },
    }),
  ],
  devtool: isProduction ? false : "eval-source-map",
  devServer: {
    contentBase: [path.resolve("dist")],
    historyApiFallback: true,
    open: true,
    port: 8080,
  },
};

function getDependencyVersion(dependencyName) {
  return packageJson.dependencies[dependencyName].replace("^", "");
}
