# VSCode Debug技巧

## 调试网页

### 配置详解

```json
{
  "name": "vscode调试",

  // launch：launch 的意思是把 url 对应的网页跑起来，指定调试端口，然后页面会自动attach到这个端口。
  // attach：如果你已经有一个在调试模式跑的浏览器了，那直接 attach上就行
  "request": "launch",

  // 浏览器
  "type": "chrome",

  "runtimeArgs": [
    "--auto-open-devtools-for-tabs" // 打开网页都默认调起 Chrome DevTools
    "--incognito" // 无痕模式
  ],

  // "canary"、"stable"、"custom" 或浏览器可执行文件的路径。 Custom 表示自定义包装器、自定义生成或 CHROME_PATH 环境变量。
  "runtimeExecutable": "canary",

  // userDataDir 是保存用户数据的地方，比如你的浏览记录、cookies、插件、书签、网站的数据等等
  // 默认是 true，代表创建一个临时目录来保存用户数据。
  // 设置为false，可以记录登录状态、历史记录
  // 也可以指定一个自定义的路径，这样用户数据就会保存在那个目录下
  // 注意：userDataDir 只能跑一个 Chrome 实例，所以我使用chrome调试，edge用作其他搜索
  "userDataDir": false,

  "url": "<http://localhost:8080>",

  // workspaceFolder: 把 / 的 url 映射到了 ${workspaceFoder} 项目根目录
  "webRoot": "${workspaceFolder}",

  // 是否关闭sourcemap映射
  "sourceMaps": false,

  // 除了启动开发服务器然后连上 url 调试之外，也可以直接指定某个文件，VSCode Debugger 会启动静态服务器提供服务
  "file": "$workspaceFolder}/index.html"

  // sourcemap重映射：有时候，sourcemap 到的文件路径在本地里找不到，代码就是只读的，这时候就需要再次手动映射到本地文件
  // 以下是：默认有三个值，分别是把 meteor、webpack 开头的 path 映射到了本地的目录下。
  // 其中 ?:* 代表匹配任意字符，但不映射，而 * 是用于匹配字符并映射的。
  // 举例：最后一个 webpack://?:/ 到 ${workspaceFolder}/* 的映射，就是把 webpack:// 开头，后面接任意字符 + / 然后是任意字符的路径映射到了本地的项目目录
  "sourceMapPathOverrides": {
    "meteor://💻app/*": "${workspaceFolder}/*",
    "webpack:///./~/*": "${workspaceFolder}/node_modules/*",
    "webpack://?:*/*": "${workspaceFolder}/*"
  }
}

```

常用配置：

```json
{
  "name": "vscode调试",
  "request": "launch",
  "type": "chrome",
  "runtimeArgs": ["--auto-open-devtools-for-tabs"],
  "runtimeExecutable": "canary",
  "userDataDir": false,
  "url": "<http://localhost:8080>",
  "webRoot": "${workspaceFolder}"
}

```

### 调试 Vue 项目

启动后，先打个断点发现不起效，分析是路径不对。

怎么找路径？

先在代码里面写 `debugger`，进入调试窗口，查看目前的状况。

- 发现他从一个乱七八糟的路径，映射到了 webpack://vue-demo1/src/App.vue?11c4 的路径下。
- 然后在 VSCode Debugger 里看看这个路径，发现是 /Users/guang/code/vue-demo1/src/App.vue?11c4
- 其实这个路径已经做过了映射，就是完成了从 webpack:///vue-demo1/src/App.vue?11c4 到 /Users/guang/code/vue-demo1/src/App.vue?11c4 的映射。（使用的 sourceMapPathOverrides 的第三条配置）

但问题就出现在后面多了一个 ?hash 的字符串，导致路径不对了。所以在我们 vue 代码里面打断点会显示未关联，因为对应的本地文件没有。

那为什么会多这样一个 hash 呢？

这是因为 vue cli 默认的 devtool 设置是 `eval-cheap-module-source-map`，sourceURL 的路径是通过 [module] 指定的，而模块名后默认会带 ?hash。

解决办法就是：从 eval-cheap-module-source-map 变为 source-map。

- 去掉 module（最后 webpack 的配置为：`config.devtool = "source-map"`）
    
    ```jsx
    configureWebpack(config) { 
      config.devtool = "source-map";
    }
    ```
    
- 添加配置（具体可以打断点在调试界面看路径）
    
    ```json
    "sourceMapPathOverrides": {
      "webpack:///src/*": "${workspaceFolder}/src/*"
    }
    
    ```
    

## 调试源码

### 调试 vue 源码

1、下载 vue 源码

```
git clone <https://github.com/vuejs/core> vue3-core

```

2、使用 pnpm 安装

> PS：注意去掉 package.json 中的 puppeteer，用来做集成测试的，一是用不到，二是网络问题不去掉一直安装失败。
> 

```
pnpm install

```

3、生成 sourcemap

- 方式一：直接 `pnpm run build --sourcemap` 打包即可
- 方式二：由于在 rollup.config.js 看到 `output.sourcemap = !!process.env.SOURCE_MAP` ，想要生成 sourcemap，需要 SOURCE_MAP 环境变量为 true。
- 安装 cross-env

```
pnpm add cross-env

```

- 设置 `"build": "cross-env SOURCE_MAP=true node scripts/build.js"`
- 使用 `pnpm run build`打包

然后去 packages 下各个包下的 dist 产物，你就会发现有 sourcemap 了。

4、把 `runtime-core` 包下的 dist 复制出来，替换 vue 项目的 `@vue/runtime-core` 下的 对应的 dist 目录。

注意是替换而不是删了整个 dist，因为还有一个文件是需要的。

![](images/Pasted%20image%2020250121153415.png)

> 注意 1：vue 源码的版本一定要和 vue 项目中使用的 vue 版本相同，否则启动会报错！
> 
> 
> 注意 2：使用 vite 搭建的 vue 项目没有生效。原因：vite 没有 source-map-loader 这些东西，无法读取 node_modules 下模块的 sourcemap。解决办法：一是调试源码就用 webpack 的 vue3 项目。二是把 vite 中配置 `optimizeDeps: { exclude: ["vue"], }` 排除一下 deps，然后删除 node_modules 下 `.Vite`文件夹。
> 
> 注意 3：如果无法打断点，就把 vue 项目重新安装跑一下。。。
> 

![](images/Pasted%20image%2020250121153443.png)

按照流程跑起来后，确实链接的是本地路径，不过现在 sourcemap 到的路径不大对，没有 runtime-core 的包名，不能编辑：

解决方式有 2 种：

1. 一种是配置下 sourceMapPathOverrides，把这段路径再做一次映射，映射到源码目录就可以了。
2. 另一种方式就是改造下 vue3 的 build 脚本，让生成的 sourcemap 就直接是正确的路径。

但是第一种的话不太好找，所以采用第二种。

```
// output.sourcemap = !!process.env.SOURCE_MAP
output.sourcemapPathTransform = (relativeSourcePath, sourcemapPath) => {
  const newSourcePath = path.join(
    path.dirname(sourcemapPath),
    relativeSourcePath
  );
  return newSourcePath;
};

```

重新 build 一下，然后进行 dist 复制。

> 注意：对于 webpack 的项目，这里还需要清除一下 babel loader 的缓存，删除 node_modules/.cache/babel-loader 即可。
> 

### 调试 vite 源码

- 创建 .vscode/launch.json 的配置文件，添加一个 npm 类型的调试配置
- runtimeArgs配置为dev
- 在vite.config.js 打个断点，往下执行一步，就进入到 vite 源码了，这就是读取配置的相关代码。但是现在的代码是被编译过的，可读性很差。所以我们要通过 sourcemap 来把它映射到源码再调试。
- 从 github 把 vite 下载下来
- 安装依赖，然后执行 npm run build --watch
- 把这个 dist 目录复制到测试项目的 node_modules/vite 下，覆盖原来的 dist
- 你会发现调试还是编译后的源码。因为默认 VSCode Node Debugger 会忽略 node_modules 下的 sourcemap
- resolveSourceMapLocations 是配置去那里找 sourcemap 的，默认把 node_modules 排除了。去掉那行配置即可。
- 再次调试，你就会发现调试的是 vite 的 ts 源码了！

### 调试 ElementUI 源码

一、首先定位 ElementUI 源码

**1、可以通过事件断点的方式，慢慢进入组件的源码。**

- 但是组件的代码是被编译打包过的，不是最初的源码。
- 为了调试最初的源码，需要下载了 Element UI 的代码，build 出了一份带有 sourcemap 的代码。覆盖项目 node_modules 下的代码，重新跑 dev server，这时候就可以直接调试组件源码了。

**2、当有了 sourcemap 之后，Chrome DevTools 会直接把 vue 文件列在 sources 里，我们可以找到对应的 vue 文件来打断点，就不用通过事件断点来找了。**

能够调试 Element UI 源码之后，想知道组件内部都有哪些逻辑的话，就可以直接在源码断点调试了。

### 断点是如何在网页里生效的

比如源代码的路径是 /Users/xxx/vite-demo/src/App.vue ，最后打包后运行可能是http://xxx.com/bundle.js。

由于文件是关联了 sourcemap 的，所以就直接映射到了/Users/xxx/vite-demo/src/App.vue 文件，而 App.vue 中打的断点就是通过 CDP 调试协议进行通信的。

![](images/Pasted%20image%2020250121153508.png)

### 打断点的 7 种方式

- 异常断点（Uncaught Exceptions）：在抛异常处断住
- 条件断点（conditional breakpoint）：在满足某个表达式的时候断住
- 日志点（logpoint）：打印日志但不断住，觉得断住太多次的时候可以用这个
- DOM 断点：在 DOM 子树修改、属性修改、节点删除的时候断住
    
![](images/Pasted%20image%2020250121153519.png)
    
- Event Listenter 断点：在某个事件发生的时候断住
- url 请求断点：在发送 url 包含某内容的请求时断住
    
![](images/Pasted%20image%2020250121153532.png)
    

---

- sourcemap 的原理和作用
    - webpack 的 sourcemap 配置
    - 调试 React、Vue 源码
- Node.js 的调试
    - VSCode Node Debugger 配置
    - 调试 Nest.js 源码
    - 命令行工具的两种调试
        - 调试下 ESLint、Babel、TypeScript 的源码
- Chrome DevTools
    - 6 种打断点的方式
    - Performance :分析和优化网页性能
    - LightHouse :检测页面性能
    - Memory：分析内存问题
- 调试移动端网页
    - 调试安卓和 ios 的网页
    - Charles 的使用
- 调试工具的原理
    - 自定义调试工具的实现原理
        - 实现一个简易版 React DevTools
    - Chrome DevTools 的原理
        - 实现 mini puppeteer
        - 分别实现 Chrome DevTools 的各个部分的功能

## 调试 Node.js

### 使用vscode launch方式

1、添加一个 node 类型的 launch program 的调试配置，指定 program 的路径

2、你也想首行断住，可以加一个 stopOnEntry 的配置：

3、可以通过 args 来添加命令行参数：

### 使用vscode attach方式

1、以调试模式启动node

```jsx
// --inspect 是以调试模式启动，--inspect-brk 是以调试模式启动并且在首行断住。
node --inspect-brk ./index.js
```

2、添加一个 node 类型的 attach 的调试配置，端口改成 ws 服务启动的端口 8888

3、然后点击 debug 启动

### 使用 Chrome DevTools 调试 node 代码

打开 [chrome://inspect/#devices](https://link.juejin.cn/?target=)，下面列出的是所有可以调试的目标，也就是 ws 服务端：

你会发现这里列出了我们启动的跑的那个 node 脚本。点击 inspect 就可以调试这个 node 脚本了。

### VSCode Node Debugger 配置

- **attach**
- restart：VSCode Debugger 以 attach 的方式启动，是需要连接 ws 调试服务的，而连接自然就可能超时、失败之类的，这时候就需要重连。重连的间隔和次数是可以配置的：
    
![](images/Pasted%20image%2020250121153607.png)
    
- launch
- args：添加命令行参数
    
![](images/Pasted%20image%2020250121153629.png)
    
![](images/Pasted%20image%2020250121153643.png)
    
- **runtimeExecutable：runtime 默认是 node，其实这个也是可以改的，VSCode Debugger 会从 PATH 的环境变量中查找对应名字的 runtime 启动。比如调试 npm scripts，就会改成npm**
    - runtimeArgs：类似args，给**runtime 传参数，比如 npm run start**
- skipFiles: 默认跳过的文件，这样就可以精简掉调用栈，只显示我们关心的部分。默认值是 `<node_internal>/**`
- **stopOnEntry：是否在首行断住**
- **console：默认 debug 模式下，打印的日志是在 console 的，而不是 terminal。而 console 里是不支持彩色的，这个可以通过 console 配置设置**
    - internalConsole 就是内置的 debug console 面板，默认是这个
    - internalTerminal 是内置的 terminal 面板，切换成这个就是彩色了
    - externalTerminal 会打开系统的 terminal 来展示日志信息
- autoAttachChildProcesses：
- cwd：当前工作目录，指定 runtime 在哪个目录运行，默认是项目根目录 workspaceFolder
- **env：设置环境变量**
- **presentation：配置的分组还有排序**

## 调试 npm scripts

这些命令行工具的 package.json 里都会有个 bin 字段，来声明有哪些命令，npm install 这个包以后，就会放到 node_modules/.bin 目录下。

这样我们就可以通过 node ./node_modules/.bin/xx 来跑不同的工具了。与使用 npm run xxx 一样。

1、在 .vscode/launch.json 的调试文件里，选择 node 的 launch program：用 node 执行 node_modules/.bin 下的文件，传入参数即可

![](images/Pasted%20image%2020250121153657.png)

2、VSCode Debugger 对 npm scripts 调试的场景做了封装，可以直接选择 npm 类型的调试配置，直接指定运行的命令即可

![](images/Pasted%20image%2020250121153708.png)

然后，我们就可以 node_modules/.bin 下这个文件里打个断点，或者想要查看默认webpack配置，可以在vue.config.js中打个断点进行调试。

默认调试模式下，输出的内容会在 Debug Console 面板显示：但这个也可以改：可以切换成 integratedTerminal，那就会输出在 terminal 了：

![](images/Pasted%20image%2020250121153723.png)

## 调试移动端网页

安卓调试：[https://juejin.cn/book/7070324244772716556/section/7071922622262411296](https://juejin.cn/book/7070324244772716556/section/7071922622262411296)

IOS调试：ios 网页调试只能用 safari 浏览器，也就是你必须使用MacOS系统。

## Charles工具使用

### 调试https请求

- 添加Clarles自己的证书，可以看到明文的 https 请求和响应内容
- 如果想修改一下请求和响应内容的，这时候就要用url断点功能

**移动端怎么调试？**

其实是一样的，只不过移动端也要把 Charles 证书安装到自己的系统中，需要点击安装 charles 证书到移动设备。

chrome 还有一个浏览器插件可以更细粒度的控制代理，叫做 SwitchyOmega。可以配置若干个代理服务器，比如 charles 的代理服务器。

要让你配置的规则生效，这里要选择 auto switch，也就是根据规则自动切换。

当你有多个代理服务器，或者想控制有的页面走代理有的不走的时候，就可以用这个插件来控制了。

### Charles全功能简介

- no caching： 禁用缓存
- block cookies：禁用 cookie
- map remote：转发请求到另一个 url
- map local：用本地的文件作为该请求的响应内容
- mirror：把响应保存在本地文件
- rewrite： 重写请求或响应的各种数据
- block list：禁止一些 url 的请求
- allow list：只允许一些 url 的请求
- SSL Proxying：代理 https 请求，用 charles 自己的证书，需要安装 charles 证书到系统并信任
- breakpoints：断点修改请求/响应

- DNS Spoofing：DNS 欺骗，类似 hosts，但是只影响 http 和 https
- Client Process：展示发请求的进程名
- Compose：compose new 创建一个新的请求，compose 修改已有的请求
- Repeat：重发请求，可以设置重发次数、并发数、重发间隔
- Throttle：模拟慢速请求，可以做具体的速率设置
- Focus：只展示关注的 hosts 的请求，其余的折叠
- Highlight Rules：根据规则来高亮请求，使用不同的颜色
- Web Interface：通过 web 界面来控制一些功能的开启关闭，这适用于远程控制
- Find：在 session、path 等范围内根据关键词搜索
- External Proxy：charles 可以把请求转发给别的代理服务器，比如科学上网的

### 如何优雅的调试线上报错？

1. 首先创建一个 vscode 调试配置，url对应线上地址
2. 需要配置 "userDataDir": "/users/daotin/mydatadir", 到某个路径
3. 勾选 uncaught exceptions，在未被捕获的异常处断住
4. 然后启动调试，就会发现在未被捕获的异常处断住，但是发现代码是被压缩过的。
5. 编译项目源码生成source-map（webpack 的 devtool 为 hidden-source-map，生成 sourcemap 但是不关联）
6. 安装chrome插件 SwitchyOmega
7. 配置proxy地址和端口（127.0.0.1:8888）
8. 配置auto switch，让线上地址走proxy代理，之后点击应用选项
9. 最后，代理方式设置成 auto switch
10. charles设置断点：点击 Proxy > Breakpoint Settings，添加一个对线上地址的 xxx.js 响应的断点，强制刷下页面，charles 就会断住
11. 然后可以修改响应的内容，加上了这样一行 sourcemap 的关联：`//# sourceMappingURL=http://www.guangtest.com:8084/dist/index.js.map`
12. 然后点击 execute 来执行修改，异常断点现在直接在源码处断住了。接下来就可以直接调试源码了，可以通过作用域、调用栈等信息来定位报错原因

参考：[https://juejin.cn/book/7070324244772716556/section/7156796826728071200](https://juejin.cn/book/7070324244772716556/section/7156796826728071200)

注意：charles 断点修改的内容会缓存（比如添加的map文件），强制刷新（ctrl+shift+R）才会重新请求。