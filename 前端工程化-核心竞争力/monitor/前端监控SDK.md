

### 1： 你能得到的收益：
参与公司前端监控平台/监控SDK的架构设计和开发，为公司的业务赋能
独立设计和开发监控SDK，对前端页面的性能指标，错误信息 行为信息进行收集，采用合理的方式进行上报
课程内容：
![image.png](https://cdn.nlark.com/yuque/0/2024/png/207857/1712632783251-9f2ea700-5183-411a-9600-0701b53ab168.png#averageHue=%23f8f4ed&clientId=u4d11667d-9f2f-4&from=paste&height=351&id=u0992f4f8&originHeight=632&originWidth=1428&originalType=binary&ratio=1.7999999523162842&rotation=0&showTitle=false&size=240909&status=done&style=none&taskId=u36cb90e4-d334-490f-9cc0-a23996eec61&title=&width=793.3333543494902)
涉及到的知识点
- Rollup打包的配置（要开发一个SDK，其他项目需要引用）
- JavaScript基础知识
- 网络&浏览器相关知识 
- 框架的错误收集（React Vue）


### 2：为什么要自研做监控？作用是什么？为什么不用第三方的监控平台，业界有那些成熟的监控平台
[https://github.com/xy-sea/blog/blob/main/markdown/%E4%BB%8E0%E5%88%B01%E6%90%AD%E5%BB%BA%E5%89%8D%E7%AB%AF%E7%9B%91%E6%8E%A7%E5%B9%B3%E5%8F%B0%EF%BC%8C%E9%9D%A2%E8%AF%95%E5%BF%85%E5%A4%87%E7%9A%84%E4%BA%AE%E7%82%B9%E9%A1%B9%E7%9B%AE.md](https://github.com/xy-sea/blog/blob/main/markdown/%E4%BB%8E0%E5%88%B01%E6%90%AD%E5%BB%BA%E5%89%8D%E7%AB%AF%E7%9B%91%E6%8E%A7%E5%B9%B3%E5%8F%B0%EF%BC%8C%E9%9D%A2%E8%AF%95%E5%BF%85%E5%A4%87%E7%9A%84%E4%BA%AE%E7%82%B9%E9%A1%B9%E7%9B%AE.md)

### 3：项目搭建
#### 设计思路
一个完整的前端监控平台包括4个部分：
1. 数据采集与上报
2. 数据分析和存储
3. 数据展示
4. 数据报警和监控

![](https://cdn.nlark.com/yuque/0/2024/jpeg/207857/1712709657051-2c526183-98c2-4fb9-b75b-2386d38c40bb.jpeg)
#### 目录结构



### 4：性能监控的收集
1：页面性能检测工具：**Lighthouse**
**2：**[**web-vitals**](https://www.npmjs.com/package/web-vitals)**：**[**https://www.npmjs.com/package/web-vitals**](https://www.npmjs.com/package/web-vitals)
**官方指标标准**

| 指标 | 作用 | 标准 |
| --- | --- | --- |
| FCP(First Contentful Paint) | 首次内容绘制时间 | 标准 ≤1s |
| LCP(Largest Contentful Paint) | 最大内容绘制时间 | 标准 ≤2 秒 |
| FID(first input delay) | 首次输入延迟，标准是用户触发后，到浏览器响应时间 | 标准 ≤100ms |
| CLS(Cumulative Layout Shift) | 累积布局偏移 | 标准 ≤0.1 |
| TTFB(Time to First Byte) | 页面发出请求，到接收第一个字节所花费的毫秒数(首字节时间) | 标准<= 100 毫秒 |



性能分析的，performance这个api的使用，和浏览器performance的定位 
![performance.png](https://cdn.nlark.com/yuque/0/2024/png/207857/1712741839446-093c618e-551e-4c7f-8a80-01f01b89b7e8.png#averageHue=%23e4cda1&clientId=uae6e0042-804e-4&from=paste&height=397&id=u2af145c3&originHeight=511&originWidth=1000&originalType=binary&ratio=1.7999999523162842&rotation=0&showTitle=false&size=270791&status=done&style=none&taskId=uf7f99936-a4a4-433b-b815-5b9dd597bbf&title=&width=777.8837280273438)
![image.png](https://cdn.nlark.com/yuque/0/2024/png/207857/1712649043633-004f09ec-9dd6-45da-bd61-9204c4acfb21.png#averageHue=%23e8ddac&clientId=u4d11667d-9f2f-4&from=paste&height=434&id=DM575&originHeight=720&originWidth=1263&originalType=binary&ratio=1.7999999523162842&rotation=0&showTitle=false&size=715139&status=done&style=none&taskId=u75b0f5a9-e21e-4079-9589-d3ef1694c38&title=&width=760.6666870117188)
![image.png](https://cdn.nlark.com/yuque/0/2024/png/207857/1712648883049-49697c9f-aa9d-45c2-9eb2-403f33c055de.png#averageHue=%23d2e1ac&clientId=u4d11667d-9f2f-4&from=paste&height=393&id=u61110cf2&originHeight=708&originWidth=1915&originalType=binary&ratio=1.7999999523162842&rotation=0&showTitle=false&size=314604&status=done&style=none&taskId=u664c1e5d-3d1f-412a-8eb7-22dc1f418c9&title=&width=1063.8889170723205)
![image.png](https://cdn.nlark.com/yuque/0/2024/png/207857/1712731522651-36a69d75-d4b5-4387-8ac5-871b39b633f7.png#averageHue=%23fbfbfb&clientId=uae6e0042-804e-4&from=paste&height=326&id=u8f79f459&originHeight=586&originWidth=1092&originalType=binary&ratio=1.7999999523162842&rotation=0&showTitle=false&size=123001&status=done&style=none&taskId=u94847093-58b5-49d3-a3f3-21dfd056af0&title=&width=606.6666827378453)
监测网页加载时长时关注的是以下5个过程 ：

1. 重定向时间 ：获取此网页前重定向所花费的时间
2. DNS域名查找时间：查找此网页的 DNS 所花费的时间
3. TCP服务器链接时间：用户连接到您的服务器所需的时间
4. 服务器响应时间：您的服务器响应用户请求所需的时间，其中包括从用户所在位置连接到您的服务器所需的网络时间
5. 网页下载时间：下载网页所需的时间
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

FP、FCP、LCP、CLS、TTFB、FID
**官方指标标准**

| 指标 | 作用 | 标准 |
| --- | --- | --- |
| FCP(First Contentful Paint) | 首次内容绘制时间 | 标准 ≤1s |
| LCP(Largest Contentful Paint) | 最大内容绘制时间 | 标准 ≤2 秒 |
| FID(first input delay) | 首次输入延迟，标准是用户触发后，到浏览器响应时间 | 标准 ≤100ms |
| CLS(Cumulative Layout Shift) | 累积布局偏移 | 标准 ≤0.1 |
| TTFB(Time to First Byte) | 页面发出请求，到接收第一个字节所花费的毫秒数(首字节时间) | 标准<= 100 毫秒 |

 
### 5：错误监控的收集

- JS 代码运行错误、语法错误等
- 异步错误等
- 静态资源加载错误
- 接口请求报错

错误分类：
![](images/Pasted%20image%2020250330120512.png)

除了try catch中捕获住的错误，我们还需要上报没有被捕获住的错误--通过error事件和unhandledrejection事件去监听。

- try..catch不能捕获**异步代码**的错误！所以，可以采用window.onerror方法
- unhandledrejection一般用来捕获异步方法内部的报错，比如Promise，async await等

![](images/Pasted%20image%2020250330120812.png)
![](images/Pasted%20image%2020250330120914.png)

✅所以，做好的方式是使用 `window.addEventListener('unhandledrejection')` 然后抛出错误，然后用 `window.addEventListener('error')` 统一捕获！

#### 什么时候上报？

![](images/Pasted%20image%2020250330172557.png)



### 6：用户行为收集
```javascript
// 创建用户行为类
class Behavior {
  // maxBreadcrumbs控制上报用户行为的最大条数
  maxBehaviors = 20;
  // stack 存储用户行为
  stack = [];
  constructor() {}
  // 添加用户行为栈
  push(data) {
    if (this.stack.length >= this.maxBehaviors) {
      // 超出则删除第一条
      this.stack.shift();
    }
    this.stack.push(data);
    // 按照时间排序
    this.stack.sort((a, b) => a.time - b.time);
  }
}

let behavior = new Behavior();

// 添加一条页面跳转的行为，从home页面跳转到about页面
behavior.push({
  type: "Route",
  form: '/home',
  to: '/about'
  url: "http://localhost:9000/index.html",
  time: "1668759320435"
});

// 添加一条用户点击行为
behavior.push({
  type: "Click",
  dom: "<button id='btn'>按钮</button>",
  time: "1668759620485"
});

// 添加一条调用接口行为
behavior.push({
  type: "Xhr",
  url: "http://xxx.baidu.com/monitor/open/pushData",
  time: "1668760485550"
});

// 上报用户行为
reportData({
  uuid: "a6481683-6d2e-4bd8-bba1-64819d8cce8c",
  stack: behavior.getStack()
});
```
### 7：数据上报

### 8：测试

#### sdk打包
webpack
rollup
```javascript
@babel/preset-env
@rollup/plugin-babel
@rollup/plugin-json
rollup
```


##### 跨域问题
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
报错信息
![image.png](https://cdn.nlark.com/yuque/0/2024/png/207857/1714532994055-a7d0a580-c9d4-479b-8fce-d21f3784e1bb.png#averageHue=%2325272d&clientId=u9f8fb788-b3c5-4&from=paste&height=262&id=u41473b24&originHeight=471&originWidth=730&originalType=binary&ratio=1.7999999523162842&rotation=0&showTitle=false&size=274615&status=done&style=none&taskId=ue7ca2ce4-ba07-4dcc-b075-834bf488cb7&title=&width=405.5555662991091)
解决方法：
前端 script 加 crossorigin，后端配置 Access-Control-Allow-Origin
```javascript
<script src="https://www.test.com/index.js" crossorigin></script>

```

如果不能修改服务端的请求头，可以考虑通过使用 try/catch 绕过，将错误抛出
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



















### 其他
![](https://cdn.nlark.com/yuque/0/2024/jpeg/207857/1712624040312-934baf47-f001-40e0-bd5e-cca62097f7bd.jpeg)
![image.png](https://cdn.nlark.com/yuque/0/2024/png/207857/1712624245424-49dc16fc-0231-4d37-8576-d3aa3adb8a28.png#averageHue=%23f9f7f3&clientId=uf455ef3d-6fc4-4&from=paste&height=321&id=u93012bed&originHeight=578&originWidth=1662&originalType=binary&ratio=1.7999999523162842&rotation=0&showTitle=false&size=189080&status=done&style=none&taskId=uc21448c9-db1a-4840-8ceb-e6eb1679efc&title=&width=923.3333577933141)
![image.png](https://cdn.nlark.com/yuque/0/2024/png/207857/1712624298719-d2458933-a842-43b5-964d-f716684de369.png#averageHue=%23ebc877&clientId=uf455ef3d-6fc4-4&from=paste&height=401&id=u857d55ea&originHeight=721&originWidth=1264&originalType=binary&ratio=1.7999999523162842&rotation=0&showTitle=false&size=181149&status=done&style=none&taskId=ua1888798-02b8-4408-a2e3-36e3584765d&title=&width=702.2222408247587)

下面来介绍下上述字段的含义：

1. navigationStart：表示上一个文档卸载结束时的unix时间戳，如果没有上一个文档，则等于fetchStart。
2. unloadEventStart：表示前一个网页（与当前页面同域）unload的时间戳，如无前一个网页unloade或前一个网页与当前不同域，则为0。
3. unloadEventEnd: 返回前一个unload时间绑定的回调执行完毕的时间戳。
4. redirectStart：前一个Http重定向发送时的时间。有跳转且是同域名内重定向，否则为0。
5. redirectEnd：前一个Http重定向完成时的时间。有跳转且是同域名内重定向，否则为0。
6. fetchStart：浏览器准备使用http请求文档的时间，在检查本地缓存之前。
7. domainLookupStart/domainLookupEnd：DNS域名查询开始/结束的时间，如果使用本地缓存（则无需DNC查询）或持久链接，则和fetchStart一致。
8. connectStart：HTTP（TCP）开始或重新建立链接的时间，如果是持久链接，则和fetchStart一致。
9. connectEnd：HTTP（TCP）完成建立链接的时间（完成握手），如果是持久链接，则和fetchStart一致。
10. secureConnectionStart：Https链接开始的时间，如果不是安全链接则为0。
11. requestStart：http在建立链接之后，正式开始请求真实文档的时间，包括从本地读取缓存。
12. responseStart：http开始接收响应的时间（获取第一个字节），包括从本地读取缓存。
13. responseEnd：http响应接收完全的时间（最后一个字节），包括从本地读取缓存。
14. domLoading：开始解析渲染DOM树的时间。
15. domInteractive：完成解析DOM树的时间。
16. domContentLoadedEventStart：DOM解析完成后，页面内资源加载开始的时间。
17. domContentLoadedEventEnd：DOM解析完成后，网页内资源加载完成的时间（如js脚本加载执行完）
18. domComplete：DOM树解析完，资源也准备就绪。
19. loadEventStart：load事件发送给文档，即load函数开始执行时。
20. loadEventEnd：load函数执行完毕的时间。
#### 前端性能核心指标（TTFB、FP、FCP、LCP、TTI、DCL）
 


## 参考

- [一文摸清前端监控实践要点](https://juejin.cn/column/7097156230489047047)