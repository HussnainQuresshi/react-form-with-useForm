var webpack = require("webpack");
var path = require("path");
var CopyWebpackPlugin = require("copy-webpack-plugin");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  context: path.resolve("src"),
  entry: [
    "webpack-dev-server/client?http://0.0.0.0:9001",
    "webpack/hot/only-dev-server",
    "./src",
  ],
  output: {
    path: path.resolve("/dist/"),
    publicPath: "/public/assets/",
    filename: "bundle.js",
  },
  devtool: "source-map",
  devServer: {
    contentBase: "public",
    hot: true,
    headers: { "Access-Control-Allow-Origin": "*" },
  },
  resolve: {
    extensions: [
      "",
      ".webpack.js",
      ".web.js",
      ".ts",
      ".tsx",
      ".js",
      ".css",
      ".scss",
    ],
  },
  plugins: [
    new ExtractTextPlugin("styles.css"),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.BannerPlugin(
      "************\nWelcome to Stormify\n***************",
    ),
    new CopyWebpackPlugin([
      { from: "./../node_modules/react/dist/react.js", to: "lib/react.js" },
      {
        from: "./../node_modules/react-dom/dist/react-dom.js",
        to: "lib/react-dom.js",
      },
    ]),
  ],
  module: {
    preloaders: [
      {
        test: /\.js$/,
        loader: "source-map-loader",
      },
    ],
    loaders: [
      {
        test: /\.tsx$/,
        loader: "ts-loader",
        exclude: /node_modules\/typings\/public/,
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract(
          "style-loader",
          "css-loader!autoprefixer-loader",
        ),
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract(
          "style-loader",
          "css-loader!autoprefixer-loader!sass-loader",
        ),
        exclude: /node_modules/,
      },
      {
        test: /\.(jpe?g|png|gif)$/i,
        loader: "file?name=[name].[ext]",
      },
      {
        test: /\.eot(\?v=\d+.\d+.\d+)?$/,
        loader: "file",
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: "url-loader?limit=10000&mimetype=application/font-woff",
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url-loader?limit=10000&mimetype=application/octet-stream",
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url?limit=10000&mimetype=image/svg+xml",
      },
      {
        test: /\.ico$/,
        loader: "file?name=[name].[ext]",
      },
    ],
  },
  externals: {
    react: "React",
    "react-dom": "ReactDOM",
  },
};
