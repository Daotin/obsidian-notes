## 基础知识
> vue-cli5 和 vue-cli4 区别：
>
> - 都是使用的 vue2.6+
> - vue-cli4 使用的是 webpack4，vue-cli5 使用的是 webpack5

### 优化思路

对于优化主要是两个方面：

- **构建速度**
- **打包体积**

所以不管是分析问题还是解决问题有围绕这两个方面进行处理。

**1、首先看优化业务代码体积：**

1. 看看是否使用了大量的图片、字体文件等资源，是否可以进行优化或按需加载。
2. 文件是否按需加载，将每个路由页面单独打包为一个文件。

**2、然后再考虑webpack的优化**，比如：
- 检查 `node_modules` 是否被错误地打包进最终的 bundle 中。
- **Loaders**：确认是否可以使用缓存，如 `babel-loader` 的缓存设置。
- **Externals**：优化 Loader 的文件搜索范围，考虑是否可以将某些库设置为外部引用，以减少打包时间。
- **Code Splitting**：利用 `splitChunks` 进行代码拆分，异步加载不必要的代码。
- **Source Map**：确认是否真的需要生成 source map，或者选择一个构建速度更快的 source map 类型。
- **DllPlugin** 可以将特定的类库提前打包然后引入，只有当类库更新版本才有需要重新打包
- 考虑是否可以使用 [HardSourceWebpackPlugin](https://github.com/mzgoddard/hard-source-webpack-plugin) 来提供一个中间缓存，优化启动速度。当你使用这个插件并运行 webpack 两次时，你会看到效果：第一次构建将花费正常的时间，而第二次构建将会显著加快。
- 如果你的项目很大，可以考虑使用 `thread-loader` 或其他并行化工具来加速构建。


以上仅为思路，具体配置继续往下看。

### configureWebpack和chainWebpack

`configureWebpack` 和 `chainWebpack` 两者的不同之处在于：

- `configureWebpack` 接收一个对象或者一个函数，用于直接修改 Webpack 的配置，其返回值将会被合并到最终的配置中。主要用于简单的配置，例如添加 Loader、Plugin 等。
- `chainWebpack` 提供了一个基于 Webpack 的链式 API，允许你更加灵活地修改 Webpack 配置。可以用于更加复杂的配置，例如修改 Loader 规则、插件中具体的配置等。

下面列举一些常见的使用场景：

- 如果需要添加一些简单的 Loader 或者 Plugin，可以使用 `configureWebpack`。例如，在 Vue CLI 项目中添加一个新的 Loader：

```jsx
module.exports = {
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\\.txt$/,
          use: "raw-loader",
        },
      ],
    },
  },
};
```

如果需要更加细粒度地修改 Webpack 配置，可以使用 `chainWebpack`。例如，在 Vue CLI 项目中修改 babel-loader 的默认选项：

```jsx
module.exports = {
  chainWebpack: (config) => {
    config.module
      .rule("js")
      .use("babel-loader")
      .tap((options) => {
        options.plugins.push("babel-plugin-transform-runtime");
        return options;
      });
  },
};
```

所以，我们下面的优化配置，都会在 `configureWebpack` 和 `chainWebpack` 中进行编写。

## Vue-Cli4/5 默认配置

### 查看 Vue-Cli 默认配置

```
vue inspect --mode production > output-prod.js
vue inspect --mode development > output-dev.js
```

然后通过 chatgpt 还原成 webpack 的配置：

> 问chatgpt：下面是通过 vue-cli 搭建的前端项目，通过 vue inspect 输出的被序列化的格式，请将其还原成原本的 webpack 配置文件，我的目的是了解 vue-cli 默认对 webpack 做了什么配置：

```
{
  mode: 'production',
  context: 'D:\\code\\hello-world-v4',
  devtool: 'source-map',
  node: {
  ...
  }
}
```

### 分析构建时间

通过 `speed-measure-webpack-plugin` 测量网页包构建速度，并会输出各个模块编译的时长，可以帮助我们更好的找到耗时模块。

安装：

```
npm install speed-measure-webpack-plugin -D
```

配置：

```js
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const smp = new SpeedMeasurePlugin();

const webpackConfig = {
  // 你的 Webpack 配置
  // ...
};

module.exports = smp.wrap(webpackConfig);
```

![](images/Pasted%20image%2020250327142300.png)

**如何使用？**

> [!tip] 通过分析，
> 1、如果分析发现构建时间短，则不需要优化。
> 2、如果需要优化，这找到速度瓶颈，比如是某个 loader 或者 plugin，然后就可以通过 chatgpt 或者 google 查找关于这个 loader，plugin 的速度优化建议。


### 查看打包大小

vue-cli 内置工具

```
vue-cli-service build --report
```

成功后就会在项目目录下找到`/dist/report.html`

和之前的 `webpack-bundle-analyzer` 效果一样，就没必要使用了。

**如何使用？**

> [!tip] 通过分析，
> 通过分析，找到速度瓶颈，比如是 ElemetUI 包比较大，然后就可以通过 chatgpt 或者 google 查找关于这个包体积大小优化建议。


## vue-cli4

下面是还原的 production 下的 webpack 配置：[webpack-prod.js](./file/webpack-prod.js)


> vue-cli4默认没有生成vue.config.js，需要自己手动添加：

模板：

```js
const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  // options...
})
````

会报错，因为`defineConfig` is used by Vue CLI 5 not by Vue CLI 4, the right syntax for vue cli 4:

```js
// vue.config.js
module.exports = {
  // options...
};
```

### 构建速度优化

**0、通用速度优化**： 使用高版本的 webpack 和 Node.js ^1cfaa8

新版本的内容都会有比较大的性能提升，对于打包速度提升比较明显，能升级进来升级。

比如从 webpack3 升级到 webpack4，nodejs 从 12 升级到 16.

但是也要注意兼容性问题。

![](images/Pasted%20image%2020250327142643.png)


**1、并行构建**：[默认开启](https://github.com/vuejs/vue-cli/tree/v4.5.19/docs/config#parallel)的。


**2、并行压缩**：默认开启。


**3、开启缓存**： 
> 默认部分开启（Loader 缓存），无需额外配置。它利用 cache-loader 和 babel-loader 等的缓存，但不是 Webpack 5 那种更全面的文件系统缓存。

> 默认启用了以下 Loader 的缓存机制：vue-loader，babel-loader，ts-loader，所有缓存文件默认存储在 `node_modules/.cache`。
>
>其他 Loader：如 css-loader、file-loader 等默认未启用缓存，需通过插件（如 cache-loader 或 hard-source-webpack-plugin）手动扩展。

cache-loader和hard-source-webpack-plugin如何选择？

> 对于cache-loader，是针对单个 Loader 的缓存（如 babel-loader、vue-loader、ts-loader 等），缓存其处理结果。而hard-source-webpack-plugin是全局缓存，缓存整个模块依赖树及中间构建结果。所以，优先使用hard-source-webpack-plugin。

使用 **hard-source-webpack-plugin** 配置持久化缓存功能：

安装：`npm install hard-source-webpack-plugin -D`
配置：

```js
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');

module.exports = {
  configureWebpack: (config) => {
    /**
     * 开启 HardSourceWebpackPlugin 构建缓存
     * HardSourceWebpackPlugin 的缓存机制依赖于文件系统中的缓存数据。
     * 如果在开发环境中生成的缓存数据由于某些原因被损坏或者不完整，可能会导致生产环境中的构建出现问题。所以在生产环境中不建议使用 HardSourceWebpackPlugin。
     *
     */
    if (process.env.NODE_ENV !== 'production') {
      config.plugins.push(
	      new HardSourceWebpackPlugin({
		      // 可选配置项
	        cacheDirectory: 'node_modules/.cache/hard-source/[confighash]',
	        configHash: function(webpackConfig) {
	          // 根据 webpack 配置生成哈希，确保配置变更时缓存失效
	          return require('node-object-hash')({ sort: false }).hash(webpackConfig);
	        },
	      })
      );
    }
  },
};
```

缓存的默认路径为：`node_modules/.cache/hard-source`

开启前后使用npm run dev对比，速度明显减小（工程为vue-cli4默认构建的hello-word项目）

| 项目/次数                     | 1     | 2     | 3     | 4     |
| ------------------------- | ----- | ----- | ----- | ----- |
| 不加HardSourceWebpackPlugin | 3.49s | 1.12s | 1.08s | 1.13s |
| 加HardSourceWebpackPlugin  | 2.46s | 0.27s | 0.29s | 0.77s |


> [!warning] 关于`DllPlugin`，DllPlugin 是通过预编译特定的模块（通常是第三方库），将这些模块打包成独立的动态链接库 (DLL)，在主构建中只需要引用这些预编译的模块，从而大幅减少构建时间。
>
> 但是，如果已经使用 HardSourceWebpackPlugin 并且不考虑缓存失效的情况下，会将第三方依赖（如 React、Lodash 等）缓存到文件系统中。这样在后续的构建中，这些依赖的编译结果会直接从缓存中读取，因此无需重新编译这些依赖。在这种情况下，`DllPlugin` 的作用会有所减弱，因为 `HardSourceWebpackPlugin` 已经提供了类似的缓存功能。确实不再需要 DllPlugin。
>
> 而且，vue-cli 引入 webpack4 之后，移除了该包，"因为 Webpack 4 的打包性能足够好的，dll 没有在 Vue ClI 里继续维护的必要了。"
>
> [dll option will be removed. Webpack 4 should provide good enough perf and the cost of maintaining DLL mode inside Vue CLI is no longer justified.](https://github.com/vuejs/vue-cli/issues/1205)


### 减小打包体积

**1、css tree shaking**

可以使用 purgecss 插件，但区别于 webpack 的配置，可以使用[vue add 的方式](https://purgecss.com/guides/vue.html)进行添加：

安装：

```js
vue add @fullhuman/purgecss@^3
```

> [!warning] 注意
> 这里要添加版本 3，否则会报错：`Error: PostCSS plugin postcss-purgecss requires PostCSS 8.`

然后会自动生成并配置好 postcss.config.js，无需其他额外配置。

**2、gzip/br 压缩**

使用 compression-webpack-plugin 启用 Gzip 压缩

安装：

```
npm install compression-webpack-plugin@^6 --save-dev
```

配置：
我 bulid 的时候报了`Cannot read property 'tapPromise' of undefined`的错，其实就是版本和 vue-cli 的某些包不兼容，把 compression-webpack-plugin 的版本降低到`6`就可以了。

```js
const CompressionWebpackPlugin = require('compression-webpack-plugin');

module.exports = {
  configureWebpack: (config) => {
    if (process.env.NODE_ENV === 'production') {
      // 在生产环境中使用 gzip 压缩
      config.plugins.push(
        new CompressionWebpackPlugin({
          filename: '[path][base].gz', // 压缩后的文件名，默认值是 [path][base].gz
          algorithm: 'gzip',
          test: /\.(js|json|css|html|svg)$/,
          threshold: 10240, // 对超过10k的数据压缩
          minRatio: 0.8, // 压缩比
          deleteOriginalAssets: false, // 是否删除原始文件
        })
      );
    }
  },
};
```

nginx 中配置：

```nginx
server {
    location ~ .*\.(js|json|css)$ {
        gzip on;
        gzip_static on; # 启用 gzip_static 选项

        gzip_min_length 1k;
        gzip_http_version 1.1;
        gzip_comp_level 9;
        gzip_types  text/css application/javascript application/json;
        root /home/tsgz/dist_hlj/; # 修改为项目前端目录
    }
}
```

查看效果：
![](images/img-20240529190535.png)

**3、图片压缩**

使用 `image-webpack-loader` 对图片进行优化，减少图片文件的大小。

安装：

```
cnpm install image-webpack-loader -D
```

> `image-webpack-loader`  是需要配合  `file-loader`  来使用的。不过，Vue Cli 搭建的项目中已经内置了  `file-loader`  就不需要我们进行额外安装配置了！

配置：

```js
chainWebpack: (config) => {
    // 找到图片加载器并对其进行配置
    config.module
      .rule('images')
      .use('image-webpack-loader')
      .loader('image-webpack-loader')
      .options({
        mozjpeg: { progressive: true, quality: 65 },
        optipng: { enabled: true },
        pngquant: { quality: [0.65, 0.9], speed: 4 },
        gifsicle: { interlaced: false },
        webp: { quality: 75 },
      });
  },
```

> 如果打包报错：Syntax Error: Error: Cannot find module 'imagemin-gifsicle'
> 则使用 cnpm 安装。

> [!danger] 目前只能压缩 jpg，如果引入了 png 则打包出错，原因未知。。。

**4、动态 polyfill**

vue-cli 已经基于你的浏览器目标自动决定要运用的语法转换和 polyfill，[无需我们配置](https://github.com/vuejs/vue-docs-zh-cn/blob/master/vue-babel-preset-app/README.md)。

或者，我们通过在 package.json 中的 `browserslist` 限制目标浏览器（影响Babel和Autoprefixer的工作）。


**5、production 环境不生成 SourceMap**

```js
module.exports = {
  productionSourceMap: false,
};
```

**6、分离基础库使用 cdn**

> 慎用，除非公司有稳定的 cdn 服务。

不需要安装 `html-webpack-externals-plugin`，Vue CLI 自带的 `html-webpack-plugin` 已经足够用于我们的需求。

配置：

```js
const IS_PROD = process.env.NODE_ENV === 'production';
module.exports = {
  configureWebpack: (config) => {
    config.externals = IS_PROD ? {
      'vue': 'Vue',
      'vue-router': 'VueRouter',
      'vuex': 'Vuex',
      'axios': 'axios',
      'element-ui': 'ELEMENT' // 注意 Element UI 通常暴露为 ELEMENT
    } : {} // 开发环境不使用 externals，方便调试
  },
  chainWebpack: (config) => {
    config.plugin('html').tap((args) => {
      args[0].cdn = {
        js: [
          'https://cdn.jsdelivr.net/npm/vue@2.6.12/dist/vue.min.js',
          'https://cdn.jsdelivr.net/npm/vue-router@3.5.1/dist/vue-router.min.js',
          'https://cdn.jsdelivr.net/npm/axios@0.21.1/dist/axios.min.js',
        ],
        css: [],
      };
      return args;
    });
  },
};
```

修改 public/index.html,以便在生成的 HTML 文件中自动插入 CDN 链接：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1.0" />
    <title><%= htmlWebpackPlugin.options.title %></title>
    <% if (htmlWebpackPlugin.options.cdn && htmlWebpackPlugin.options.cdn.css) { %> <% for (var css of htmlWebpackPlugin.options.cdn.css) {
    %>
    <link rel="stylesheet" href="<%= css %>" />
    <% } %> <% } %>
  </head>
  <body>
    <noscript>
      <strong
        >We're sorry but <%= htmlWebpackPlugin.options.title %> doesn't work properly without JavaScript enabled. Please enable it to
        continue.</strong
      >
    </noscript>
    <div id="app"></div>
    <% if (htmlWebpackPlugin.options.cdn && htmlWebpackPlugin.options.cdn.js) { %> <% for (var js of htmlWebpackPlugin.options.cdn.js) { %>
    <script src="<%= js %>"></script>
    <% } %> <% } %>
  </body>
</html>
```

**7、删除 console.log**

>  Vue CLI 虽然内置了 TerserPlugin，但它的路径可能不会直接暴露在 configureWebpack 的作用域中，所以不能使用下面的方式，除非再次手动安装terser-webpack-plugin

> 注意：是vue-cli内置了TerserPlugin，但是webpack4没有内置！但webpack5内置了！

下面是**不建议**的方式：

```
// 1、安装：npm install terser-webpack-plugin@^4 --save-dev

// 2、配置
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  configureWebpack: (config) => {
    if (process.env.NODE_ENV === 'production') {
      config.optimization.minimizer = config.optimization.minimizer || [];
      config.optimization.minimizer.push(
        new TerserPlugin({
          terserOptions: {
            compress: {
              drop_console: true, // 移除生产环境的 console.log
              drop_debugger: true, // 移除生产环境的 debugger
            },
            output: {
              comments: false, // 删除所有注释
            },
          },
        })
      );
    }
  },
};
```

推荐的方式是 使用 **`chainWebpack`（推荐）**

Vue CLI 提供了 `chainWebpack` 方法，可以安全地修改 Terser 配置，无需手动引入 `terser-webpack-plugin`，而且不会覆盖 Vue CLI 默认的优化配置。

```js
module.exports = {
  chainWebpack: (config) => {
    if (process.env.NODE_ENV === 'production') {
      config.optimization.minimizer('terser').tap((args) => {
        args[0].terserOptions = {
          ...args[0].terserOptions,
          compress: {
            ...args[0].terserOptions?.compress,
            drop_console: true, // 生产环境移除 console
            drop_debugger: true, // 生产环境移除 debugger
          },
        };
        return args;
      });
    }
  },
};
```

### 其他友好配置

**1、chunk-vendors 分包**

配置：

```js
chainWebpack: config => {
  if (process.env.NODE_ENV === 'production') {
    config.optimization.splitChunks({
      // 对所有的包进行拆分。三个值："initial" 初始化，"all"(默认就是all)，"async"（动态加载）
      // initial: **只拆分初始加载的同步 chunk**（如 `import xxx` 直接引入的模块）
      // async: **只拆分动态导入的异步 chunk**（如 `import('xxx')` 或 `() => import('xxx')`）
      // all: **不分同步/异步，全部 chunk 参与拆分**
      chunks: 'all', 
	
	  // 形成一个新代码块最小的体积,只有 >= minSize 的bundle会被拆分出来。默认值是30kb
      minSize: 20000,
      
      /**
      // 控制**页面刚打开**时，一次性加载的 JS 文件最多可以有多少个。
		假设你的网站有 10 个 JavaScript 代码块（chunk），Webpack 默认会尝试把它们拆开，以便浏览器按需加载。但如果拆得太碎，浏览器一次要发太多请求，反而影响性能。所以 **`maxInitialRequests` 设定了一个上限**，让 Webpack 在拆包时遵循这些规则。
		*/
      maxInitialRequests: 10,
      
      // 与 maxInitialRequests 相同，控制**懒加载（异步加载）**时，同时加载的 JS 文件最多可以有多少个。
      maxAsyncRequests: 10, 
      
      enforceSizeThreshold: 50000, // 强制执行拆分的体积阈值并忽略其他限制
      cacheGroups: {
        libs: { // 第三方库
          name(module) {
            // 获取模块名称
            const packageName = module.context.match(
              /[\\/]node_modules[\\/](.*?)([\\/]|$)/
            )[1];
            // 将模块名称中的 '@' 和 '/' 替换为 '-'
            return `npm.${packageName.replace("@", "").replace("/", "-")}`;
          },
          test: /[\\/]node_modules[\\/]/, // 请注意'[\\/]'的用法，是具有跨平台兼容性的路径分隔符
          // 使用 enforce 属性可以限制哪些模块必须打包进当前缓存组，从而控制代码分割的过程，提高页面加载速度。它可以取两个值： 'preemptive' 和 'post'。
	          // 'preemptive'：表示该缓存组具有预处理特性，即满足条件的模块会被提取到对应的缓存组中，但不会阻止其他缓存组的创建和使用。
	          // 'post'：表示该缓存组具有后处理特性，即满足条件的模块会被优先提取到对应的缓存组中，在其他缓存组无法再次匹配这些模块时，才会考虑将剩余的模块提取到该缓存组中。
	          // 例如，我们可以将常用工具函数库 lodash 的缓存组定义为 enforce: 'preemptive'，表示这些模块尽可能地提前打包到对应的缓存组中，以实现更快的加载速度。
	          // enforce: true,

          // priority 属性是 cacheGroups 配置项中用来指定缓存组优先级的属性。
	          // 这个属性的值越大，表示该缓存组的优先级越高，在实际打包过程中，Webpack 会先考虑优先级高的缓存组进行代码分割。
	          // 举个例子，假设我们有两个缓存组 A 和 B，并且 A 的 priority 值为 10，B 的 priority 值为 20 。那么在打包过程中，Webpack 会首先考虑 B 缓存组进行代码分割，如果 B 缓存组匹配不到任何模块，则会考虑 A 缓存组进行代码分割。
          priority: 10 // 优先级，执行顺序就是权重从高到低
          chunks: 'initial' //  **只拆分初始加载的同步 chunk**（如 `import xxx` 直接引入的模块）
        },
        elementUI: { // 把 elementUI 单独分包
          name: 'chunk-elementUI',
          test: /[\\/]node_modules[\\/]element-ui[\\/]/,
          priority: 20 // 权重必须比 libs 大，不然会被打包进 libs 里
        },
        // 拆分公共文件
        commons: {
          name: "chunk-commons",
          test: resolve("src/components"), // can customize your rules
          minChunks: 3, // 模块被引用几次以上的才抽离。 表示在分割前，可被多少个chunk分享的最小值
          reuseExistingChunk: true, // 表示是否使用已有的chunk，true表示不会重新生成新的，即几个chunk复用被拆分出去的一个module
          priority: 30,
        },
        svgIcon: {
          name: 'chunk-svgIcon',
          // 函数匹配示例，把 svg 单独拆出来
          test(module) {
            // `module.resource` 是文件的绝对路径
            // 用`path.sep` 代替 / or \，以便跨平台兼容
            // const path = require('path') // path 一般会在配置文件引入，此处只是说明 path 的来源，实际并不用加上
            return (
              module.resource &&
              module.resource.endsWith('.svg') &&
              module.resource.includes(`${path.sep}icons${path.sep}`)
            )
          },
          priority: 30
        }
      }
    })
  }
}
```

**2、IgnorePlugin**：忽略指定的模块或文件，通常用于如果引入了 `moment.js`，则忽略其他的语言包，另外我通常会在项目中新建 demo 模板，也可以使用`IgnorePlugin`忽略测试文件。

```js
const webpack = require('webpack');
const path = require('path');

module.exports = {
  configureWebpack: (config) => {
    config.plugins.push(
      new webpack.IgnorePlugin({
        resourceRegExp: /src\/views\/demo/, // 匹配要忽略的资源路径
      })
    );
  },
};
```

**3、resolve.alias**
resolve.alias 是用于创建 import 或 require 的别名，来确保模块引入变得更简单：

```js
chainWebpack: (config) => {
  // 配置别名
  config.resolve.alias
    .set('@build', pathResolve('../build')) // 构建目录
    .set('@', pathResolve('../src'))
    .set('@api', pathResolve('../src/api'))
    .set('@utils', pathResolve('../src/utils'))
    .set('@views', pathResolve('../src/views'));
};
```

**4、去掉 preload 和 prefetch**

preload：在页面加载时立即下载，优先级高。
prefetch：在浏览器空闲时下载，优先级低。

但是如果引入的资源过多，会占用大量带宽，导致其他关键资源（如 CSS 和主 JavaScript 文件）的下载速度变慢，prefetch 虽然在空闲时间下载，但是依然会有影响。

所以，尽管 `preload` 在某些情况下可以显著提升页面性能，但如果没有精细管理和选择性使用，全部加入 `preload` 可能会适得其反。因此，综合考虑性能和简化配置，全部去掉 `preload` 会是更安全和更通用的选择。

```js
module.exports = {
  chainWebpack: (config) => {
    config.plugins.delete('prefetch');
    config.plugins.delete('preload');
  },
};
```

#### 全量配置

参考：https://github.com/staven630/vue-cli4-config

## vue-cli5

在处理之前，先比较下，vue-cli4 生成的 webpack 配置和 vue-cli5 生成的 webpack 配置的区别：

在提升打包速度和减小打包体积上，Vue CLI 4 和 Vue CLI 5 的配置文件有一些明显的区别。以下是详细的列举：

一、构建速度方面

1. **TerserPlugin 的配置差异**:
   - **Vue CLI 4**:
     ```javascript
     new TerserPlugin({
       terserOptions: {
         compress: {
           /* many options */
         },
         mangle: {
           safari10: true,
         },
       },
       sourceMap: true,
       cache: true,
       parallel: true,
       extractComments: false,
     });
     ```
   - **Vue CLI 5**:
     ```javascript
     new TerserPlugin({
       terserOptions: {
         compress: {
           /* many options */
         },
         mangle: {
           safari10: true,
         },
       },
       parallel: true,
       extractComments: false,
     });
     ```
     Vue CLI 5 移除了 `sourceMap` 和 `cache` 配置，这可以在某些情况下提升打包速度，因为生成 source map 和缓存处理可能会增加额外的时间。

在 Webpack 4 中，由于没有内置的高级缓存机制，使用 TerserPlugin 的 `cache` 选项可以显著提升压缩过程中的性能。而在 Webpack 5 中，由于有了内置的持久化缓存机制，就不再需要单独在 TerserPlugin 中配置 `cache` 选项。

在 vue-cli 5 中，`cache`  会在[`开发`  模式](https://webpack.docschina.org/configuration/mode/#mode-development)被设置成  `type: 'memory'`  而且在  [`生产`  模式](https://webpack.docschina.org/configuration/mode/#mode-production)  中被禁用。

memory 意味着缓存数据会存储在内存中，重启构建工具后缓存会丢失。

2. **插件变化**:
   - **Vue CLI 4** 使用了 `OptimizeCssnanoPlugin` 来压缩 CSS，且未提及并行处理。
   - **Vue CLI 5** 使用了 `CssMinimizerPlugin`，并启用了并行处理：
     ```javascript
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
     });
     ```
     启用并行处理可以显著提升 CSS 压缩的速度。

主要区别：

- **并行处理**: `CssMinimizerPlugin` 支持并行处理，而 `OptimizeCssnanoPlugin` 不支持。这使得 `CssMinimizerPlugin` 在处理大规模 CSS 文件时具有更好的性能。
- **集成度**: `CssMinimizerPlugin` 专为 Webpack 5 设计，能更好地利用 Webpack 5 的新特性和优化机制。而 `OptimizeCssnanoPlugin` 更适合于 Webpack 4 及之前的版本。
- **配置简洁性**: `CssMinimizerPlugin` 的配置更简洁，并且内置了许多优化，减少了手动配置的复杂度。
- **维护与更新**: `CssMinimizerPlugin` 是 Webpack 官方推荐的插件，更新和维护更加及时，适配新版本的 Webpack 更加迅速。

3. **hashFunction 的使用**:
   - **Vue CLI 5** 在 `output` 中使用了更高效的哈希函数 `xxhash64`，这有助于提升生成哈希值的速度。
     ```javascript
     output: {
       hashFunction: 'xxhash64',
       // other options
     }
     ```

二、打包体积方面

1. **CSS 压缩插件的差异**:

   - **Vue CLI 4** 使用 `OptimizeCssnanoPlugin` 来压缩 CSS。
   - **Vue CLI 5** 使用 `CssMinimizerPlugin`，默认的配置同样通过 `cssnano` 进行压缩，但配置了 `mergeLonghand: false` 和 `cssDeclarationSorter: false` 来避免某些长声明合并和 CSS 声明排序的问题，这些设置可以确保在最小化体积的同时，不影响 CSS 的兼容性和性能。

2. **splitChunks 配置的改进**:

   - 两者在 `splitChunks` 配置上大致相似，但 Vue CLI 5 默认禁用了 `realContentHash`：
     ```javascript
     optimization: {
       realContentHash: false,
       splitChunks: {
         cacheGroups: {
           // configurations
         }
       },
       // other options
     }
     ```
     这可以减少生成文件的体积，因为 `realContentHash` 的启用会增加额外的哈希计算，从而增大文件体积。

3. **移除了未使用的插件**:
   - Vue CLI 5 移除了 `HashedModuleIdsPlugin`，这一插件用于生成稳定的模块 ID，但也会增加额外的哈希计算和模块大小。

### 构建速度优化

> 关于缓存：terser-webpack-plugin 在 v5 弃用了 cache 选项。而且在 Webpack 5 中，一般不再需要使用 `hard-source-webpack-plugin`，因为 Webpack 5 本身已经内置了强大的`cache`缓存功能，能够提供与 `hard-source-webpack-plugin` 类似的缓存效果。

> 关于并行：会自动为多核CPU使用thread-loader开启[并行构建](https://github.com/vuejs/vue-cli/blob/v5.0.8/docs/config/index.md#parallel)。

**0、通用速度优化**：参考：[0、通用速度优化](vue-cli4和5构建打包优化.md#^1cfaa8)

**1、并行构建**：已默认开启

**2、并行压缩**：已默认开启

**3、开启缓存**：已默认开启

> 在 Vue CLI 5 中，**构建缓存（持久化文件系统缓存）是默认开启的**，适用于 serve 和 build 命令。这是 Webpack 5 的一个核心特性，旨在大幅提升后续构建的速度。
> 
> 当运行 npm run serve 或 npm run build 时，Webpack 5 会自动将模块和 chunk 的构建结果缓存到文件系统中（默认位置：node_modules/.cache/webpack）。

**自定义缓存**: 你可以对缓存进行更细粒度的配置，例如更改缓存目录或配置缓存失效的依赖项：

```js
// vue.config.js
const path = require('path');

module.exports = {
  configureWebpack: {
    cache: {
      type: 'filesystem', // 显式指定类型（默认就是 filesystem）
      cacheDirectory: path.resolve(__dirname, '.temp_cache'), // 更改缓存目录
      buildDependencies: {
        // 添加额外的文件或配置作为缓存失效的依赖项
        config: [__filename] // 当 vue.config.js 本身改变时，缓存失效
      }
    }
  }
};
```

### 减小打包体积

**1、css tree shaking**：依然需要

**2、gzip 压缩**：依然需要

**3、图片压缩**：依然需要（在 webpack4 中使用的是`image-webpack-loader`，但是一直报错，也没有其他的选择，但是 webpack5 中可以使用官方的[`ImageMinimizerWebpackPlugin`](https://webpack.js.org/plugins/image-minimizer-webpack-plugin/)）

安装：

```
`npm install image-minimizer-webpack-plugin imagemin imagemin-mozjpeg imagemin-pngquant imagemin-svgo --save-dev`
```

> imagemin-mozjpeg 安装失败，可以使用 cnpm 安装。

> [!bug] 自己尝试后，依然无法安装。。。

算了，不如找个在线压缩网站，每过一段时间进行压缩处理：https://imagecompressor.com/zh/

## 总结

如果是 vue-cli4/5 搭建的项目，需要配置：

- 构建缓存（**只有 4 需要，且热更新耗时才需要**）：hard-source-webpack-plugin
- css tree shaking：`@fullhuman/purgecss@^3`
- 打包压缩：`compression-webpack-plugin@^6`
- 图片压缩
- 生产环境关闭 sourcemap
- 删除 console.log
- 去掉 preload 和 prefetch

更多优化，参考：
- [webpack打包速度和体积优化](../../../技术文章/webpack通关秘籍/webpack打包速度和体积优化.md)
- [ ] [玩转 webpack*webpack*打包-极客时间](https://time.geekbang.org/course/intro/100028901)
- [ ] [掘金小册](https://juejin.cn/book/7034689774719860739/section/7034489795707404329)