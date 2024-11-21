const path = require('path');
const ShebangPlugin = require('webpack-shebang-plugin');

// 创建基础配置
const baseConfig = {
  entry: './git-log.js',
  target: 'node',
  optimization: {
    minimize: false
  },
  plugins: [
    new ShebangPlugin()
  ]
};

// 导出多个配置
module.exports = [
  // CommonJS 配置
  {
    ...baseConfig,
    output: {
      filename: 'git-log.cjs',
      path: path.resolve(__dirname, 'dist'),
      library: {
        type: 'commonjs2'
      }
    }
  }
]; 