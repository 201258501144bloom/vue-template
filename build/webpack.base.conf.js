'use strict'
const path = require('path')
const utils = require('./utils')
const config = require('../config')
const vueLoaderConfig = require('./vue-loader.conf')

// 只要通过这个resolve函数，就会把所有的目录先指向根目录，然后在找到相对应的路径
function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

// eslint-loader 的配置文件
const createLintingRule = () => ({
  test: /\.(js|vue)$/,
  loader: 'eslint-loader',
  enforce: 'pre',
  include: [resolve('src'), resolve('test')],
  options: {
    formatter: require('eslint-friendly-formatter'),
    emitWarning: !config.dev.showEslintErrorsInOverlay
  }
})

module.exports = {
  // __dirname 表示的是build 目录， ../ 表示的是项目目录
  context: path.resolve(__dirname, '../'),
  entry: {
    // 这里表示的是 根目录下的 src/main.js
    app: './src/main.js'
  },
  output: {
    // 在 webpack.prod.conf.js 中也会存在一个 output 那么在merge 的合并的时候 会替换掉这个output
    // 下面的的变量其实都是来自 /config index.js 中的变量
    path: config.build.assetsRoot,
    filename: '[name].js',
    // 根据你的环境变量来看， 如果你的是生产环境的话可以是cdn地址，在这里都是项目的跟地址
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },
  resolve: {
    // 当你在vue中引用以下文件的时候，可以不用写他们的后缀名， 但是为了webpack的查找优化， 建议越少越好
    extensions: ['.js', '.vue', '.json'],
    // 别名
    // vue$ 表示确切匹配vue文件不允许有其他的路径
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@components': resolve('src/components'),
      '@router': resolve('src/router'),
      '@util': resolve('src/util'),
      '@store': resolve('src/store'),
      '@assets': resolve('src/assets'),
      '@http': resolve('src/http'),
      '@filter': resolve('src/filter'),
      '@constant': resolve('src/constant'),
      '@layout': resolve('src/layout'),
      '@views': resolve('src/views'),
      '@directive': resolve('src/directive')
    }
  },
  module: {
    rules: [
      // 如果你在开发环境中使用eslint 那么就会调用eslint的一些配置规则
      ...(config.dev.useEslint ? [createLintingRule()] : []),
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [resolve('src'), resolve('test'), resolve('node_modules/webpack-dev-server/client')]
        //  include: [resolve('src'), resolve('test'), resolve('node_modules/webpack-dev-server/client')],
        // 生产环境是不需要他们，提高打包速度 这里被删除 resolve('test'), resolve('node_modules/webpack-dev-server/client')
      },
      // 以下规则都使用 utils.assetsPath() 函数, 我们去 utils.js 中去查看这些函数, 并在哪里讲解他们
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  },
  // node 是防止node下面的方法防止注入到我们的代码中 true就是注入， false 就是不注入， empty 就是空对象
  node: {
    // prevent webpack from injecting useless setImmediate polyfill because Vue
    // source contains it (although only uses it if it's native).
    setImmediate: false,
    // prevent webpack from injecting mocks to Node native modules
    // that does not make sense for the client
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  }
}
