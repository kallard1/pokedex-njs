const path = require('path');
const webpack = require('webpack');

const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');

const chalk = require('chalk');
// Environment variable
const dev = process.env.NODE_ENV === 'dev';

const srcPath = path.resolve('./');
const assetsPath = path.resolve(srcPath, 'assets');
const jsPath = path.resolve(assetsPath, 'js');
const scssPath = path.resolve(assetsPath, 'scss');
const imgPath = path.resolve(assetsPath, 'images');

const publicPath = path.resolve('./public');
const outputPath = path.resolve(publicPath, 'dist');

let cssLoaders = [
  {
    loader: 'css-loader',
    options: {
      importLoaders: 1,
      minimize: !dev,
    },
  },
];

if (!dev) {
  cssLoaders.push({
    loader: 'postcss-loader',
  });
}

let config = {
  entry: {
    app: [
      path.join(jsPath, 'app.js'), path.resolve(scssPath, 'app.scss'),
    ],
  },
  output: {
    path: outputPath,
    filename: dev ? 'js/[name].js' : 'js/[name].[chunkhash:10].js',
    publicPath: '/dist/',
  },
  resolve: {
    alias: {
      '@': assetsPath,
      '@js': jsPath,
      '@scss': scssPath,
      '@img': imgPath,
    },
  },
  devServer: {
    contentBase: publicPath,
    overlay: true,
    port: 9000,
  },

  devtool: dev ? 'cheap-module-eval-source-map' : 'source-map',

  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['eslint-loader'],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: cssLoaders,
        }),
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [...cssLoaders, 'sass-loader'],
        }),
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?.*)?$/,
        loader: 'file-loader',
        options: {
          name: '[name].[hash:10].[ext]',
          outputPath: '/fonts/',
        },
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: '/[name].[hash:10].[ext]',
              limit: 8192,
            },
          },
          {
            loader: 'img-loader',
            options: {
              enabled: !dev,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new ExtractTextPlugin({
      filename: dev ? 'css/[name].css' : 'css/[name].[contenthash:8].css',
    }),

    new ManifestPlugin({
      publicPath: 'dist/',
    }),

    new ProgressBarPlugin({
      format: ' :msg (build): [:bar] ' + chalk.green.bold(':percent') + ' (:elapsed seconds)',
      clear: false,
      complete: '#',
      incomplete: '.',
    }),
  ],
};

if (dev) {
  // config.plugins.push(new webpack.NamedModulesPlugin());
} else {
  config.plugins.push(new CleanWebpackPlugin(['dist'], {
    root: publicPath,
    verbose: true,
    dry: false,
  }));

  config.plugins.push(new UglifyJsPlugin({
    sourceMap: true,
  }));
}

module.exports = config;
