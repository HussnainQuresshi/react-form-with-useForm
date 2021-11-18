var devConfig = require('./webpack.config.js');
var webpackStripLoader = require('strip-loader');

var stripLoader = {
    test: [/\.js$/, /\.ts$/],
    exclude: /node_module/,
    loader: webpackStripLoader.loader(['console.log'])
};

devConfig.module.loaders.push(stripLoader);

module.exports = devConfig;