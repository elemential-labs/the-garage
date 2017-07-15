var path = require('path')
var webpack = require('webpack')

module.exports = {
    entry: './public/app/app.js',
    output: {
        path: __dirname+'/public/dist',
        filename: 'app.js'
    },
    // module: {
    //     loaders: [
    //         { test: path.join(__dirname, 'es6'),
    //           loader: 'babel-loader' }
    //     ]
    // },
    module: {
         loaders: [{
             test: /\.js$/,
             exclude: /node_modules/,
             loader: 'babel-loader'
         }]
     },
  // plugins: [
  //   new webpack.optimize.UglifyJsPlugin({
  //     sourceMap: false,
  //     mangle: true,
  //     minify: true
  //   })
  // ]
}
