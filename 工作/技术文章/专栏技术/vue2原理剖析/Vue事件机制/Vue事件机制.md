# Vue 事件机制

[参考文档](https://github.com/answershuto/learnVue/blob/master/docs/Vue%E4%BA%8B%E4%BB%B6%E6%9C%BA%E5%88%B6.MarkDown)

## 补充

### on.fn = fn 的作用是什么？

```js
Vue.prototype.$once = function (event: string, fn: Function): Component {
  const vm: Component = this;
  function on() {
    /*在第一次执行的时候将该事件销毁*/
    vm.$off(event, on);
    /*执行注册的方法*/
    fn.apply(vm, arguments);
  }
  on.fn = fn;
  vm.$on(event, on);
  return vm;
};
```

on.fn = fn 这行代码的作用是将传入的回调函数 fn 保存到 on 函数的 fn 属性上。

这样做的目的是为了在 on 函数内部可以访问到原始的回调函数 fn。因为当使用 vm.$on(event, on) 注册事件监听时,会传入 on 函数作为回调,而不是原始的 fn。

在 on 函数内部,我们在执行回调时需要调用原始的 fn 函数,所以需要将其保存到 on 函数的属性上,以便内部可以访问到。

此外,之所以需要保存它,是因为在执行 on 函数时,this 指向将会改变,导致无法通过 this.fn 或类似的方式获取到原始的回调函数。

所以综上,on.fn = fn 这行代码使得 on 函数内部可以访问到外部传入的原始回调 fn,从而在适当的时机执行它。

### 解释下$emit 方法的含义

```js
Vue.prototype.$emit = function (event: string): Component {
  const vm: Component = this;
  if (process.env.NODE_ENV !== 'production') {
    const lowerCaseEvent = event.toLowerCase();
    if (lowerCaseEvent !== event && vm._events[lowerCaseEvent]) {
      tip(
        `Event "${lowerCaseEvent}" is emitted in component ` +
          `${formatComponentName(vm)} but the handler is registered for "${event}". ` +
          `Note that HTML attributes are case-insensitive and you cannot use ` +
          `v-on to listen to camelCase events when using in-DOM templates. ` +
          `You should probably use "${hyphenate(event)}" instead of "${event}".`
      );
    }
  }
  let cbs = vm._events[event];
  if (cbs) {
    /*将类数组的对象转换成数组*/
    cbs = cbs.length > 1 ? toArray(cbs) : cbs;
    const args = toArray(arguments, 1);
    /*遍历执行*/
    for (let i = 0, l = cbs.length; i < l; i++) {
      cbs[i].apply(vm, args);
    }
  }
  return vm;
};
```

这段代码是 Vue.$emit 的实现,用于触发组件上的事件。

主要逻辑如下:

1. 在非生产环境下,检查事件名称的大小写是否正确,以发出警告。

2. 从组件的\_events 对象中获取对应事件名称的回调函数数组 cbs。

3. 如果 cbs 存在,则将其转换为数组。因为\_events 中存储的回调可能是数组,也可能是单个函数。

4. 获取额外的参数 args。

5. 遍历 cbs 数组,依次调用每个回调函数,并传入事件参数 args。

6. 返回组件实例本身。

其中关键点是第 5 步,遍历回调函数并传入参数,这实现了事件的触发并传递参数。

而回调函数数组 cbs 来源于组件通过$on 注册的事件监听器。这使得组件可以灵活地监听并响应自身事件。

所以这段代码连接起了事件的触发和监听,是 Vue 事件机制的核心之一。
