const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    port: 8080,
    host: '0.0.0.0',
    // public: 'http://192.168.67.67:8080',
  },
  // devServer: { // 环境配置
  //   host: '0.0.0.0',
  //   public: 'http://192.168.67.67:8080',
  //   port: '8080',
  //   https: false,
  //   // disableHostCheck: true,
  //   // open: false // 配置自动启动浏览器
  // },
})
