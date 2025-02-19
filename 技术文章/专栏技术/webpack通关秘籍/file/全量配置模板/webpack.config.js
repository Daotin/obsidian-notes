const { pathResolve } = require('./build/utils.js'); // eslint-disable-line
const devConfig = require('./build/webpack.dev.conf.js'); // eslint-disable-line
const buildConfig = require('./build/webpack.prod.conf.js');
// 分析工具
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

// 资源缓存
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');

// 抽离稳定的第三方库，避免重复打包
const DllReferencePlugin = require('webpack').DllReferencePlugin;

// 公共函数
const { versionSet } = require('./build/utils'); // eslint-disable-line

// 是否为开发环境
const isDevelopment = process.env.NODE_ENV == 'development';

const vueWebpackConfig = () => {
  let envConfig = {};

  if (isDevelopment) {
    // 开发
    envConfig = devConfig;
  } else {
    // 构建
    versionSet();
    envConfig = buildConfig;
  }

  const vueConfig = {
    // 环境配置
    ...envConfig,
    productionSourceMap: isDevelopment, // 是否在构建生产包时生成sourcdeMap

    // 拓展webpack配置
    chainWebpack: (config) => {
      //  ============ 配置别名 ============
      config.resolve.alias
        .set('@build', pathResolve('../build')) // 构建目录
        .set('@', pathResolve('../src'))
        .set('@api', pathResolve('../src/api'))
        .set('@utils', pathResolve('../src/utils'))
        .set('@views', pathResolve('../src/views'));

      // ============ svg处理 ============
      const svgRule = config.module.rule('svg');
      // 清除已有的所有 loader。
      // 如果你不这样做，接下来的 loader 会附加在该规则现有的 loader 之后。
      svgRule.uses.clear();

      // 添加要替换的 loader
      svgRule.use('svg-sprite-loader').loader('svg-sprite-loader').options({
        symbolId: 'icon-[name]',
      });

      // ============ 压缩图片 ============
      config.module.rule('images').use('image-webpack-loader').loader('image-webpack-loader').options({ bypassOnDebug: true }).end();

      // ============ 打包分析工具 ============
      if (!isDevelopment) {
        if (process.env.npm_config_report) {
          config.plugin('webpack-bundle-analyzer').use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin).end();
          config.plugins.delete('prefetch');
        }
      }

      // ============ CDN资源引入 ============
      config.externals({
        // echarts: 'echarts',
        nprogress: 'NProgress',
      });
    },

    configureWebpack: (config) => {
      // 尽量保证项目中文件后缀的精确
      config.resolve.extensions = ['.ts', '.js', '.vue', '.json'];

      // 处理 babel-loader
      config.module.rules[12].use.unshift({
        loader: 'thread-loader',
      });

      config.plugins.push(
        // 为模块提供中间缓存，缓存路径是：node_modules/.cache/hard-source
        new HardSourceWebpackPlugin({
          root: process.cwd(),
          directories: [],
          environmentHash: {
            root: process.cwd(),
            directories: [],
            // 配置了files 的主要原因是解决配置更新，cache 不生效了的问题，配置后有包的变化，plugin 会重新构建一部分cache
            files: ['package.json', 'yarn.lock'],
          },
        }),

        // DllReferencePlugin 插件
        new DllReferencePlugin({
          context: __dirname,
          // manifest就是我们第 2 步中打包出来的 json 文件
          manifest: require('./vendor-manifest.json'),
        }),

        // 分析工具
        new SpeedMeasurePlugin(),
        new BundleAnalyzerPlugin()
      );
    },
  };

  return vueConfig;
};

module.exports = vueWebpackConfig();
