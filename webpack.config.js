var webpack = require('webpack');

module.exports = {
  entry: './webpackEntry.js',
  output: {
    path: __dirname + '/public/javascripts',
    filename: 'scripts.bundle.js'
  }
};
