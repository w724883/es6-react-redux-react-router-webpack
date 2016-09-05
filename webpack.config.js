var webpack = require('webpack');
var path = require('path');
// 分离css文件
var ExtractTextPlugin = require('extract-text-webpack-plugin');
// 动态加载html文件
var HtmlWebpackPlugin = require('html-webpack-plugin');
// 复制文件
// var TransferWebpackPlugin = require('transfer-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');

// var SprityWebpackPlugin = require('sprity-webpack-plugin');

//打开特定url
// var OpenBrowserPlugin = require('open-browser-webpack-plugin');

// 是否开启调试功能，上线需设为false
var DEBUG = process.env.DEBUG;
var cssPath = '';
var jsPath = '';
var staticPath = '';
var config = {
  //页面入口文件配置
  entry: {
      // 线下测试数据，上线需去掉
      // bnjs:['./mockup/bnjs.js'],
      // zepto:['./components/zepto/zepto.js'],
      index : [
          // 'webpack-dev-server/client?http://m.ijuanshi.com/',
          // 'webpack/hot/only-dev-server',
          // 'webpack-hot-middleware/client',
          './src/index.js'
      ],
  },
  //入口文件输出配置
  output: {
      path:path.join(__dirname, 'output'),
      filename: jsPath+'js/[name].js',
  },
  // 插件项
  plugins: [
      new webpack.optimize.CommonsChunkPlugin({
          name: "common",
          filename:"common.js",
          minChunks: 2
      }),
      new HtmlWebpackPlugin({
          filename: 'index.html',
          inject: 'body',
          template: './src/html/index.html',
          chunksSortMode:'dependency',
          hash:true,
      }),
      // 代码压缩
      // new webpack.optimize.UglifyJsPlugin({
      //     compress: {
      //         warnings: false, // Suppress uglification warnings
      //     },
      // }),
      new ExtractTextPlugin(cssPath+"css/[name].css"),

      // definePlugin 接收字符串插入到代码当中, 所以你需要的话可以写上 JS 的字符串
      // new webpack.DefinePlugin({
      //   DEBUG:DEBUG
      // }),
      // new webpack.HotModuleReplacementPlugin(),
      // new webpack.ProvidePlugin({
      //     $:path.join(__dirname, "components/zepto/zepto.js")
      // }),

      // new SprityWebpackPlugin({
      //     src:'./src/brands/img',
      //     out:'./output/brands/img'
      // })
      // // 查找相等或近似的模块，避免在最终生成的文件中出现重复的模块
      // new webpack.optimize.DedupePlugin(),
      // // 按引用频度来排序 ID，以便达到减少文件大小的效果
      // new webpack.optimize.OccurenceOrderPlugin(),
      // new webpack.optimize.AggressiveMergingPlugin({
      //         minSizeReduce: 1.5,
      //         moveToParents: true
      // }),
  ],
  module: {
      //加载器配置
      loaders: [
          {
              test: /\.css$/,
              // loader: 'style-loader!css-loader'
              loader: ExtractTextPlugin.extract("style-loader", "css-loader")
          },
          // {
          //   test: /\.js$/,
          //   loaders: [ 'babel' ],
          //   exclude: /node_modules/,
          //   // query: {
          //   //   presets: ['es2015']
          //   // }
          //   // include: __dirname
          // },
          {
              test: /\.js[x]?$/,
              exclude:/node_modules/,
              loaders: ['jsx-loader','babel-loader?presets[]=react,presets[]=es2015'],
              exclude: /node_modules/,
              // query: {
              //   presets: ['react','es2015']
              // }
              // loader: 'react-hot!jsx-loader?harmony',
          },
          {
              test: /\.scss$/,
              // loaders: ["style-loader", "css-loader","sass-loader"]
              loader: ExtractTextPlugin.extract("style-loader", "css-loader!sass-loader")
          },
          {
              test: /\.(jpe?g|png|gif|eot|ttf|woff|svg)/i,
              loader: 'url-loader?limit=5120&name='+staticPath+'static/[name].[ext]'
          },
          {
              test: /masonry|imagesloaded|fizzy\-ui\-utils|desandro\-|outlayer|get\-size|doc\-ready|eventie|eventemitter/,
              loader: 'imports?define=>false&this=>window'
          }
          // {
          //     test: /\.(eot|ttf|woff|svg)/i,
          //     loader: 'url-loader?prefix=font'
          // },
          // {
          //     test: require.resolve("./src/common/js/selector.js"),
          //     loader: "imports?BNJS=../../../mockup/bnjs.js"
          // },
      ]
  },

  //其它解决方案配置
  resolve: {
      extensions: ['', '.js', '.jsx', '.json', '.scss'],
      alias:{
          "zepto":(DEBUG ? path.join(__dirname, "src/libs/zepto/zepto.js") : path.join(__dirname, "src/libs/zepto/zepto.min.js")),
          "swiper":(DEBUG ? path.join(__dirname, "src/libs/swiper/swiper.jquery.js") : path.join(__dirname, "src/libs/swiper/swiper.jquery.min.js")),
          // "react":(DEBUG ? path.join(__dirname, "components/react/react.js") : path.join(__dirname, "components/react/react.min.js")),
          // "react-dom":(DEBUG ? path.join(__dirname, "components/react/react-dom.js") : path.join(__dirname, "components/react/react-dom.min.js")),
          // "iscroll":path.join(__dirname, "components/iscroll/iscroll.js")
      }
  }
};

if(DEBUG){
    // config.entry.bnjs = ['./mockup/bnjs.js'];
    config.devtool = 'cheap-module-eval-source-map';
    //将test文件copy到output
    config.plugins.push(new CopyWebpackPlugin([
        { from: './src/test',to:'./test' }
    ]));
    config.plugins.push(new webpack.DefinePlugin({
      DEBUG:DEBUG
    }));

    // 配置静态资源引入路径
    config.output.publicPath = 'http://m.ijuanshi.com/';
    // config.plugins.push(new OpenBrowserPlugin({ url: 'http://localhost:3000' }));
    
}else{
    config.plugins.push(new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false // Suppress uglification warnings
        }
    }));
    config.plugins.push(new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': '"production"'
      },
      DEBUG:DEBUG
    }));
    
    // 配置静态资源引入路径
    config.output.publicPath = 'http://m.ijuanshi.com/';

    cssPath = '../../ijuanshi/public/frontend/';
    jsPath = '../../ijuanshi/public/frontend/';
    staticPath = '../../ijuanshi/public/frontend/';
    
}
module.exports = config;