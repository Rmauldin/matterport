const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: {
      index: './src/index.ts',
  },
  devtool: 'source-map',
  devServer: {
      port: 8000
  },
  plugins: [
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        title: 'Development',
        template: 'index.html',
        inject: true
      }),
      new CopyPlugin([
        { from: './static', to: './static' }
      ]),
  ],
  output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist/'),
      publicPath: '/matterport/tag-placer/dist/',
      clean: false,
  },
  resolve: {
      extensions: [ '.tsx', '.ts', '.js', '.json', ],
  },
  module: {
      rules: [
          {
              test: /\.(ts|tsx)$/,
              use: 'ts-loader'
          }
      ]
  },
};
