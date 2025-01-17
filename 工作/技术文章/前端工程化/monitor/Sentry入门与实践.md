# Sentry 入门与实践

## 前端监控概述

### 什么是前端监控？

前端监控是指通过监测网站或应用程序的前端性能数据，来了解用户在其使用过程中所遇到的问题和瓶颈，并及时发现和解决这些问题。

前端监控通常包括：

- 错误监控：JavaScript 错误以及网络请求错误等
- 性能监控：监控页面加载时间、页面渲染时间、用户交互时间、浏览器卡顿情况等

### 前端监控的作用

1.  更快的发现发现异常、定位异常、解决异常
2.  解决性能问题，提升用户体验
3.  了解业务数据，指导产品升级——数据驱动的思想

### 前端监控的发展历程

前端监控的发展历程可以分为以下几个阶段：

- 初级阶段

在早期的 Web 开发中，前端监控主要依赖于开发者手动进行错误检查和调试。这个阶段的主要特点是监控手段有限，错误排查效率较低。开发者通常通过浏览器的控制台输出错误信息。这种方式的局限性很大，很难对错误进行实时监控和定位。

- 统计和分析阶段

随着互联网的发展，Web 应用程序变得越来越复杂，前端监控的需求也越来越迫切。这个阶段出现了一些简单的前端监控工具，如 Google Analytics。这些工具可以帮助开发者收集用户行为数据，分析页面性能和访问情况。然而，这些工具的功能相对有限，主要关注用户行为和访问统计，而不是错误监控和排查。

- 错误监控和追踪阶段

在这个阶段，出现了一些专门用于前端错误监控和追踪的工具，如 Sentry、Bugsnag 和 TrackJS 等。这些工具可以实时捕获前端错误，帮助开发者快速定位和解决问题。这个阶段的前端监控开始关注错误的详细信息，如错误类型、发生时间、用户设备信息等，为开发者提供了更多的错误排查信息。

- 用户体验和性能优化阶段

随着 Web 应用程序的用户体验和性能要求越来越高，前端监控开始关注用户体验和性能优化。这个阶段的前端监控工具不仅可以捕获错误信息，还可以监控页面加载速度、用户交互情况等性能指标。例如，LogRocket 可以提供用户会话重放功能，帮助开发者了解用户在使用过程中遇到的问题，从而优化用户体验。

- 端到端监控和全链路追踪阶段

在这个阶段，前端监控开始与后端监控、网络监控等其他监控手段相结合，实现端到端的全链路追踪。这可以帮助开发者更全面地了解应用程序的运行情况，找到性能瓶颈和潜在问题。例如，Elasticsearch、Logstash 和 Kibana（ELK Stack）可以实现前后端日志的统一收集、搜索和可视化，方便开发者进行全链路分析。

## 前端监控的核心功能和关键指标

前端监控的核心功能主要包括`错误监控`、`性能监控`和`用户行为监控`。以下是这些核心功能的关键指标：

**错误监控**：主要报包括错误类型，错误信息，错误发生时间，用户设备信息，错误发生频率等。

**性能监控**：主要包括页面加载时间，首屏时间，白屏时间，请求响应时间，DOM 解析时间，资源加载时间等。

**用户行为监控**：主要包括用户访问量，用户停留时间，用户点击行为，页面跳转情况，用户设备信息等。

这些关键指标可以帮助开发者了解前端应用程序的运行情况，找到性能瓶颈和潜在问题，从而提高应用程序的性能和用户体验。

## 主流的前端监控系统

目前有两种前端监控系统的方案，一种是接入现成的监控系统，另一种是自己搭建监控系统。

**1、接入现成的监控系统：**

有很多流行的前端错误监控工具，这里列举几个常用的：

- Sentry（[https://sentry.io/）](https://sentry.io/） "https://sentry.io/）")
- LogRocket（[https://logrocket.com/）](https://logrocket.com/） "https://logrocket.com/）")
- Bugsnag（[https://www.bugsnag.com/）](https://www.bugsnag.com/） "https://www.bugsnag.com/）")
- frontjs（[https://frontjs.pgyer.com](https://frontjs.pgyer.com "https://frontjs.pgyer.com")）
- fundebug（[https://www.fundebug.com](https://www.fundebug.com "https://www.fundebug.com")）
- webfunny（[https://www.webfunny.cn](https://www.webfunny.cn "https://www.webfunny.cn")）

2、另一种是**使用开源工具，自己搭建监控平台**。主要流程是前端使用开源工具（例如：[log.js](https://gitee.com/clark-fl/log.js "log.js")）。

但是自己搭建的原理是前端记录错误，然后发送到后端记录。前端还需要新增一个界面对日志进行解析进行展示。

优点：可以个性化监控内容以及展示样式。

缺点：麻烦，需要花费很多人力物力。

**Sentry 的优势**

- 开源，有免费版
- 可以部署自己的服务器，安全
- 错误信息及告警机制完善
- 简单易上手，开发成本低
- 错误追踪及状态流转及时，方便
- 丰富的 SDK
- 社区活跃

Sentry 的这些优势既能及时抓取生产环境的前端报错发出通知，又能够提供丰富的错误信息及路径方便开发人员定位解决，满足了前端项目错误监控的基本需求；又是开源免费的，可以搭建自己的服务器，不用担心数据及敏感信息泄露等风险，同时支持各种开发语言及框架。

所以，最终选择了 Sentry 做为前端平台的错误监控方案。

## Sentry 入门与实践

### Sentry 版本区别

Sentry 分为`SaaS版本`和`私有化部署`版本。

其中 SaaS 版本提供了免费版和商业付费版，二者在功能丰富度上有一些区别。具体可以参考：[https://sentry.io/pricing/](https://sentry.io/pricing/ "https://sentry.io/pricing/")

::: info **免费版和付费版的主要区别如下：**

1.  功能：Sentry 免费版与付费版的最大区别在于功能。免费版可以允许您收集错误报告、设置警报、协作团队以及一些基本分析工具。但是，付费版还提供了更多的高级功能，例如事件分组、自定义事件数据、关联数据源等。
2.  容量：免费版的容量限制为 5,000 个事件/月。而每个付费计划都有不同的容量限制。
3.  数据保存时间：免费版只保存 30 天的事件数据，而付费版则提供了更长的数据保存时间。
4.  支持：付费版享有更高级的支持，包括 24 小时电话支持、高级 SLA 保证等。
5.  安全性：付费版提供了更高级的安全控制和数据隔离功能。

:::

::: info **SaaS 版本和私有化部署版本的区别：**

Sentry 的 SaaS 版本和私有化版本在功能上没有本质区别，但是私有化版本可以更加灵活地定制和扩展功能，满足用户的特定需求。

Sentry 的私有化版本可以更加灵活地定制和扩展功能，例如添加新的数据源、自定义报告、集成第三方工具等，满足用户的特定需求。此外，私有化版本还可以更好地控制数据的安全性，因为所有数据都存储在用户自己的服务器上。
总之，Sentry 的 SaaS 版本和私有化版本在功能上基本相同，但私有化版本更加灵活和定制化，可以满足用户的特定需求。

:::

### Sentry 私有化部署

Sentry 的管理后台是基于 Python Django 开发的。同时，这个管理后台需要用到 Postgres 数据库（管理后台默认的数据库）、ClickHouse（存数据特征的数据库）、relay、kafka、redis 等一些基础服务或由 Sentry 官方维护的总共 23 个服务支撑运行。

如果独立的部署和维护这 23 个服务将是异常复杂和困难的，幸运的是，官方提供了基于 docker 镜像的一键部署的仓库： [self-hosted](https://github.com/getsentry/self-hosted "self-hosted")。

所以，在私有化部署之前，我们需要在安装好`Docker`和`Docker-compose`。下面是它的软硬件配置要求：

- Docker 19.03.6+
- Compose 1.28.0+
- 4 CPU Cores
- 8 GB RAM
- 20 GB Free Disk Space

::: warning
由于我在使用官方[self-hosted](https://github.com/getsentry/self-hosted "self-hosted")部署的时候，遇到了很多问题，换了很多 docker,docker-compose 以及 self-hosted 的版本均出现不同的问题，基本上都会出现下面的问题：

```
#6 Err:5 http://deb.debian.org/debian bullseye/main amd64 Packages Connection timed out [IP: 146.75.114.132 80]
...
#6 314.4 E: Failed to fetch http://deb.debian.org/debian/dists/bullseye/main/binary-amd64/Packages  Connection timed out [IP: 146.75.114.132 80]
#6 314.4 E: Failed to fetch http://deb.debian.org/debian/dists/bullseye/main/binary-amd64/Packages  Connection timed out [IP: 146.75.114.132 80]
...
#8 141.4 E: Package 'cron' has no installation candidate
#8 ERROR: process "/bin/sh -c apt-get update && apt-get install -y --no-install-recommends cron &&     rm -r /var/lib/apt/lists/*" did not complete successfully: exit code: 100
------
 > [4/5] RUN apt-get update && apt-get install -y --no-install-recommends cron &&     rm -r /var/lib/apt/lists/*:
#8 141.4 W: Failed to fetch http://deb.debian.org/debian/dists/bullseye-updates/InRelease  Connection timed out [IP: 151.101.78.132 80]
#8 141.4 W: Some index files failed to download. They have been ignored, or old ones used instead.
#8 141.4 Reading package lists...
#8 141.4 Building dependency tree...
#8 141.4 Reading state information...
#8 141.4 Package cron is not available, but is referred to by another package.
#8 141.4 This may mean that the package is missing, has been obsoleted, or
#8 141.4 is only available from another source
#8 141.4
#8 141.4 E: Package 'cron' has no installation candidate
------
#8 CANCELED
#8 CANCELED
#8 CANCELED
failed to solve: process "/bin/sh -c apt-get update && apt-get install -y --no-install-recommends cron &&     rm -r /var/lib/apt/lists/*" did not complete successfully: exit code: 100
Unable to find image 'sentry-self-hosted-jq-local:latest' locally
Unable to find image 'sentry-self-hosted-jq-local:latest' locally
docker: Error response from daemon: pull access denied for sentry-self-hosted-jq-local, repository does not exist or may require 'docker login': denied: requested access to the resource is denied.
See 'docker run --help'.
docker: Error response from daemon: pull access denied for sentry-self-hosted-jq-local, repository does not exist or may require 'docker login': denied: requested access to the resource is denied.
See 'docker run --help'.

```

总感觉是网络问题，切换网络，切换镜像源啥的，花了几天时间，都找不到解决办法。

> 💡 此处应该请教运维同学，不要自己再瞎琢磨了

:::

### Vue 项目接入 Sentry 实践

> 官方文档：[https://docs.sentry.io/platforms/javascript/guides/vue/](https://docs.sentry.io/platforms/javascript/guides/vue/ "https://docs.sentry.io/platforms/javascript/guides/vue/")

#### 操作步骤

一个 Vue 项目接入 Sentry SaaS 版的具体流程如下：

1.  注册与登录

    首先，访问 Sentry 官网（[https://sentry.io/](https://sentry.io/ "https://sentry.io/") ）进行注册并登录，完成后进入 Sentry 的 Dashboard。

2.  创建项目

    在 Sentry Dashboard 中，点击“Create Project”，选择 Vue 作为项目类型，然后为项目命名并点击“Create Project”。

3.  安装 Sentry SDK

    在项目的根目录下，通过 npm 或 yarn 安装 Sentry 的 Vue SDK。打开终端并运行以下命令：

    ```bash
    npm install --save @sentry/vue
    ```

4.  配置 Sentry

    在 Vue 项目的`main.js`或`main.ts`文件中，引入并配置 Sentry。将以下代码添加到文件顶部：

    Vue2 代码

    ```javascript
    import Vue from "vue";
    import Router from "vue-router";

    Vue.use(Router);

    const router = new Router({
      // ...
    });

    // 生产环境接入Sentry
    // 如果不想接入Sentry，可以将 .env 文件中的 SENTRY_ENABLE 设置为 false，或者直接删除这个环境变量。
    if (process.env.VUE_APP_SENTRY_STATE === "true") {
      console.log("%c== Sentry init ==", "background:#7E57C2;");
      Promise.all([import("@sentry/vue")]).then((modules) => {
        const Sentry = modules[0];
        Sentry.init({
          Vue,
          // 在Sentry项目页面获取DSN
          dsn: process.env.VUE_APP_SENTRY_DSN,
          // 启用浏览器端的性能追踪功能，并对 Vue Router 的路由变化进行性能追踪。
          integrations: [
            new Sentry.BrowserTracing({
              routingInstrumentation: Sentry.vueRouterInstrumentation(router),
              // 定义了允许追踪性能的源。在这个例子中，包括本地开发环境（localhost）、空字符串（表示当前域名）以及当前域名下的所有路径（通过正则表达式 /^\// 匹配）。
              tracePropagationTargets: ["localhost", /^\//],
            }),
          ],
          // 是否在控制台打印错误信息
          logErrors: true,
          // Set tracesSampleRate to 1.0 to capture 100%
          // of transactions for performance monitoring.
          // We recommend adjusting this value in production
          // 设置采样率，1.0表示100%的请求都会被追踪
          tracesSampleRate: 1.0,
          release: process.env.VUE_APP_VERSION,
        });
      });
    }

    // ...

    new Vue({
      router,
      render: (h) => h(App),
    }).$mount("#app");
    ```

    `.env`代码为：

    ```
    VUE_APP_SENTRY_ENABLE=false
    VUE_APP_SENTRY_DSN=https://6a47xxx34e7bxxx5996c87@o136xx522.ingest.sentry.io/450504xxx56736
    VUE_APP_VERSION=1.0
    ```

    Vue3 代码

    ```javascript
    import { createApp } from "vue";
    import { createRouter } from "vue-router";
    import * as Sentry from "@sentry/vue";

    const app = createApp({
      // ...
    });
    const router = createRouter({
      // ...
    });

    // 引入sentry
    // sentry已启用 && (测试环境 || beta环境)
    if (
      import.meta.env.VITE_SENTRY_ENABLE === "true" &&
      (import.meta.env.VITE_SERVER_MODE === "testBuild" ||
        import.meta.env.VITE_SERVER_MODE === "developmentBuild")
    ) {
      console.log("%c== Sentry init ==", "background:#7E57C2;");
      Sentry.init({
        app,
        dsn: import.meta.env.VITE_SENTRY_DSN,
        integrations: [
          new Sentry.BrowserTracing({
            // Set `tracePropagationTargets` to control for which URLs distributed tracing should be enabled
            tracePropagationTargets: ["localhost", /^\//],
            routingInstrumentation: Sentry.vueRouterInstrumentation(router),
          }),
          new Sentry.Replay(),
        ],
        // Performance Monitoring
        tracesSampleRate: 1.0, // Capture 100% of the transactions, reduce in production!
        // Session Replay
        replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
        replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
        release: import.meta.env.VITE_APP_VERSION || "1.0",
      });
    }

    app.use(router);
    app.mount("#app");
    ```

    `.env`代码为：

    ```
    VITE_SENTRY_ENABLE=true # sentry手动开关
    VITE_SENTRY_DSN=https://56a60ccxxx71ab9xxx@o136x22.ingest.sentry.io/45053xxx7312
    VITE_SENTRY_AUTH_TOKEN=6226f50xxxea6decb92d7d07afxxx
    VITE_SENTRY_ORG=481931cxxx
    VITE_SENTRY_PROJECT=ty-store
    VITE_APP_VERSION=1.6.0
    ```

5.  配置性能监控 &#x20;

    若要启用性能监控，需要在 Sentry 初始化配置中添加`tracesSampleRate`属性，设置采样率（0 到 1 之间的值）

6.  验证配置 &#x20;

    在 Vue 项目中故意引入一个错误，例如在某个组件的方法中抛出一个异常，然后运行项目并触发该错误。检查 Sentry Dashboard，确认错误已经被捕获并显示。

7.  部署与监控 &#x20;

    完成配置后，将 Vue 项目部署到生产环境。Sentry 将自动捕获并报告生产环境中的错误和性能问题。

#### 配置 Source Maps

> 官方文档：[https://docs.sentry.io/platforms/javascript/guides/vue/sourcemaps/](https://docs.sentry.io/platforms/javascript/guides/vue/sourcemaps/ "https://docs.sentry.io/platforms/javascript/guides/vue/sourcemaps/")

当我们在 Sentry 点进错误详情的时候可以看到，显示的堆栈跟踪不够清晰。当我们上传 Source Maps 文件后，就能直接定位到错误的行数，更加方便我们定位错误代码。

下面是官方给出的对比图：

![](image_5RVperOIYB.png)

上传 sourceMap 到 sentry 平台 这里有两种方式&#x20;

- `sentry-cli`
- &#x20;`sentry-webpack-plugin`

这里为了方便采用 webpack 方式。

**vue2+webpack**

- 安装插件

```bash
npm install --save-dev @sentry/webpack-plugin
```

- 配置`vue.config.js`

```javascript
const { defineConfig } = require("@vue/cli-service");
const SentryWebpackPlugin = require("@sentry/webpack-plugin");

const isProd = process.env.NODE_ENV === "production";
/**
 * 是否通过 sentry 上传 SourceMap 文件
 添加 linux 判断，避免其他环境构建上传版本号影响
 */
const isSentry =
  isProd &&
  process.env.VUE_APP_SENTRY_ENABLE &&
  ["linux"].includes(os.platform());
// 是否满足 Sentry 上报条件
process.env.VUE_APP_SENTRY_STATE = `${isSentry}`;

module.exports = defineConfig({
  transpileDependencies: true,
  // 输出 map 文件 (sentry 环境上开启)
  productionSourceMap: process.env.VUE_APP_SENTRY_STATE === "true",
  configureWebpack: (config) => {
    if (process.env.VUE_APP_SENTRY_STATE === "true") {
      config.plugins.push(
        new SentryWebpackPlugin({
          org: process.env.VUE_APP_SENTRY_ORG,
          project: process.env.VUE_APP_SENTRY_PROJECT,
          // 上传生成的 Source Maps 的目录
          include: "./dist",
          ignore: ["node_modules", "vue.config.js"],
          // authToken获取地址：https://sentry.io/settings/account/api/auth-tokens/
          authToken: process.env.VUE_APP_SENTRY_AUTH_TOKEN,
          release: process.env.VUE_APP_VERSION || "1.0", // 与 main.js 中的 release 保持一致
          // urlPrefix: "~/static/", // 当index.html和include源非同级时使用
        })
      );
    }
  },
});
```

- 设置`.env`文件

```bash
VUE_APP_SENTRY_ENABLE=true # sentry手动开关
VUE_APP_SENTRY_AUTH_TOKEN=6226f50xxxxecbxxxxb64xxe8e162
VUE_APP_SENTRY_ORG=481xxx245
VUE_APP_SENTRY_PROJECT=vue2-demo
VUE_APP_SENTRY_DSN=vue2-demo
VUE_APP_VERSION=1.0
```

- `main.js`修改

```javascript
Sentry.init({
  // ...
  // release可以不用设置，sentry会自动生成一个随机数版本。
  // 如何设置了的话，需要与 vue.config.js 中的 release 保持一致
  release: process.env.VUE_APP_VERSION,
});
```

- 测试

运行程序，可以看到已经将 map 上传到了 sentry 服务。

![](image_vH7DRJAsud.png)

我们再次尝试让代码报错，然后看到已经可以定位到代码具体的行数。

![](image_UD9_XHXV7b.png)

Vue3+vite 配置

```javascript
import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { sentryVitePlugin } from "@sentry/vite-plugin";

const loadEnvByMode = (mode, env) => {
  return loadEnv(mode, process.cwd())[env];
};

// https://vitejs.dev/config/
export default defineConfig((mode) => {
  // 获取环境变量
  console.log("⭐mode==>", mode);
  console.log("当前环境NODE_ENV==>", process.env.NODE_ENV);

  // 是否开启 sentry
  const enableSentry =
    (mode == "developmentBuild" || mode == "testBuild") &&
    loadEnvByMode(mode, "VITE_SENTRY_ENABLE") == "true";
  let viteConfig = {
    build: {
      sourcemap: enableSentry, // Source map generation must be turned on
    },
    plugins: [
      vue(),

      // Put the Sentry vite plugin after all other plugins
      sentryVitePlugin({
        org: loadEnvByMode(mode, "VITE_SENTRY_ORG"),
        project: loadEnvByMode(mode, "VITE_SENTRY_PROJECT"),

        // Auth tokens can be obtained from https://sentry.io/settings/account/api/auth-tokens/
        // and need `project:releases` and `org:read` scopes
        authToken: loadEnvByMode(mode, "VITE_SENTRY_AUTH_TOKEN"),

        sourcemaps: {
          // Specify the directory containing build artifacts
          assets: "./dist/**",
          ignore: ["node_modules"],
          deleteFilesAfterUpload: "./dist/**/*.map",
        },
      }),
    ],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
  };
  return viteConfig;
});
```

#### 注意事项

注意：`@sentry/webpack-plugin`在上传后不会删除 sourceMap，需要在构建之后删除 `.map` 代码：

::: warning
sourcemaps.deleteFilesAfterUpload 可以删除`.map`文件，目前还未验证
:::

```json
"scripts": {
    "build": "vue-cli-service build && rm -fr ./dist/js/*.map"
}
```

#### 遇到的问题

**1、安装`@sentry/webpack-plugin`一直失败**

```
D:\Gitee\vue2-demo>npm i @sentry/webpack-plugin -D
npm ERR! code 1
npm ERR! path D:\Gitee\vue2-demo\node_modules\@sentry\cli
npm ERR! command failed
npm ERR! command C:\Windows\system32\cmd.exe /d /s /c node ./scripts/install.jsnpm ERR! [sentry-cli] Using cached binary:
C:\Users\daotin\AppData\Local\npm-cache\sentry-cli\a309cb-sentry-cli-Windows-x86-64.exe
npm ERR! Error: Command failed: D:\Gitee\vue2-demo\node_modules\@sentry\cli\sentry-cli.exe --version

npm ERR! A complete log of this run can be found in:
npm ERR!     C:\Users\daotin\AppData\Local\npm-cache\_logs\2023-04-21T00_46_28_138Z-debug-0.log
```

原因未知，但是在自己家里可以。**可能是公司网络问题。**

::: details 尝试使用`--ignore-scripts`指令
家里的 npm 和 node 版本都和公司的一样，也是同一个项目，但是公司的就是安装不了。。

尝试使用`--ignore-scripts`指令跳过执行 package.json 中定义的安装脚本。

在默认情况下，当你通过 npm install 命令安装一个包时，npm 会执行该包（以及它依赖的其他包）中定义的安装脚本。这些脚本通常用于执行一些初始化操作，如编译、构建或配置环境等。然而，有时安装脚本可能会失败，或者你可能不想执行它们，这时就可以使用 --ignore-scripts 选项来跳过这些脚本的执行。

在你的情况下，由于 @sentry/vite-plugin 的安装脚本需要 sentry-cli 命令，但是该命令在你的系统中没有找到，因此安装失败。使用 --ignore-scripts 选项可以让 npm 跳过这个脚本的执行，从而完成包的安装。

```
npm install @sentry/vite-plugin --save-dev --ignore-scripts
```

安装得以顺利进行，但是最后在打包的时候还是报错。目前还未解决！
:::

**2、配置 sourcemap 后，构建`npm run build`报错：**

```javascript
error  in ./node_modules/@sentry/webpack-plugin/src/sentry-webpack.module.js

Syntax Error: Thread Loader (Worker 1)
releasePromise.then is not a function
```

解决方案：set the [parallel](https://cli.vuejs.org/config/#parallel "parallel") option to `false` to disable the `thread-loader`:

```javascript
// vue.config.js
module.exports = {
  parallel: false,
  // ...
};
```

**3、本地启动 dev 环境尝试使用 sourcemap 会有问题**

在开发环境尝试使用 sourcemap 会有问题就是，上传到的 sourcemap 是带有 hash 的，但是我们在本地运行时是没有 hash 的，于是会在 Sentry 服务界面提示 warning：

```javascript
The given abs_path of the stack frame is [http://localhost:8080/js/about.js](http://localhost:8080/js/about.js) which doesn't match any release artifact。
```

所以，sourcemap 的测试需要发布到生产环境进行测试。

#### 自定义上报

Sentry 提供了丰富的配置选项，允许你根据需要自定义哪些错误需要上报，哪些错误不需要上报。

- `ignoreErrors`：一个字符串列表或正则表达式模式的清单，用于匹配不应发送到 Sentry 的错误消息。与这些字符串或正则表达式匹配的消息将在发送到 Sentry 之前被过滤掉。使用字符串时，部分匹配将被过滤掉，因此如果需要按精确匹配进行过滤，请改用正则表达式模式。默认情况下，所有错误都会被发送。
- `ignoreTransactions`：一个字符串或正则表达式模式的列表，用于匹配不应该发送到 Sentry 的交易名称。
- `denyUrls`：一个字符串或正则表达式模式的列表，用于匹配不应该发送到 Sentry 的错误 Urls。如果您将 `'foo.com'` 添加到列表中，它也会匹配 `https://bar.com/myfile/foo.com`
- `allowUrls`：与`denyUrls`相反。
- `beforeSend`：一个函数，接受一个异常作为参数，并返回一个可选的异常对象或 null。如果这个函数返回一个异常对象，Sentry 将使用它来代替原始异常。如果这个函数返回 null，Sentry 将忽略这个异常。你可以使用`beforeSend`函数来过滤异常、修改异常信息或添加自定义上下文信息。
- `sampleRate`：一个数字，表示异常上报的采样率。例如，如果将`sampleRate`设置为 0.5，Sentry 将仅对 50%的异常进行上报。这个选项可以帮助你控制异常上报的数量，尤其是在异常频率很高的情况下。

#### 手动捕获异常

如果编写了 try/catch 而不重新抛出异常，则该异常将永远不会出现在 Sentry，除非手动捕获。

```javascript
// 异常手动捕获
try {
  aFunctionThatMightFail();
} catch (err) {
  Sentry.captureException(err);
}
```

#### 上传日志信息

有时我们不仅仅要收集异常信息，还需要在页面中打 log 来收集页面运行数据。通常不会发出消息，但它们对某些团队很有用。

```javascript
import * as Sentry from "@sentry/vue";

Sentry.captureMessage("this is a debug message", "debug");
```

> 可用级别为 `"fatal"` 、 `"critical"` 、 `"error"` 、 `"warning"` 、 `"log"` 、 `"info"` 和 `"debug"` 。

## Sentry Error 错误分析

第一种错误我们能一眼看出，比如：

```
Uncaught (in promise) SyntaxError: Expected ',' or '}' after property value in JSON at position 6
```

这个错误就是使用`JSON.parse`解析字符串时，字符串的格式不对，导致的错误。

然后我们可以通过 sentry 中告诉你的`文件路径`，或者`路由地址`，找到对应的文件，最后解决问题。

但是，还有一些错误可能没有文件路径，通过路由地址则太过宽泛了，不好对应到错误的具体位置。于是我们可以通过`面包屑（操作步骤）`来找到错误的位置。

比如下面这个错误：

```
Non-Error promise rejection captured with keys: remark
```

通过搜索，得到这个错误的解释如下：

```
这个错误表示某个 Promise 被拒绝了，但是被拒绝的值不是一个 Error 对象，而是一个非 Error 类型的值。
通常情况下，Promise 被拒绝时应该返回一个 Error 对象，以便调用者能够识别和处理错误。
但是在这种情况下，Promise 被拒绝的值不是一个 Error，而是一个具有键为 "remark" 的对象。

这个错误通常发生在代码中没有正确处理 Promise 的错误处理程序时。
要解决这个问题，你需要确保你的 Promise 链中的每个 Promise 都有一个错误处理程序，
并且在处理程序中返回一个 Error 对象。你还可以检查被拒绝的值是否符合预期的类型，并相应地进行处理。
```

看完，还是不知道是什么错误，于是通过面包屑，重现错误发生的过程：

![](image_prReBAXID3.png)

从而定位到了函数的位置，下面为调用的函数：

```javascript
async fileUpload(file) {
      try {
        this.submitLoading = true;
        this.loadingUpImg = true;

        const params = new FormData();
        params.append("image", file.raw);
        const data = await apis.device.apifileUpImage(params);
        this.loadingUpImg = false;
        this.submitLoading = false;

        return Promise.resolve(data);
      } catch (error) {
        console.error(error);
        this.loadingUpImg = false;
        this.submitLoading = false;
        return Promise.reject(error);
      }
    }
```

然而看了半天，依然没有发现有什么问题。最后，我通过问我的私人助理 ChatGPT 得到了答案。

我让它帮我看下这个代码是否会出现`Non-Error promise rejection captured`的错误，ChatGPT 的回答如下：

根据提供的代码，fileUpload 函数似乎是一个有效的异步函数，用于处理文件上传。它将两个加载标志设置为 true，创建一个新的 FormData 对象，将原始文件数据附加到其中，然后调用异步 API 函数上传图像。上传完成后，将加载标志设置为 false，并使用上传的数据返回已解决的 Promise。 &#x20;

如果出现错误，函数会捕获它，将其记录到控制台中，将加载标志设置为 false，并返回一个带有错误的拒绝 Promise。 &#x20;

关于您关于“`Non-Error promise rejection captured`”的问题，如果使用非 Error 值调用 Promise.reject()方法，则可能会发生此错误。如果 catch 块返回不是 Error 类的实例的值，则可能会发生这种情况。 &#x20;

为避免此错误，建议始终在 catch 块中抛出 Error 类的实例，如下所示：

```javascript
catch (error) {
  console.error(error);
  this.loadingUpImg = false;
  this.submitLoading = false;
  throw new Error(error);
}
```

于是，问题解决。

::: tip **总结关于错误的解决方案：**

- 首先看错误提示，是否一眼看出错误问题，不能的先去搜索一下
- 然后找到错误所在的`文件名称`（如果上传了 sourcemap 则更清晰）
- 如果没有文件显示，则通过`路由地址`找到大概的范围，再通过`面包屑`找到具体的复现过程。

:::

## Sentry Performance 性能分析

在使用 `Sentry` 做性能监控时，有三个非常关键的环节：

- 收集性能指标数据
- 对性能指标数据做分析
- 根据分析结果做优化

有了这三个环节，性能监控才能算是有了一条相对完整的链路。

### 功能介绍

`Sentry` 在上报性能指标数据时，会把数据分为首屏 - `pageload` 和页面切换 - `navigation` 两类。（分别对应下面的`Web Vitals`和`Frontend`两大模块）。

在性能页面，我们可以监控每一笔交易的详细信息。

一笔交易表示您要测量或跟踪的活动的单个实例，例如`页面首次加载`、`页面切换导航`或`异步任务`。

> **交易是性能分析的基本单位，所有的分析都是围绕交易进行的。**

下面是各个模块的功能：

- `trends view` ：趋势视图显示了随着时间的推移其加载时间发生重大变化的交易。当您有大量交易时，此视图非常适合提供见解。
- `交易详情`：点击一个交易进入交易详情。每笔交易都有一个摘要视图，可让您更好地了解其整体健康状况。通过此视图，您将找到图表、这些事件的实例、统计信息、方面地图、相关错误等。
- `Web Vitals`：Google 定义的一组前端性能指标，比如我们常见的 FCP，LCP 等。
- `Frontend`：包括所有前端交易，不仅包含 Web Vitals，还有页面调整后页面加载的性能。
- `Backend`：强调持续时间、吞吐量、故障率和 Apdex。请注意，如果您选择了前端项目，此模式还会显示所有前端事务。

### 性能指标

一些常见的性能数据指标有如下一些：

- `TPM`: 每分钟事务数；
- `FCP`：首次内容绘制（在页面上第一次出现任何视觉内容的时间。这可能是文本，图像，SVG 等。）；页面上第一个内容元素（比如文字、图片、视频等）被渲染出来的时间点，也就是用户可以看到页面上有内容的时间。因此，FCP 是衡量网页加载速度和用户体验的一个重要指标，通常被用来表示页面的首屏加载时间。
- `LCP`：最大内容渲染（页面开始加载到主要内容元素在视口中呈现的时间）；
- `FID`：用户首次输入延迟，可以衡量用户首次与网站交互的时间；
- `TTFB`：首字节时间，测量用户浏览器接收页面的第一个字节的时间（可以判断缓慢来自网络请求还是页面加载问题）；
- `TTI`：可交互时间，用于测量页面从开始加载到主要资源完成渲染，并能够快速、可靠地响应用户输入所需的时间, 值越小约好。
- `CLS`：页面视觉是否有稳定。用于测量整个页面生命周期内发生的所有意外布局偏移中最大一连串的布局偏移情况。值越小，表示页面视觉越稳定。

下面是一张图进行形象说明：

![](image_jkcYGNwcVh.png)

Sentry 中的性能数据指标有如下这些：

- `p75 FID`：一种衡量 LCP 性能的度量，它表示针对所有请求，LCP 值排名第 75% 的请求所需的时间。其他 p50，p95 都是类似的。例如，`FID` 平均时间为 `150ms`， `P50` 为 `29.61ms`， `P75` 为 `169ms`， `P95` 为 `600ms`。这表示我们的首屏 `FID` 耗时，50% 在 `30` ms 以内，50% 在 `30ms` 以外；75%在 `170ms` 以内，25% 在 `170ms` 以外；95% 在 `600 ms` 以内，5% 在 `600 ms` 以外。
- `User Misery`：用户痛苦度，是一种衡量应用程序用户体验的指标。值越大，表示用户体验越差。
- `Transactions Per Minute（TPM）`：衡量应用程序交易处理速度的指标，通常是指每分钟完成的事务数量，其中事务可以是用户请求、API 调用或其他类型的操作。

### 如何使用

我们主要关注的就是上面提到的常见的性能数据指标，包括`FCP`，`LCP`等。

在 Web Vitals 界面，我们可以看到所有页面首次加载的时间。如果过长，可以进入交易详情进行分析。

![](image_JfG7KnG_I0.png)

比如我们常说的“页面秒开”指标，就可以在 Web Vitals 界面找到。一般来说，页面秒开指的就是 FCP。

> 关于如何评判 `FCP`、`LCP`、`FID`、`CLS` 表现的优劣，`Sentry` 提供了标准:

![](image_7KxziFpcgL.png)

点进去后，我们可以看到这些首屏按照用时长度降序排列：

![](image_CiICfCZGcc.png)

点击其中一个 Event ID，可以看到具体的各个部分的花费时长，比如 http 请求，资源请求，以及其他的。

![](image_ccBVaxt7XQ.png)

我们可以看到 http 花费的时间最长，可以找打对应的接口，告诉后端改进，或者考虑是否因为请求过多；如果是 resource 花费的时间长，可以考虑减少资源请求等操作。

参考资料

- [Sentry 的官方演示视频](https://www.youtube.com/watch?v=Ap5lQg7UL-s "Sentry的官方演示视频")：了解 Sentry 性能监控如何帮助您找到并解决最具影响力的性能问题
- [使用 Sentry 做性能监控 - 分析优化篇](https://juejin.cn/post/7151753139052347399 "使用 Sentry 做性能监控 - 分析优化篇")：关于各个图标解释的很详细。

::: tip **总结一些前端优化明显的大方向：**

- 优化打包体积
- 优化首页接口数量
- 优化资源加载速度

:::

如果这些做好了，基本上大的性能问题就解决了。

除此之外，sentry 的 performance 还有很多指标，留着慢慢发掘吧 :)

（完）
