const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const { DefinePlugin } = require('webpack');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('@soda/friendly-errors-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const ESLintWebpackPlugin = require('eslint-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = {
  mode: 'production',
  context: path.resolve(__dirname, 'D:\\code\\hello-world'),
  devtool: 'source-map',
  output: {
    hashFunction: 'xxhash64',
    path: path.resolve(__dirname, 'D:\\code\\hello-world\\dist'),
    filename: 'js/[name].[contenthash:8].js',
    publicPath: '/',
    chunkFilename: 'js/[name].[contenthash:8].js',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'D:\\code\\hello-world\\src'),
      vue$: 'vue/dist/vue.runtime.esm.js',
    },
    extensions: ['.mjs', '.js', '.jsx', '.vue', '.json', '.wasm'],
    modules: [
      'node_modules',
      path.resolve(__dirname, 'D:\\code\\hello-world\\node_modules'),
      path.resolve(__dirname, 'D:\\code\\hello-world\\node_modules\\@vue\\cli-service\\node_modules'),
    ],
  },
  resolveLoader: {
    modules: [
      path.resolve(__dirname, 'D:\\code\\hello-world\\node_modules\\@vue\\cli-plugin-babel\\node_modules'),
      path.resolve(__dirname, 'D:\\code\\hello-world\\node_modules\\@vue\\cli-service\\lib\\config\\vue-loader-v15-resolve-compat'),
      'node_modules',
      path.resolve(__dirname, 'D:\\code\\hello-world\\node_modules'),
      path.resolve(__dirname, 'D:\\code\\hello-world\\node_modules\\@vue\\cli-service\\node_modules'),
    ],
  },
  module: {
    noParse: /^(vue|vue-router|vuex|vuex-router-sync)$/,
    rules: [
      // Your rules here
    ],
  },
  optimization: {
    realContentHash: false,
    splitChunks: {
      cacheGroups: {
        defaultVendors: {
          name: 'chunk-vendors',
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          chunks: 'initial',
        },
        common: {
          name: 'chunk-common',
          minChunks: 2,
          priority: -20,
          chunks: 'initial',
          reuseExistingChunk: true,
        },
      },
    },
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            arrows: false,
            collapse_vars: false,
            comparisons: false,
            computed_props: false,
            hoist_funs: false,
            hoist_props: false,
            hoist_vars: false,
            inline: false,
            loops: false,
            negate_iife: false,
            properties: false,
            reduce_funcs: false,
            reduce_vars: false,
            switches: false,
            toplevel: false,
            typeofs: false,
            booleans: true,
            if_return: true,
            sequences: true,
            unused: true,
            conditionals: true,
            dead_code: true,
            evaluate: true,
          },
          mangle: {
            safari10: true,
          },
        },
        parallel: true,
        extractComments: false,
      }),
      new CssMinimizerPlugin({
        parallel: true,
        minimizerOptions: {
          preset: [
            'default',
            {
              mergeLonghand: false,
              cssDeclarationSorter: false,
            },
          ],
        },
      }),
    ],
  },
  plugins: [
    new VueLoaderPlugin(),
    new DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"',
        BASE_URL: '"/"',
      },
    }),
    new CaseSensitivePathsPlugin(),
    new FriendlyErrorsWebpackPlugin({
      additionalTransformers: [
        function () {
          /* omitted long function */
        },
      ],
      additionalFormatters: [
        function () {
          /* omitted long function */
        },
      ],
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash:8].css',
      chunkFilename: 'css/[name].[contenthash:8].css',
    }),
    new HtmlWebpackPlugin({
      title: 'hello-world',
      scriptLoading: 'defer',
      templateParameters: function () {
        /* omitted long function */
      },
      template: path.resolve(__dirname, 'D:\\code\\hello-world\\public\\index.html'),
    }),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'D:\\code\\hello-world\\public'),
          to: path.resolve(__dirname, 'D:\\code\\hello-world\\dist'),
          toType: 'dir',
          noErrorOnMissing: true,
          globOptions: {
            ignore: ['**/.DS_Store', path.resolve(__dirname, 'D:/code/hello-world/public/index.html')],
          },
          info: {
            minimized: true,
          },
        },
      ],
    }),
    new ESLintWebpackPlugin({
      extensions: ['.js', '.jsx', '.vue'],
      cwd: path.resolve(__dirname, 'D:\\code\\hello-world'),
      cache: true,
      cacheLocation: path.resolve(__dirname, 'D:\\code\\hello-world\\node_modules\\.cache\\eslint\\6b9c71f2.json'),
      context: path.resolve(__dirname, 'D:\\code\\hello-world'),
      failOnWarning: false,
      failOnError: true,
      eslintPath: path.resolve(__dirname, 'D:\\code\\hello-world\\node_modules\\eslint'),
      formatter: 'stylish',
    }),
  ],
  entry: {
    app: ['./src/main.js'],
  },
};
