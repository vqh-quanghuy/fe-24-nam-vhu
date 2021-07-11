const path = require('path');

module.exports = {
  outputDir: path.resolve(__dirname, '../server/public'),
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000'
      }
    }
  },
  chainWebpack: (config) => {
    config
      .plugin('html')
      .tap(args => {
          args[0].title = 'Lời chúc chào mừng 24 năm thành lập trường Đại học Văn Hiến';
          args[0].meta = {viewport: 'width=device-width,initial-scale=1.0'};

      return args;
    })
  }
}