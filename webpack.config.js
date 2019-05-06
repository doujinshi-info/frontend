const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ServiceWorkerWebpackPlugin = require('serviceworker-webpack-plugin');
const Dotenv = require('dotenv-webpack');

module.exports = {
  entry: { main: './src/js/index.js' },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'app.[chunkhash].js'
  },
  resolve: {
    modules: ['node_modules'],
    descriptionFiles: ['package.json'],
    extensions: ['.js', '.json'],
    alias: {
      pace: 'pace-progress'
    }
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        include: [
          path.resolve('src'),
          path.resolve('node_modules/tokenfield')
        ],
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              ['@babel/preset-env', {
                targets: {
                  ie: 11
                },
                useBuiltIns: 'usage',
                debug: true
              }]
            ]
          }
        }
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'sass-loader']
        })
      },
      {
        test: /\.(jpe?g|png|svg|ico|xml|webmanifest)$/,
        use: {
          loader: "file-loader",
          options: {
            name: '[name].[ext]',
            outputPath: 'assets/',
            publicPath: '/assets/'
          }
        }
      }
    ]
  },
  plugins: [
    new Dotenv({
      systemvars: true,
    }),
    new ExtractTextPlugin({
      filename: 'style.[chunkhash].css',
      disable: false,
      allChunks: true
    }),
    new HtmlWebpackPlugin({
      inject: false,
      hash: true,
      template: './src/index.html',
      filename: 'index.html',
    }),
    new ServiceWorkerWebpackPlugin({
      entry: path.join(__dirname, 'src/js/sw.js'),
    }),
    new CleanWebpackPlugin(['dist'])
  ],
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 8000,
    publicPath: '/',
    historyApiFallback: true
  }
};
