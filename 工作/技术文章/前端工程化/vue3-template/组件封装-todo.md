## 基础组件封装
参考Element3：

- [https://github.com/hug-sun/element3/tree/master/packages/element3/packages](https://github.com/hug-sun/element3/tree/master/packages/element3/packages)
- [https://e3.shengxinjing.cn/#/component/installation](https://e3.shengxinjing.cn/#/component/installation)


## 业务组件封装

子组件的显示隐藏

- 不使用父组件 v-if控制子组件的方式，没有动画效果
- 不采用父组件传值visible的方式控制，因为visible变量主要是子组件自己在玩
- 子组件有自己的打开关闭 open，close方法，通过父组件调用子组件open和close方法来控制子组件的显示隐藏

open里面，进行组件的初始化

close里面，进行组件的重置。


## 第三方组件封装

- [ ] 如何封装第三方组件
    - [https://developer.51cto.com/article/626235.html](https://developer.51cto.com/article/626235.html)
- [https://github.com/hug-sun/element3/tree/master/packages/element3/packages](https://github.com/hug-sun/element3/tree/master/packages/element3/packages)