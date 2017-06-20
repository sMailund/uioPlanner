var webpack = require('webpack');

module.exports = {
  entry: './webpackEntry.js',
  output: {
    path: __dirname + '/public/javascripts',
    filename: 'scripts.bundle.js'
  },
  plugins: [
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery"
        })
    ]
};

//hva med public output path??
