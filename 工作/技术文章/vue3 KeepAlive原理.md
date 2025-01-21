参考：

- [ ] [https://juejin.cn/post/7069422231387439111](https://juejin.cn/post/7069422231387439111)

干嘛的

缓存组件，不让其销毁。保持切换路由前的状态。

自己咋实现

- 需要有个store去存储，在切走时存储，切回来时pop

实现思路

实现细节

总结

`KeepAlive`组件的设计思想其实起源于 HTTP 协议中的持久连接 KeepAlive：为了避免频繁地创建、销毁HTTP 连接带来的额外性能开销。在 vue 中`KeepAlive`的作用就是用来**缓存组件**，不但能避免频繁的创建销毁组件，还能够用来记忆组件的状态（一般用于缓存路由）。

`KeepAlive`实现原理其实很简单：

在我们卸载`keep-alive`包裹的 a 组件之前，会将 a 组件从原来的位置移动到一个隐藏容器里，等到需要被再次挂载的时候，就从隐藏容器里移动到原来的位置。

- to.name需要跟组件的name相同

[https://cn.vuejs.org/guide/built-ins/keep-alive.html#include-exclude](https://cn.vuejs.org/guide/built-ins/keep-alive.html#include-exclude)

[https://juejin.cn/post/7142797517355221023](https://juejin.cn/post/7142797517355221023)