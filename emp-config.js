const {defineConfig} = require('@efox/emp')
const {cdn, esm} = require('./cdn')

const InlineCodePlugin = require('html-inline-code-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { join, resolve } = require('path')

module.exports = defineConfig(({mode}) => {
  // const target = 'es2018'
  const target = 'es5'
  const isESM = !['es3', 'es5'].includes(target)
  return {
    build: {
      target,
      staticDir: 'static',
      outDir: join(__dirname, "./dist/client")
    },
    server: {
      port: 8001,
      devMiddleware: { // 这里是开启 本地访问不了
        index: true,
        mimeTypes: { phtml: 'text/html' },
        publicPath: './dist/views',
        serverSideRender: true,
        writeToDisk: true,
      },
    },
    base: '/',
    resolve: {
      alias: {
        '@src': resolve(__dirname, "./src")
      },
    },
    html: {
      template: resolve('./views/index.html'),
      filename: resolve('./dist/views/index.html'),
      title: '马克相机'
    },
    webpackChain:  (chain, config) => {
        chain.plugin('InlineCodePlugin').use(new InlineCodePlugin({
            begin: false,
            tag: 'script',
            inject: 'body',
            code: `window.INIT_DATA = <%- JSON.stringify(data) %>`
        }))
        chain.plugin('CopyWebpackPlugin').use(new CopyWebpackPlugin({ 
            patterns: [
                {
                  from: resolve(__dirname, "./public"),  
                  to: resolve(__dirname, "./dist/views"), 
                }
             ],
        }))
    },
    empShare: {
      name: 'microHost',
      // esm 共享需要设置 window
      // library: {name: 'microHost', type: 'window'},
      exposes: {
        './App': './src/App',
        // './Button': './src/Button',
        // './importExport/incStore': './src/store/incStore',
      },
      // shared: {
      //   react: {requiredVersion: '^17.0.1'},
      //   'react-dom': {requiredVersion: '^17.0.1'},
      // },
      shareLib: !isESM
        ? cdn(mode)
        : {
            react: esm('react', mode, '17.0.2'),
            'react-dom': esm('react-dom', mode, '17.0.2'),
            mobx: esm('mobx', mode),
            'mobx-react-lite': esm('mobx-react-lite', mode),
          },
      // shareLib: cdn(mode),
    },
  }
})
