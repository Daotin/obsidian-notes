# Vue2 项目优化

## 优化打包速度

首先看开发环境启动时间跟生产打包时间是否差异太大，如果是的话，这很大可能是因为`生产环境和开发环境之间的webpack配置差异`。

如果不是，这进行下面分析：

1. **测量与分析**：

   - 使用 `webpack-bundle-analyzer` 插件可以帮助你可视化输出的内容，查看是否有不必要的大包。
   - 使用 `speed-measure-webpack-plugin` 可以测量各个 loader 和插件的执行时间，从而找到哪个环节特别慢。

2. **开始排查**：

   - 检查 `node_modules` 是否被错误地打包进最终的 bundle 中。
   - 看看是否使用了大量的图片、字体文件等资源，是否可以进行优化或按需加载。

3. **优化配置**：

   - **Loaders**：确认是否可以使用缓存，如 `babel-loader` 的缓存设置。
   - **Externals**：优化 Loader 的文件搜索范围，考虑是否可以将某些库设置为外部引用，以减少打包时间。
   - **Code Splitting**：利用 `splitChunks` 进行代码拆分，异步加载不必要的代码。
   - **Source Map**：确认是否真的需要生成 source map，或者选择一个构建速度更快的 source map 类型。
   - DllPlugin 可以将特定的类库提前打包然后引入，只有当类库更新版本才有需要重新打包

4. **使用更高效的工具**：

   - 考虑是否可以使用 `[HardSourceWebpackPlugin](https://github.com/mzgoddard/hard-source-webpack-plugin)` 来提供一个中间缓存，优化启动速度。当你使用这个插件并运行 webpack 两次时，你会看到效果：第一次构建将花费正常的时间，而第二次构建将会显著加快。
   - 如果你的项目很大，可以考虑使用 `thread-loader` 或其他并行化工具来加速构建。

## 优化打包体积

- 按需加载，将每个路由页面单独打包为一个文件。
- Scope Hoisting 会分析出模块之间的依赖关系，尽可能的把打包出来的模块合并到一个函数中去。
- Tree Shaking 可以实现删除项目中未被引用的代码

## vue.config.js

Vue2 打包体积优化

// TODO 询问 GPT 优化

```js
const path = require("path");
const CompressionPlugin = require("compression-webpack-plugin");
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

/** 快捷修改配置
  1: '开发',
  2: '张森',
  3: '李旭东',
  4: '联通',
 */
let user = 1;
let opsTarget = "";
let mockTarget = "";
let opsPathRewrite = {};
let mockPathRewrite = {};

if (user == 1) {
  opsTarget = "https://cloud.whtyinfo.com/dev-uccdmp/";
  mockTarget = "https://cloud.whtyinfo.com/dev-uccdmp/";
} else if (user == 2) {
  opsTarget = "http://10.8.11.32:8090/";
  mockTarget = "http://10.8.11.32:8099/";
  opsPathRewrite = { "^/services/ops": "" };
  mockPathRewrite = { "^/services/ops/mock": "" };
} else if (user == 3) {
  opsTarget = "http://10.8.11.30:8090/";
  mockTarget = "http://10.8.11.30:8099/";
  opsPathRewrite = { "^/services/ops": "" };
  mockPathRewrite = { "^/services/ops/mock": "" };
} else if (user == 4) {
  opsTarget = "http://218.8.57.183:30080/";
}

console.log(opsTarget, mockTarget);

function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  // 部署生产环境和开发环境下的URL。
  publicPath: process.env.NODE_ENV === "production" ? "./" : "./",
  // 用于放置生成的静态资源 (js、css、img、fonts) 的；（项目打包之后，静态资源会放在这个文件夹下）
  // assetsDir: "static",
  // 如果你不需要生产环境的 source map，可以将其设置为 false 以加速生产环境构建。
  productionSourceMap: false,
  // webpack-dev-server 相关配置
  devServer: {
    proxy: {
      "/deviceMock": {
        target: mockTarget,
        changeOrigin: true,
        ws: true,
        pathRewrite: mockPathRewrite,
        headers: {
          Referer: "https://cloud.whtyinfo.com",
        },
      },
      "/services/ops": {
        target: opsTarget,
        changeOrigin: true,
        ws: true,
        pathRewrite: opsPathRewrite,
        headers: {
          Referer: "https://cloud.whtyinfo.com",
        },
      },
    },
  },
  // 通过chainWebpack来链式调用Webpack的配置
  chainWebpack: config => {
    // 将 babel-polyfill 加入打包的入口文件中。
    // babel-polyfill 是一个 JavaScript 库，用于实现一些浏览器可能缺失的 ES6 + 新特性和 API。
    config.entry("main").add("babel-polyfill");
    // 开启js、css压缩
    if (process.env.NODE_ENV === "production") {
      config.plugin("compressionPlugin").use(
        new CompressionPlugin({
          test: /\.js$|\.html$|.\css/, // 匹配文件名
          threshold: 10240, // 对超过10k的数据压缩
          deleteOriginalAssets: false, // 不删除源文件
        })
      );
    }
  },
  configureWebpack: config => {
    // 在压缩代码时删除console.log语句，以减小打包后的代码体积。
    if (process.env.NODE_ENV === "production") {
      // config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true;
      // 添加分析包大小
      config.plugins.push(new BundleAnalyzerPlugin());
    } else {
      config.devtool = "source-map";
    }
    // 配置别名
    Object.assign(config.resolve, {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    });

    // 将node_modules中每个模块打包成单独的包，且包名为模块名
    // 参考文档：https://juejin.cn/post/6844904103848443912
    config.optimization.splitChunks = {
      // // 对所有的包进行拆分。三个值："initial" 初始化，"all"(默认就是all)，"async"（动态加载）
      chunks: "all",
      // maxIntialRequests 表示 splitChunks 在拆分chunk后，页面中需要请求的并发chunk数量不超过指定的值。
      // 所谓初始chunk，指的是页面渲染时，一开始就需要下载的js，区别于在页面加载完成后，通过异步加载的js。
      // 这里设置为：无限大。默认30
      maxInitialRequests: Infinity,
      // 与 maxInitialRequests 相对，maxAsyncRequests 表示 splitChunks 在拆分chunk后，并行加载的异步 chunk 数不超过指定的值。默认30
      maxAsyncRequests: Infinity,
      // 形成一个新代码块最小的体积,只有 >= minSize 的bundle会被拆分出来。默认值是30kb
      minSize: 0,
      // 表示拆分出的chunk的名称连接符。默认为~。如chunk~vendors.js
      // automaticNameDelimiter: '~',
      cacheGroups: {
        vendor: {
          name(module) {
            // 获取模块名称
            const packageName = module.context.match(
              /[\\/]node_modules[\\/](.*?)([\\/]|$)/
            )[1];
            // 将模块名称中的 '@' 和 '/' 替换为 '-'
            return `npm.${packageName.replace("@", "").replace("/", "-")}`;
          },
          test: /[\\/]node_modules[\\/]/,
          // 使用 enforce 属性可以限制哪些模块必须打包进当前缓存组，从而控制代码分割的过程，提高页面加载速度。它可以取两个值： 'preemptive' 和 'post'。
          // 'preemptive'：表示该缓存组具有预处理特性，即满足条件的模块会被提取到对应的缓存组中，但不会阻止其他缓存组的创建和使用。
          // 'post'：表示该缓存组具有后处理特性，即满足条件的模块会被优先提取到对应的缓存组中，在其他缓存组无法再次匹配这些模块时，才会考虑将剩余的模块提取到该缓存组中。
          // 例如，我们可以将常用工具函数库 lodash 的缓存组定义为 enforce: 'preemptive'，表示这些模块尽可能地提前打包到对应的缓存组中，以实现更快的加载速度。
          // enforce: true,

          // priority 属性是 cacheGroups 配置项中用来指定缓存组优先级的属性。
          // 这个属性的值越大，表示该缓存组的优先级越高，在实际打包过程中，Webpack 会先考虑优先级高的缓存组进行代码分割。
          // 举个例子，假设我们有两个缓存组 A 和 B，并且 A 的 priority 值为 10，B 的 priority 值为 20 。那么在打包过程中，Webpack 会首先考虑 B 缓存组进行代码分割，如果 B 缓存组匹配不到任何模块，则会考虑 A 缓存组进行代码分割。
          priority: 10, // 优先级，用来判断打包到哪个里面去。数字越大表示优先级越高
        },
        // 拆分elementUI
        elementUI: {
          name: "chunk-elementUI", // split elementUI into a single package
          test: /[\\/]node_modules[\\/]_?element-ui(.*)/, // in order to adapt to cnpm
          priority: 20,
        },
        // 拆分公共文件
        commons: {
          name: "chunk-commons",
          test: resolve("src/components"), // can customize your rules
          minChunks: 3, // 模块被引用几次以上的才抽离。 表示在分割前，可被多少个chunk分享的最小值
          reuseExistingChunk: true, // 表示是否使用已有的chunk，true表示不会重新生成新的，即几个chunk复用被拆分出去的一个module
          priority: 30,
        },
      },
    };
  },
  pluginOptions: {
    "style-resources-loader": {
      preProcessor: "less",
      patterns: [
        path.resolve(__dirname, "./src/assets/styles/variable-dark.less"),
      ],
    },
  },
  css: {
    loaderOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
};
```

## 参考

- [ ] [玩转 webpack*webpack*打包-极客时间](https://time.geekbang.org/course/intro/100028901)
- [ ] [掘金小册](https://juejin.cn/book/7034689774719860739/section/7034489795707404329)
