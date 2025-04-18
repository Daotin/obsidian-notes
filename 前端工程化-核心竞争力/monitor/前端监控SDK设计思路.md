> + [一文摸清前端监控实践要点](https://juejin.cn/column/7097156230489047047)
> + [从0到1搭建前端监控平台，面试必备的亮点项目](https://github.com/xy-sea/blog/blob/main/markdown/%E4%BB%8E0%E5%88%B01%E6%90%AD%E5%BB%BA%E5%89%8D%E7%AB%AF%E7%9B%91%E6%8E%A7%E5%B9%B3%E5%8F%B0%EF%BC%8C%E9%9D%A2%E8%AF%95%E5%BF%85%E5%A4%87%E7%9A%84%E4%BA%AE%E7%82%B9%E9%A1%B9%E7%9B%AE.md)
>     - [https://github.com/xy-sea/web-see-demo](https://github.com/xy-sea/web-see-demo)
> + [https://github.com/miracle90/monitor](https://github.com/miracle90/monitor)
>

## 为什么要做前端监控平台？
痛点：

很多时候，无法复现的 bug，是最花时间定位的，但是因为不知道用户的操作路径，有的时候很难复现。

这个时候，就需要前端监控了，记录项目的错误，并将错误还原出来，这是监控平台要解决的痛点之一



除此之外，监控平台还可以：

+ 错误预警：有些没有发现的错误，可以及早暴露及早解决，而不让用户发现
+ 错误分析：通过分析错误，解决一类的问题，避免相同的错误再次发生
+ 性能分析：采集页面关键数据，为页面优化提供方向
+ 提供决策：通过采集的 pv，uv，性能等数据，为后续需求方向等提供决策支撑



## 方案选择
> 为什么不直接用 sentry 私有化部署，而选择自研前端监控？
>

相比 sentry，自研监控平台的优势在于：

1. 可以将公司的 SDK 统一成一个，包括但不限于：监控 SDK、埋点 SDK、录屏 SDK、广告 SDK 等
2. 监控自定义的个性化指标：如 long task、memory 页面内存、首屏加载时间等。过多的长任务会造成页面丢帧、卡顿；过大的内存可能会造成低端机器的卡死、崩溃
3. 提供了 **采样对比+ 轮询修正机制** 的白屏检测方案，用于检测页面是否一直处于白屏状态，让开发者知道页面什么时候白了，具体实现见：[前端白屏的检测方案，解决你的线上之忧](https://juejin.cn/post/7176206226903007292)



**自研核心思路：**

+ 通过采集错误信息+上传sourcemap，定位错误具体位置
+ 通过“rrweb 录屏”错误的操作过程，进一步明确错误的产生路径
+ 因为录制时长有限，所以结合“采集用户行为”来分析用户的操作，帮助复现 bug

核心：通过 `定位源码`、`播放录屏`、`记录用户行为` 三板斧，解决了复现 bug 的痛点。



### 包括哪些部分？
自研 SDK 包括：
![](images/Pasted%20image%2020250418104151.png)


## 数据采集
### 错误数据采集
主要包括：

+ js 错误采集（比如语法错误，运行时错误，逻辑错误）
+ 静态资源加载错误
+ Vue react 框架错误
+ 接口错误
+ 框架错误



错误分类：
![](images/Pasted%20image%2020250418104157.png)




1、js错误：

> try/catch: 只能捕获代码常规的运行错误，语法错误和异步错误不能捕获到
>

解决方法：使用`window.onerror `可以捕获常规错误、异步错误。

> window.onerror 缺点：但是不能捕获 语法错误，不能捕获 图片，script，css 等资源加载的错误
>

解决办法：`window.addEventListener('error')` 可以捕获语法错误和资源加载错误。

> 缺点：不能捕获Promise，async await等异步方法内部的报错，不能捕获new Image错误（比较少用）
>

解决办法：使用 `window.addEventListener('unhandledrejection')`





2、资源错误

window.addEventListener('error')



3、Vue react 框架错误

> 问题：Vue 项目中，window.onerror 和 error 事件不能捕获到常规的代码错误。
>

+ 对于 vue：
    - 通过  `Vue.config.errorHander` 来捕获常规代码错误
    - 其他的错误同上处理
+ 对于 React：
    - 从 react16 开始，官方提供了 ErrorBoundary 错误边界的功能，被该组件包裹的子组件，render 函数报错时会触发离当前组件最近父组件的 ErrorBoundary
    - 生产环境，一旦被 ErrorBoundary 捕获的错误，也不会触发全局的 window.onerror 和 error 事件，然后手动调用 `monitor.reportError`进行上报



4、 跨域错误

> 问题：error 事件只会监测到一个  script error 的异常，无法获取脚本里面详细的错误信息
>

示例：

```javascript
window.addEventListener(
  'error',
  (error) => {
    console.log('捕获到异常：', error);
  },
  true
);

// 当前页面加载其他域的资源，如https://www.test.com/index.js
<script src="https://www.test.com/index.js"></script>;

// 加载的https://www.test.com/index.js的代码
function fn() {
  JSON.parse('');
}
fn();
```

报错：
![](images/Pasted%20image%2020250418104206.png)


解决：

+ 前端 script 加 `crossorigin`，后端配置 `Access-Control-Allow-Origin` 请求头

```javascript
<script src="https://www.test.com/index.js" crossorigin></script>
```

+ 如果不能修改服务端的请求头，可以考虑通过使用 try/catch 包裹调用方法，将错误抛出后，再通过以上方法捕获

```javascript
<!doctype html>
<html>
<body>
  <script src="https://www.test.com/index.js"></script>
  <script>
  window.addEventListener("error", error => {
    console.log("捕获到异常：", error);
  }, true );

  try {
    // 调用https://www.test.com/index.js中定义的fn方法
    fn();
  } catch (e) {
    throw e;
  }
  </script>
</body>
</html>
```



5、 HTTP 错误

重写 `XMLHttpRequest.prototype.send` 和 `XMLHttpRequest.prototype.open` ：

+ 利用 AOP 切片编程重写 xhr 的 open，send 方法：获取接口信息，包括请求状态（status 和responseText，错误的状态和信息），开始时间，请求时长
+ 利用 AOP 切片编程重写 window.fetch

```javascript
/**
 * 重写指定的方法
 * @param { object } source 重写的对象
 * @param { string } name 重写的属性
 * @param { function } fn 拦截的函数
 */
function replaceAop(source, name, fn) {
  if (source === undefined) return;
  if (name in source) {
    var original = source[name];
    var wrapped = fn(original);
    if (typeof wrapped === 'function') {
      source[name] = wrapped;
    }
  }
}
```



### 性能数据采集
主要包括：

+ Web Vitals 性能指标
+ 资源加载性能指标
+ 页面加载性能指标
+ 首屏加载性能指标
+ long task指标（可选）
+ 白屏检测（可选）



1、Web Vitals 指标：FP、FCP、LCP 等

谈到性能数据采集，就会提及加载过程模型图：
![](images/Pasted%20image%2020250418104215.png)


以 Vue 等 SPA 页面来说，页面的加载过程大致是这样的：
![](images/Pasted%20image%2020250418104220.png)


这个阶段主要包括：

+ 初始准备阶段：dns 解析，tcp 链接等等，
+ 请求发送接收阶段，包括请求开始发送，收到响应
+ 页面渲染阶段：包括 DomContentLoad，以及FP FCP LCP 等指标



Web Vitals性能指标：

| 指标 | 作用 | 标准 |
| --- | --- | --- |
| FCP(First Contentful Paint) | 首次内容绘制时间 | 标准 ≤1s |
| LCP(Largest Contentful Paint) | 最大内容绘制时间 | 标准 ≤2 秒 |
| FID(first input delay) | 首次输入延迟，标准是用户触发后，到浏览器响应时间 | 标准 ≤100ms |
| CLS(Cumulative Layout Shift) | 累积布局偏移 | 标准 ≤0.1 |
| TTFB(Time to First Byte) | 页面发出请求，到接收第一个字节所花费的毫秒数(首字节时间) | 标准<= 100 毫秒 |




如何采集？

1. web-vitals 库（基于 Performance API 构建）专门用于 监测 Core Web Vitals（LCP、FID、CLS 等），简化性能监测和数据上报。

> web-vitals 缺点：有一定的兼容性问题。不支持 safari 浏览器，且捕获这些指标的一些 API 目前仅在基于 Chromium 的浏览器中可用，比如CLS，INP，LCP等
>

2. Performance API 提供浏览器内置的 性能测量 API，适用于更细粒度的前端优化。

可以通过  `window.performance.timing`  来获取加载过程模型中各个阶段的耗时数据：

```javascript
// window.performance.timing 各字段说明
{
  navigationStart, // 同一个浏览器上下文中，上一个文档结束时的时间戳。如果没有上一个文档，这个值会和 fetchStart 相同。
    unloadEventStart, // 上一个文档 unload 事件触发时的时间戳。如果没有上一个文档，为 0。
    unloadEventEnd, // 上一个文档 unload 事件结束时的时间戳。如果没有上一个文档，为 0。
    redirectStart, // 表示第一个 http 重定向开始时的时间戳。如果没有重定向或者有一个非同源的重定向，为 0。
    redirectEnd, // 表示最后一个 http 重定向结束时的时间戳。如果没有重定向或者有一个非同源的重定向，为 0。
    fetchStart, // 表示浏览器准备好使用 http 请求来获取文档的时间戳。这个时间点会在检查任何缓存之前。
    domainLookupStart, // 域名查询开始的时间戳。如果使用了持久连接或者本地有缓存，这个值会和 fetchStart 相同。
    domainLookupEnd, // 域名查询结束的时间戳。如果使用了持久连接或者本地有缓存，这个值会和 fetchStart 相同。
    connectStart, // http 请求向服务器发送连接请求时的时间戳。如果使用了持久连接，这个值会和 fetchStart 相同。
    connectEnd, // 浏览器和服务器之前建立连接的时间戳，所有握手和认证过程全部结束。如果使用了持久连接，这个值会和 fetchStart 相同。
    secureConnectionStart, // 浏览器与服务器开始安全链接的握手时的时间戳。如果当前网页不要求安全连接，返回 0。
    requestStart, // 浏览器向服务器发起 http 请求(或者读取本地缓存)时的时间戳，即获取 html 文档。
    responseStart, // 浏览器从服务器接收到第一个字节时的时间戳。
    responseEnd, // 浏览器从服务器接受到最后一个字节时的时间戳。
    domLoading, // dom 结构开始解析的时间戳，document.readyState 的值为 loading。
    domInteractive, // dom 结构解析结束，开始加载内嵌资源的时间戳，document.readyState 的状态为 interactive。
    domContentLoadedEventStart, // DOMContentLoaded 事件触发时的时间戳，所有需要执行的脚本执行完毕。
    domContentLoadedEventEnd, // DOMContentLoaded 事件结束时的时间戳
    domComplete, // dom 文档完成解析的时间戳， document.readyState 的值为 complete。
    loadEventStart, // load 事件触发的时间。
    loadEventEnd; // load 时间结束时的时间。
}
```

不过，performance API 以及过时了，有一个新的api来检测性能：[PerformanceObserver](https://developer.mozilla.org/zh-CN/docs/Web/API/PerformanceObserver/PerformanceObserver)

> performance API和 PerformanceObserver API的区别：
>
> 可以这样理解：Performance API 就像是仪表盘上的各种仪表（速度表、油量表等)，它们实时显示数据。你可以随时低头去看（主动查询 getEntries)。而PerformanceObserver API 就像是给这些仪表设置了警报或通知系统，当某个指标（如油量低、速度超限）达到某个状态或发生变化时，系统会主动通知你（回调函数被调用），你就不需要一直盯着仪表盘看了。
>
> 在现代 Web 性能监控中，强烈推荐使用PerformanceObserver API来收集大多数性能数据，因为它更高效、更可靠。当然，对于简单的、一次性的测量（比如
>
> performance.now() 获取时间戳，或手动执行 mark/measure 并立即获取结果），直接使用 Performance API的方法仍然非常方便。
>



3. （推荐）我们使用[PerformanceObserver](https://developer.mozilla.org/zh-CN/docs/Web/API/PerformanceObserver/PerformanceObserver)来收集数据。

检测原理和流程：（以FP为例）

```javascript
export default function observerFP() {
    const entryHandler = (list) => {
        for (const entry of list.getEntries()) {
            if (entry.name === 'first-paint') {
                // 停止观察
                observer.disconnect();
              
                const reportData = {
                  type: 'performance',
                  subType: 'first-paint',
                  name: entry.name,
                  startTime: entry.startTime, // FP时间点：从页面加载开始到首次绘制发生的时间，单位是毫秒
                  duration: entry.duration,
                  entryType: entry.entryType,
                }
                // 发送数据 todo;
                // sendData(reportData)
            }
        }
    
    }
    // 统计和计算fp的时间
    const observer = new PerformanceObserver(entryHandler);
    // buffered: true 确保观察到所有paint事件
    observer.observe({type: 'paint', buffered: true});
}

```

收集 FP（First Paint）指标的原理和流程可以这样简单理解：

1. **<font style="background-color:rgba(255, 255, 255, 0);">雇佣一个观察员（</font>****<font style="background-color:rgba(255, 255, 255, 0);">new PerformanceObserver</font>****<font style="background-color:rgba(255, 255, 255, 0);">）</font>**<font style="background-color:rgba(255, 255, 255, 0);">：告诉浏览器：“我想知道页面什么时候开始‘画’东西”。</font>
2. **<font style="background-color:rgba(255, 255, 255, 0);">下达观察任务（</font>****<font style="background-color:rgba(255, 255, 255, 0);">observer.observe</font>****<font style="background-color:rgba(255, 255, 255, 0);">）</font>**<font style="background-color:rgba(255, 255, 255, 0);">：</font>
    - <font style="background-color:rgba(255, 255, 255, 0);">明确指示观察员：“请关注所有类型为 ‘paint’ 的性能事件”。</font>
    - <font style="background-color:rgba(255, 255, 255, 0);">特别嘱咐（</font><font style="background-color:rgba(255, 255, 255, 0);">buffered: true</font><font style="background-color:rgba(255, 255, 255, 0);">）：“如果在我开始观察之前，页面就已经‘画’了第一笔（FP发生了），也请务必告诉我”。</font>
3. **<font style="background-color:rgba(255, 255, 255, 0);">等待并接收报告（</font>****<font style="background-color:rgba(255, 255, 255, 0);">handleEntries</font>****<font style="background-color:rgba(255, 255, 255, 0);">回调）</font>**<font style="background-color:rgba(255, 255, 255, 0);">：</font>
    - <font style="background-color:rgba(255, 255, 255, 0);">当浏览器真的进行了第一次绘制时，它会生成一个名为</font><font style="background-color:rgba(255, 255, 255, 0);"> </font><font style="background-color:rgba(255, 255, 255, 0);">first-paint</font><font style="background-color:rgba(255, 255, 255, 0);"> </font><font style="background-color:rgba(255, 255, 255, 0);">的性能记录。</font>
    - <font style="background-color:rgba(255, 255, 255, 0);">观察员收到这个记录（以及可能的其他 paint 记录）后，立刻向你的代码汇报。</font>
4. **<font style="background-color:rgba(255, 255, 255, 0);">筛选并记录（</font>****<font style="background-color:rgba(255, 255, 255, 0);">if (entry.name === 'first-paint')</font>****<font style="background-color:rgba(255, 255, 255, 0);">）</font>**<font style="background-color:rgba(255, 255, 255, 0);">：</font>
    - <font style="background-color:rgba(255, 255, 255, 0);">代码检查收到的报告，找到名字确认为</font><font style="background-color:rgba(255, 255, 255, 0);"> </font><font style="background-color:rgba(255, 255, 255, 0);">first-paint</font><font style="background-color:rgba(255, 255, 255, 0);"> </font><font style="background-color:rgba(255, 255, 255, 0);">的那条记录。</font>
    - <font style="background-color:rgba(255, 255, 255, 0);">提取关键信息：</font><font style="background-color:rgba(255, 255, 255, 0);">entry.startTime</font><font style="background-color:rgba(255, 255, 255, 0);">，这个值就是 FP 指标（从页面加载开始到首次绘制发生的时间）。</font>
5. **<font style="background-color:rgba(255, 255, 255, 0);">汇报成果并解散（</font>****<font style="background-color:rgba(255, 255, 255, 0);">monitor.send</font>****<font style="background-color:rgba(255, 255, 255, 0);"> </font>****<font style="background-color:rgba(255, 255, 255, 0);">和</font>****<font style="background-color:rgba(255, 255, 255, 0);"> </font>****<font style="background-color:rgba(255, 255, 255, 0);">observer.disconnect</font>****<font style="background-color:rgba(255, 255, 255, 0);">）</font>**<font style="background-color:rgba(255, 255, 255, 0);">：</font>
    - <font style="background-color:rgba(255, 255, 255, 0);">将获取到的 FP 时间发送给监控系统。</font>
    - <font style="background-color:rgba(255, 255, 255, 0);">告诉观察员：“任务完成，你可以下班了”（停止观察），因为 FP 只会发生一次。</font>

**<font style="background-color:rgba(255, 255, 255, 0);">总结来说：</font>**<font style="background-color:rgba(255, 255, 255, 0);"> 就是利用浏览器提供的 </font><font style="background-color:rgba(255, 255, 255, 0);">PerformanceObserver</font><font style="background-color:rgba(255, 255, 255, 0);"> 工具，专门监听 </font><font style="background-color:rgba(255, 255, 255, 0);">paint</font><font style="background-color:rgba(255, 255, 255, 0);"> 事件，并且确保能捕获到（可能已经发生的）第一个 </font><font style="background-color:rgba(255, 255, 255, 0);">paint</font><font style="background-color:rgba(255, 255, 255, 0);"> 事件（即 </font><font style="background-color:rgba(255, 255, 255, 0);">first-paint</font><font style="background-color:rgba(255, 255, 255, 0);">），然后提取其发生的时间点作为 FP 指标，最后停止监听以节省资源。</font>





2、资源加载性能指标：资源加载时间、大小等

主要关注资源的性能数据，如加载时间、DNS解析时间，资源缓存率等。

原理：

也是使用PerformanceObserver，通过 `observer.observe({ type: ['resource'], buffered: true })` 收集当entry.entryType == 'resource' 资源的加载列表。了解每个资源的加载情况。



3、页面加载性能指标

```javascript
 window.addEventListener('pageshow', this.handlePageShow);
```

原理：

1. **监听时机：** 它并不在页面刚开始加载时就计算，而是等待页面**完全显示出来**时（监听 `pageshow` 事件）。这样做的好处是，即使页面是从浏览器缓存（比如后退按钮）加载的，也能触发并收集数据。
2. **获取数据源：** 当 `pageshow` 事件触发后，它会向浏览器请求详细的加载时间记录。
    - 优先尝试使用**新的 **`PerformanceNavigationTiming`** API**，这个 API 更现代、信息更全。
    - 如果浏览器不支持新的，就**回退使用旧的 **`performance.timing`** API**。
3. **计算指标：** 利用获取到的时间记录（比如请求开始时间、响应结束时间、DOM 完成时间、页面加载完成时间等），通过简单的**减法运算**，计算出各种关键性能指标，例如：
    - 页面总加载时间 (`loadTime`)
    - DOM 解析完成时间 (`domContentLoadedTime`)
    - 首字节时间 (`ttfb`)
    - DNS 查询耗时 (`dnsTime`)
    - TCP 连接耗时 (`tcpTime`) 等。
4. **发送数据：** 将计算得到的各项指标打包，发送给监控系统 (`monitor.send`)。同时，会标记这个页面是否是从缓存加载的 (`fromCache`)。
5. **优化细节：** 使用 `requestAnimationFrame` 来延迟一小下再执行数据收集和计算，确保这个过程不会影响到页面本身的渲染流畅度。

**简单说：** 等页面显示好后，问浏览器要加载过程的详细时间点记录，然后自己算一算，得出各种加载耗时指标，最后把结果报上去。优先用新方法问，不行再用老方法。



3、long task

执行时间超过 50ms 的任务，被称为 long task 长任务。

```javascript
// 获取页面的长任务列表：
const entryHandler = (list) => {
  const entries = list.getEntries();
  for (const entry of entries) {
    // 获取长任务详情
    if (entry.entryType === 'longtask') {
        console.log(entry)
    }
  }
};

let observer = new PerformanceObserver(entryHandler);
observer.observe({ entryTypes: ['longtask'] });
```

原理：使用  PerformanceObserver API 监听 longtask 类型的性能条目。



4、首屏加载时间

首屏加载时间和首页加载时间不一样，首屏指的是屏幕内的 dom 渲染完成的时间。比如首页很长需要好几屏展示，这种情况下屏幕以外的元素不考虑在内。

实现原理：

**简单说**： 它通过不断观察屏幕上可见元素的变化，记录下最后一次变化的时间。当它觉得屏幕在一段时间内不再变化，或者等待太久了，就把这个最后变化的时间点当作“首屏时间”报上去。这是一种估算方法，因为没有标准的“首屏完成”事件。



计算流程：

1）利用MutationObserver监听document对象，每当 dom 变化时触发该事件。同时也会启动一个定时器，定时检测dom是否稳定

2）判断监听的 dom 是否在首屏内，如果在首屏内且可见，如果是，就**记下当前的时间点**，认为这是“目前为止”首屏内容渲染到的最新时间 (`firstScreenTime`)。

4）如果dom已经稳定一段时间，则认为首屏加载结束，上报最终的首屏时间

> 如何判断dom是否稳定？
>

可以设置一个稳定时间（比如1s），如果现在的时间 - 最新的“首屏时间” > 1s，这意味着首屏已经稳定。





5、白屏检测

检测白屏的原理和过程是：

1. **时机选择**：等待页面完全加载 (`load` 事件) 并额外延迟一小段时间（如 2 秒）后开始。这是为了避免在正常渲染过程中误判。
2. **抽样检查**：不在整个屏幕上找，而是在屏幕可视区域内**选取几个预设的点**（比如屏幕中心、四个角等，打点方案通常有5个，9个，13个点）。
3. **判断空点**：对每个选取的点，使用 `document.elementFromPoint(x, y)` 检查这个坐标位置上**最上层的元素是什么**。如果这个点上**没有任何元素**，或者只有最基础的 `<body>` 或 `<html>` 标签（意味着没有实际内容渲染在上面），就认为这个点是**“空的”**。
4. **计算比例**：统计所有采样点中，“空的”点占总采样点的**比例**。
5. **阈值判断**：如果“空点”的比例**非常高**（比如超过 95% `whiteScreenThreshold`），就判定当前页面处于白屏状态。
6. **重复确认**：这个检查会**定时重复进行几次**（比如每秒查一次，最多查 5 次 `maxCheckCount`）。
7. **上报结果**：如果在检查次数内**确认是白屏**，就向监控系统**上报白屏事件**；如果检查了几次都不是白屏，或者达到了最大检查次数仍未确认白屏，就不上报或上报正常状态（代码中是只在上报白屏时才发送）。

**简单说：** 等页面加载完一会儿后，在屏幕上戳几个点，看看这些点是不是都没内容。如果大部分点都没内容，并且这种情况持续了一小段时间，就判断是白屏了。



### 用户行为采集
1、 页面跳转

+ history 模式可以监听popstate事件
+ hash 模式可以监听hashchange 事件（vue项目除外）

> vue 项目中不能通过 hashchange 事件来监听路由变化，vue-router 底层调用的是 history.pushState 和 history.replaceState，不会触发 hashchange，所以需要重写 pushState、replaceState 事件来监听路由变化
>

```javascript
// 监听 hash 变化
window.addEventListener('hashchange', this.handleHashChange)

// 监听 popstate 事件
window.addEventListener('popstate', this.handlePopState)

// 重写 pushState 和 replaceState
this.patchHistoryAPI()
```

2、 页面点击事件

+ PC：监听mousedown/click事件
+ 移动端：监听touchstart事件

```javascript
// 监听点击事件
document.addEventListener('click', this.handleClick, true)

// 监听触摸事件（移动端）
document.addEventListener('touchstart', this.handleClick, true)
```

3、pv：页面加载完成后执行收集

```javascript
// 页面加载完成后记录PV
if (document.readyState === 'complete') {
  this.recordPV()
} else {
  window.addEventListener('load', this.recordPV)
}
```

4、uv： 进入系统后， localStorage 存储一个唯一 `user_unique_id` ，只有当用户是首次访问（没有存储的标识符，或者标识过期）时，才记录UV

## 数据上报
### 上报方式
+ 优先 sendBeacon（可靠，即便是页面关闭前，也能保证上报）
+ 图片打点上上报（image/gif支持跨域，使用 gif ，大小最小）
+ 常规请求 xhr/fetch



### 上报内容
不同类型，上报的内容也不同：

所有上报数据都包含以下基础字段：

+ `type`: 数据类型，如 'error'、'performance'、'behavior' 等
+ `subType`: 数据子类型，具体取决于插件
+ `startTime`: 事件发生的时间戳

对于js错误，要包含错误行列号；  
对于HTTP错误，有错误状态；  
对于资源错误，有错误原始的html；  
对于pageChange，有from，to等；  
对于录屏数据，有events录制的事件数组；  
对于行为栈，有stack用户行为记录数组等  
...



### 上报策略
维护一个数据队列 queue，当 queue > maxQueueSize 的时候，进行批量上报。



### 上报时机
+ requestidleCallback（优先浏览器空闲的时候）
+ Promise 微任务
+ setTimeout 宏任务
+ beforeUnload
+ 缓存批量上报



## sdk打包
使用rollup打包



