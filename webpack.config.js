const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const glob = require('glob');
const path = require('path');
const PUBLIC = 'public';
const DIST_DIR = path.resolve(__dirname, PUBLIC);
const MODE = {
  DEVELOPMENT: 'development',
  PRODUCTION: 'production'
};
const OUTPUT = {
  JS: `js/kakaopay.bundle`,
  HTML: `html/`,
  CSS: `css/style`
};

const CONFIG = {
  entry: glob.sync('./src/**/index.js').reduce(
    (acc, pathname) => {
      acc[OUTPUT.JS].push(pathname);
      return acc;
    },
    {
      [OUTPUT.JS]: ['@babel/polyfill', 'classlist-polyfill']
    }
  ),
  output: {
    filename: '[name].js',
    path: DIST_DIR
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        include: path.join(__dirname),
        use: [
          {
            loader: 'html-loader'
          }
        ]
      },
      {
        test: /\.js$/,
        include: path.join(__dirname),
        exclude: /(node_modules)/,
        use: [
          {
            loader: 'babel-loader'
          }
        ]
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './src/html/index.html',
      filename: `index.html`
    }),
    new MiniCssExtractPlugin({
      filename: `${OUTPUT.CSS}.css`
    }),
    new webpack.ProgressPlugin()
  ]
};
module.exports = (env, options) => {
  const { mode } = options;

  if (MODE.DEVELOPMENT === mode) {
    CONFIG.devServer = {
      host: '127.0.0.1',
      contentBase: __dirname,
      publicPath: `/${PUBLIC}/`,
      hot: true,
      open: true,
      port: 8083,
      // writeToDisk: true,
      openPage: `http://127.0.0.1:8083/${PUBLIC}/`
    };
    CONFIG.plugins.push(new webpack.HotModuleReplacementPlugin());
  } else {
    // production
  }
  return CONFIG;
};
