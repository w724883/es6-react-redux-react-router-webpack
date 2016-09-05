var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var proxy = require('proxy-middleware');
var url = require('url');
var config = require('./webpack.config');
var app = new (require('express'))();

app.use('/', proxy(url.parse('http://m.ijuanshi.com/')));
new WebpackDevServer(webpack(config), {
	publicPath: config.output.publicPath,
	hot: true,
	historyApiFallback: true
}).listen(3000, 'localhost', function (err, result) {
	if (err) {
	  return console.log(err);
	}
});


// var webpack = require('webpack');
// var WebpackDevServer = require('webpack-dev-server');
// var config = require('./webpack.config');
// var proxy = require('proxy-middleware');
// var url = require('url');
// module.exports = function(app) {
//   // 使用3000端口
//   app.use('/', proxy(url.parse('http://127.0.0.1:3000/js/out')));
//   var server = new WebpackDevServer(webpack(config), {
//     publicPath: config.output.publicPath,
//     hot: true,
//     noInfo: false,
//     historyApiFallback: true,
//     stats: { colors: true },
//   }).listen(3000, '127.0.0.1', function(err,result) {
//     if (err) {
//     console.log(err);
//   }
//   console.log('Listening at localhost:3000');
//   });
// }
