// webpack.config.js
const webpack = require('webpack');
var path = require('path');

module.exports = {
  entry: './src/uploader.js',
  output: {
    filename: 'uploader.js',
    path: path.resolve(__dirname, 'dist'),
    library:'Uploader',
    libraryTarget: 'umd',
  },
  devtool:'source-map',
  module:{
      rules: [{
    test: /\.js$/,
    exclude: /(node_modules|bower_components)/,
    use: {
      loader: 'babel-loader',
      options: {
        "presets": [
          [
            "env", {
              "targets": {
                "browsers": ["last 2 versions", "safari >= 7"]
              }
            }
          ]
        ]
      }
    }
  }],
  },
  plugins: [
    // new webpack.optimize.UglifyJsPlugin({
    //   sourceMap: options.devtool && (options.devtool.indexOf("sourcemap") >= 0 || options.devtool.indexOf("source-map") >= 0)
    // })
  ]
};