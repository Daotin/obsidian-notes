# 配置环境变量

## 开发环境和生产环境的区别

开发环境下，Vue 会提供很多警告来帮你对付常见的错误与陷阱。而在生产环境下，这些警告语句却没有用，反而会增加应用的体积。此外，有些警告检查还有一些小的运行时开销，这在生产环境模式下是可以避免的。

开发环境(development)和生产环境(production)的构建目标差异很大。

在开发环境中，我们需要具有强大的、具有实时重新加载(live reloading)或热模块替换(hot module replacement)能力的 source map 和 localhost server。

而在生产环境中，我们的目标则转向于关注更小的 bundle，更轻量的 source map，以及更优化的资源，以改善加载时间。

## `process. env`

`process` 对象是全局变量，它提供当前 node.js 的有关信息，以及控制当前 node.js 的有关进程。因为是全局变量，它对于 node 应用程序是始终可用的，无需 `require()`。

`process` 对象用于处理与当前进程相关的事情，它是一个全局对象，可以在任何地方直接访问到它而无需引入额外模块。

`process. env` 获取当前系统环境信息的对象，常规可以用来进一步获取环境变量、用户名等系统信息：

```js
console.log(process. env);
console.log("username: " + process. env.USERNAME);
console.log("PATH: " + process. env.PATH);
```

### `process. env. NODE_ENV`

首先要明白一点：

:::tip
`process. env`对象上本来是不存在 `NODE_ENV` 这个属性的。
:::

然而`process. env. NODE_ENV`可用，是前端工程化过程中大家约定俗成的做法，尤其是 webpack 构建前端工程时，会经常使用。

> 那这个属性是什么时候赋值给`process. env`的呢？

其实是 webpack 或者 vite 等工具，在构建时，将 `NODE_ENV` 赋值给`process. env`对象的。至于为什么叫`NODE_ENV`，应该是约定成俗的吧。

NODE_ENV 通常为“production”（生产环境）和“development”（开发环境），或者“prod”和“dev”，以此来区分不同环境下的逻辑行为。

我们可以通过在运行脚本时，手工对 NODE_ENV 赋值。例如 `package.json` 中的脚本：

```js
"scripts": {
  "dev": "NODE_ENV=development webpack --watch ",
  "build": "NODE_ENV=development webpack --mode=production"
},
```

::: warning
说明：`NODE_ENV=development` 在 windows 环境下会报错，需要改为 `set NODE_ENV=production` ，为了解决这个差异，可以使用 `cross-env` 跨平台的设置和使用环境变量。

```js
"scripts": {
  "serve": "cross-env NODE_ENV=development vite",
  "build": "cross-env NODE_ENV=prod vite build --mode prod",
},
```

:::

## 在 vite 中的配置

在 vite 启动后，会在 vite 内部来设置 `NODE_ENV`，所以我们才能在项目中使用。

之前，我们在 `scripts` 命令中使用 `cross-env` 来设置 `NODE_ENV`，但是如果需要配置的环境变量太多，全部设置在 `scripts` 命令中既不美观也不容易维护，所以我们可以将环境变量配置在 `.env` 文件中。

### `import. meta. env`

Vite 在一个特殊的 `import. meta. env` 对象上暴露环境变量。比如`import. meta. env.MODE`表示应用运行的模式。但是只有几个内置变量可用：

- `import. meta. env.MODE`: string 应用运行的模式。
- `import. meta. env.BASE_URL`: string 部署应用时的基本 URL。他由 base 配置项决定。
- `import. meta. env.PROD`: boolean 应用是否运行在生产环境。
- `import. meta. env.DEV`: boolean 应用是否运行在开发环境 (永远与 `import. meta. env.PROD` 相反)。
- `import. meta. env.SSR`: boolean 应用是否运行在 server 上。

:::tip
当我们设定 `.env` 环境变量文件后，`VITE_`开头的变量就会出现在 `import. meta. env` 中，我们就可以在项目中使用。
:::

### `.env`文件

Vite 使用 `dotenv` 从你的 环境目录 中的下列文件加载额外的环境变量：

```
.env                # 所有情况下都会加载
.env.local          # 所有情况下都会加载，但会被 git 忽略
.env.[mode]         # 只在指定模式下加载
.env.[mode].local   # 只在指定模式下加载，但会被 git 忽略

```

加载的环境变量也会通过 `import. meta. env` 以字符串形式暴露给客户端源码。

为了防止意外地将一些环境变量泄漏到客户端，只有以 `VITE_` 为前缀的变量才会暴露给经过 vite 处理的代码（**也就是说只有 `VITE_`开头的自定义变量会出现在 `import. meta. env` 中**）。

例如下面这些环境变量：

```
VITE_SOME_KEY=123
DB_PASSWORD=foobar
```

只有 `VITE_SOME_KEY` 会被暴露为 `import. meta. env.VITE_SOME_KEY` 提供给客户端源码，而 `DB_PASSWORD` 则不会。

```js
console.log(import. meta. env.VITE_SOME_KEY); // 123
console.log(import. meta. env.DB_PASSWORD); // undefined
```

当然，我们可以自定义 env 变量的前缀，请参阅 [envPrefix](https://cn.vitejs.dev/config/shared-options.html#envprefix)（不过，也没必要修改）。

## 实际测试和配置

### 测试结果

**vite.config.ts 会先于 main.ts 运行**

1、在 vite.config.ts 中：

- 在 vite 中打印 `process. env` 只有一些内置的变量，是没有任何 `NODE_ENV` 的，也没有任何 `VITE_`开头的环境变量
- 在 vite 中打印 `import. meta. env` 为 undefined

当 vite 执行完成后（大约 2s，会执行 main.ts 文件）：

2、在 main.ts 中：

- 在 main.ts 中打印 `process. env` 会报错，提示 process is not defined (因为 vite3 移除了这个变量：https://github.com/vitejs/vite/issues/1973)
- 在 main.ts 中打印 `import. meta. env` 会有除了内建变量外，还有自定义 `VITE_`开头的环境变量

![](../images/env-1.png)

3、在 main.ts 执行完成后，再到 vue 组件中看看：

- 在 login.vue 中打印 `process. env` 会报错，提示 process is not defined
- 在 login.vue 中打印 `import. meta. env` 会有除了内建变量外，还有自定义 `VITE_`开头的环境变量

跟 main.ts 中是一致的。

4、再到其他 js 文件中看看，比如 `tailwind.config.js` 文件：

- 打印 `process. env`，除了内置的变量，还多出了`VITE_USER_NODE_ENV`和`NODE_ENV`，是在 vite 中添加的（参考文章：[vite 项目为什么可以直接使用 NODE_ENV](https://daotin.github.io/posts/2022/11/16/vite%E9%A1%B9%E7%9B%AE%E4%B8%BA%E4%BB%80%E4%B9%88%E5%8F%AF%E4%BB%A5%E7%9B%B4%E6%8E%A5%E4%BD%BF%E7%94%A8NODE_ENV.html)），但是其他的`VITE_`开头的变量（比如 `VITE_BASE_URL`）不在里面。
- 打印 `import. meta. env` 会报错

### 如何配置

那么，如何得到一个完整的对象，包含 `process. env` 内置变量，`import. meta. env` 内置变量（一般用处不大），还有自定义的环境变量呢？

答案：就是使用[define](https://cn.vitejs.dev/config/shared-options.html#define)

具体设置如下，我们设置了`process. env`对象，又单独设置了`NODE_ENV`：

```js
define: {
  'process. env': {
    ...process. env,
    ...loadEnv(mode, process.cwd()),
    NODE_ENV: loadEnv(mode, process.cwd())?.VITE_USER_NODE_ENV,
  },
},
```

此时，除了 `vite.config.ts` 和 `tailwind.config.js` 外，其他的 ts 文件，vue 文件都可以在 `process. env` 拿到完整的 **`process. env` 内置变量** 和 **`VITE_`开头的自定义的环境变量** 。

- `vite.config.ts` 因为是入口，所以还是只能拿到 `process. env` 内置变量
- `tailwind.config.js` 能拿到 `process. env` 内置变量，外加 `VITE_USER_NODE_ENV`，也够用了。
- 其他地方，一律使用`process. env.VITE_USER_NODE_ENV` 或者 `process. env.NODE_ENV` 即可。

### vite.config.ts 怎么使用 env 文件定义的环境变量？

首先，它好像也用不上 env 中自定义的环境变量，实在想用，可以使用 Vite 导出的 `loadEnv` 函数来加载指定的 `.env` 文件，或者使用骚操作，[通过 node 文件读取的方式](https://github.com/vitejs/vite/issues/1930#issuecomment-778595832)进行。

毕竟尤雨溪也说过，这是个“[鸡生蛋，蛋生鸡](https://github.com/vitejs/vite/issues/1930)”的问题。
