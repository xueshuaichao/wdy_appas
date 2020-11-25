const webpack = require('webpack');
const isDev = process.env.NODE_ENV == 'development';

module.exports = {
  lintOnSave: true,
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          modifyVars: {
            'primary-color': '#6370FF',
            'link-color': '#6370FF',
          },
          javascriptEnabled: true,
        },
      },
    },
  },
  devServer: {
    host: 'apaas.testing1.wdeduc.com',
    disableHostCheck: true
  },
  configureWebpack: {
    devtool: isDev? 'eval-source-map' : ''
  }
}
