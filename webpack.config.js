var webpack = require('webpack');

module.exports = {
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
        new webpack.optimize.UglifyJsPlugin()
    ]
};

//hva med public output path??
