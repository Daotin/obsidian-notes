# webpack4优化

[https://daotin.github.io/fe-series-notes/性能优化/vue2-webpack性能优化.html](https://daotin.github.io/fe-series-notes/%E6%80%A7%E8%83%BD%E4%BC%98%E5%8C%96/vue2-webpack%E6%80%A7%E8%83%BD%E4%BC%98%E5%8C%96.html)

[https://daotin.github.io/fe-series-notes/engineer/performance/first-screen.html](https://daotin.github.io/fe-series-notes/engineer/performance/first-screen.html)

## 背景

优化前的登陆界面：

![](images/Pasted%20image%2020250121152323.png)

弱网下（3G 高速）的情况很差：花了 2 分钟，其中主要是下面几个大文件。

![](images/Pasted%20image%2020250121152206.png)

## 前置条件

由于我们使用的是 `@vue/cli` 工具，所以我们对 `vue.config.js`  进行修改，而不是纯粹的 webpack 配置文件。

`vue.config.js`  是一个可选的配置文件，如果项目的 (和  `package.json`  同级的) 根目录中存在这个文件，那么它会被  `@vue/cli-service`  自动加载。

vue.config.js 中的一些配置说明：

- `publicPath`：部署应用包时的基本 URL
默认情况下，Vue CLI 会假设你的应用是被部署在一个域名的根路径上，例如 `https://www.my-app.com/`。如果应用被部署在一个子路径上，你就需要用这个选项指定这个子路径。例如，如果你的应用被部署在 `https://www.my-app.com/my-app/`，则设置 `publicPath` 为 `/my-app/`。
这个值也可以被设置为空字符串 (`''`) 或是相对路径 (`'./'`)，这样所有的资源都会被链接为相对路径，这样打出来的包可以被部署在任意路径，也可以用在类似 Cordova hybrid 应用的文件系统中。
注意：相对路径的 `publicPath` 有一些使用上的限制。在以下情况下，应当避免使用相对 `publicPath`:
    - 当使用基于 HTML5 `history.pushState` 的路由时；
    - 当使用 `pages` 选项构建多页面应用时。
- `outputDir`：当运行 `vue-cli-service build` 时生成的生产环境构建文件的目录。
- `assetsDir`：放置生成的静态资源 (js、css、img、fonts) 的 (相对于 `outputDir` 的) 目录。
- `configureWebpack`: 如果这个值是一个对象，则会通过 [webpack-merge](https://github.com/survivejs/webpack-merge) 合并到最终的配置中。如果这个值是一个函数，则会接收被解析的配置作为参数。该函数既可以修改配置并不返回任何东西，也可以返回一个被克隆或合并过的配置版本。
参考配置文档：[简单的配置方式](https://cli.vuejs.org/zh/guide/webpack.html#%E7%AE%80%E5%8D%95%E7%9A%84%E9%85%8D%E7%BD%AE%E6%96%B9%E5%BC%8F)
- `chainWebpack`: 是一个函数，会接收一个基于 [webpack-chain](https://github.com/mozilla-neutrino/webpack-chain) 的 `ChainableConfig` 实例。允许对内部的 webpack 配置进行更细粒度的修改。
参考配置文档：[链式操作 (高级)](https://cli.vuejs.org/zh/guide/webpack.html#%E9%93%BE%E5%BC%8F%E6%93%8D%E4%BD%9C-%E9%AB%98%E7%BA%A7)

> configureWebpack 和 chainWebpack 的区别是什么？
> 

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

## 构建策略

> 参考文档：https://juejin.cn/book/7034689774719860739/section/7034489795707404329
> 

**基于构建策略来优化应用打包**，从两大层面着手，一步一步完善 `webpack`的构建策略。

- **减少打包时间**：`缩减范围`、`缓存副本`、`定向搜索`、`提前构建`、`并行构建`、`可视结构`
- **减少打包体积**：`分割代码`、`摇树优化`、`动态垫片`、`按需加载`、`作用提升`、`压缩资源`

### 减少打包时间

### 缩减范围

## 分析工具

要得到耗时的模块，那就需要用到一些分析工具了，例如：

- [speed-measure-webpack-plugin](https://link.juejin.cn/?target=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Fspeed-measure-webpack-plugin)：测量网页包构建速度，并会输出各个模块编译的时长，可以帮助我们更好的找到耗时模块。
- [webpack-bundle-analyzer](https://link.juejin.cn/?target=https%3A%2F%2Fwww.npmjs.com%2Fpackage%2Fwebpack-bundle-analyzer)：以可视化网页包输出文件的大小，并且提供了交互式可缩放的树形图。

下面是包大小的分析图：

![](images/Pasted%20image%2020250121152242.png)


- [https://www.zadmei.com/vxmyhsjw.html](https://www.zadmei.com/vxmyhsjw.html)
- [https://heapdump.cn/article/3611066](https://heapdump.cn/article/3611066)
- [https://juejin.cn/post/7078491632605069348](https://juejin.cn/post/7078491632605069348)
- [https://blog.csdn.net/weixin_44021417/article/details/106668042](https://blog.csdn.net/weixin_44021417/article/details/106668042)

衍生学习：

webpack5：[https://juejin.cn/book/7115598540721618944?scrollMenuIndex=1](https://juejin.cn/book/7115598540721618944?scrollMenuIndex=1)

**前端工程体验优化实战:**[https://juejin.cn/book/7306163555449962533?scrollMenuIndex=0](https://juejin.cn/book/7306163555449962533?scrollMenuIndex=0)