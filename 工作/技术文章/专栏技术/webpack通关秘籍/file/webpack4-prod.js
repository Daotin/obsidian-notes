const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssnanoPlugin = require('@intervolga/optimize-cssnano-plugin');
const HashedModuleIdsPlugin = require('webpack/lib/HashedModuleIdsPlugin');
const NamedChunksPlugin = require('webpack/lib/NamedChunksPlugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const PreloadPlugin = require('@vue/preload-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  mode: 'production',
  context: path.resolve(__dirname, 'D:\\code\\hello-world-v4'),
  devtool: 'source-map',
  node: {
    setImmediate: false,
    process: 'mock',
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty',
  },
  output: {
    path: path.resolve(__dirname, 'D:\\code\\hello-world-v4\\dist'),
    filename: 'js/[name].[contenthash:8].js',
    publicPath: '/',
    chunkFilename: 'js/[name].[contenthash:8].js',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'D:\\code\\hello-world-v4\\src'),
      vue$: 'vue/dist/vue.runtime.esm.js',
    },
    extensions: ['.mjs', '.js', '.jsx', '.vue', '.json', '.wasm'],
    modules: [
      'node_modules',
      path.resolve(__dirname, 'D:\\code\\hello-world-v4\\node_modules'),
      path.resolve(__dirname, 'D:\\code\\hello-world-v4\\node_modules\\@vue\\cli-service\\node_modules'),
    ],
    plugins: [
      // config.resolve.plugin('pnp')
    ],
  },
  resolveLoader: {
    modules: [
      path.resolve(__dirname, 'D:\\code\\hello-world-v4\\node_modules\\@vue\\cli-plugin-babel\\node_modules'),
      'node_modules',
      path.resolve(__dirname, 'D:\\code\\hello-world-v4\\node_modules'),
      path.resolve(__dirname, 'D:\\code\\hello-world-v4\\node_modules\\@vue\\cli-service\\node_modules'),
    ],
    plugins: [
      // config.resolve.plugin('pnp-loaders')
    ],
  },
  module: {
    noParse: /^(vue|vue-router|vuex|vuex-router-sync)$/,
    rules: [
      // 此处省略了详细的rules配置
    ],
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendors: {
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
        sourceMap: true,
        cache: true,
        parallel: true,
        extractComments: false,
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
    new OptimizeCssnanoPlugin({
      sourceMap: false,
      cssnanoOptions: {
        preset: [
          'default',
          {
            mergeLonghand: false,
            cssDeclarationSorter: false,
          },
        ],
      },
    }),
    new HashedModuleIdsPlugin({
      hashDigest: 'hex',
    }),
    new NamedChunksPlugin(function () {
      /* omitted long function */
    }),
    new HtmlWebpackPlugin({
      title: 'hello-world-v4',
      templateParameters: function () {
        /* omitted long function */
      },
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        collapseBooleanAttributes: true,
        removeScriptTypeAttributes: true,
      },
      template: path.resolve(__dirname, 'D:\\code\\hello-world-v4\\public\\index.html'),
    }),
    new PreloadPlugin({
      rel: 'preload',
      include: 'initial',
      fileBlacklist: [/\.map$/, /hot-update\.js$/],
    }),
    new PreloadPlugin({
      rel: 'prefetch',
      include: 'asyncChunks',
    }),
    new CopyPlugin([
      {
        from: path.resolve(__dirname, 'D:\\code\\hello-world-v4\\public'),
        to: path.resolve(__dirname, 'D:\\code\\hello-world-v4\\dist'),
        toType: 'dir',
        ignore: ['.DS_Store', { glob: 'index.html', matchBase: false }],
      },
    ]),
  ],
  entry: {
    app: ['./src/main.js'],
  },
};
