const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

let plugins = [];
let optimization = {};

module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  lintOnSave: false,
  configureWebpack: {
    plugins,
    optimization,
  },
}
