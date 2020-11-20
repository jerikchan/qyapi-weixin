const path = require('path');

module.exports = {
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          javascriptEnabled: true,
        },
      },
    },
  },
  chainWebpack: config => {
    config.resolve.alias.set('@', path.join(__dirname, 'src'));
    config.devtool('source-map');
  },
  publicPath: process.env.VUE_APP_PUBLIC_PATH
};