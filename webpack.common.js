const path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var MiniCssExtractPlugin = require('mini-css-extract-plugin');

const OutputDir = path.resolve(__dirname, 'wwwroot');
const IndexTemplate = path.resolve(__dirname, 'src/index.template.html');

module.exports = {  
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: OutputDir,  
    chunkFilename: '[name].bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: process.env.NODE_ENV === "development",
            },
          },
          'css-loader',
        ],
      },
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            plugins: ['@babel/plugin-proposal-class-properties', 'syntax-async-functions', '@babel/plugin-syntax-dynamic-import'],
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  plugins: [    
    new HtmlWebpackPlugin({
      template: IndexTemplate
    }),
    new MiniCssExtractPlugin({
      // Options similar to the same options in webpackOptions.output
      // both options are optional
      filename: '[name].css',
      chunkFilename: '[id].css',
    })
  ]
};