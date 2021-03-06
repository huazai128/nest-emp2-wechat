const {defineConfig} = require('@efox/emp')
const {cdn, esm} = require('./cdn')

const InlineCodePlugin = require('html-inline-code-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { join, resolve } = require('path')

module.exports = defineConfig(({ mode, env }) => {
  process.env.EMP_ENV = env || 'dev'
  const target = 'es5'
  const isESM = !['es3', 'es5'].includes(target)
  const build = {
    target,
    staticDir: 'static',
    outDir: join(__dirname, "./dist/client"),
  }
  return {
    build: build,
    server: {
      port: 8003,
      devMiddleware: { // 这里是开启 本地访问不了
        index: true,
        mimeTypes: { phtml: 'text/html' },
        publicPath: './dist/client',
        serverSideRender: true,
        writeToDisk: true,
      },
    },
    dtsPath: {
      '@microHost': 'http://172.25.230.139:8001/empShareTypes/index.d.ts',
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
    webpackChain: (chain, config) => {
			if (env !== 'dev') { 
                chain.devtool('source-map') // 怎样分离map文件，防止上传到线上。用于日志上报时获取准确错误信息.
                // 上传至CDN时要过滤map文件，打包成功后也要移除map 文件
			}
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
      name: 'microApp',
      // esm 共享需要设置 window
    //   library: {name: 'nestEmp', type: 'window'},
      remotes: {
        '@microHost': `microHost@http://172.25.230.139:8001/emp.js`,
      },
      exposes: {
        './App': './src/App',
      },
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
