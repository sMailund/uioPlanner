/*jshint esversion: 6 */

console.log(`Running webpack as ${process.env.NODE_ENV}`);

const webpack = require('webpack');

const config = {
  entry: './webpackEntry.js',
  output: {
    path: __dirname + '/public/javascripts',
    filename: 'scripts.bundle.js'
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader'
    }]
  },
  plugins: [
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery"
        }),
    ]
};


//push plugins that will only run during production
if (process.env.NODE_ENV === 'production') {
  config.plugins.push(new webpack.optimize.UglifyJsPlugin());
}


module.exports = config;
