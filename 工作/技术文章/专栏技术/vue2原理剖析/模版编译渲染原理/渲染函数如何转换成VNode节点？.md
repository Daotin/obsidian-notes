# 渲染函数如何转换成 VNode 节点？

VNode 也叫做 Virtual DOM，其实就是一棵以 JavaScript 对象（VNode 节点）作为基础的树，用对象属性来描述节点，实际上它只是一层对真实 DOM 的抽象。最终可以通过一系列操作使这棵树映射到真实环境上。

## 如何生成 VNode？

比如我目前有这么一个 Vue 组件：

```html
<template>
  <span class="demo" v-show="isShow"> This is a span. </span>
</template>
```

转换成 VNode 后的情况：

```js
{
    tag: 'span',
    data: {
        /* 指令集合数组 */
        directives: [
            {
                /* v-show指令 */
                rawName: 'v-show',
                expression: 'isShow',
                name: 'show',
                value: true
            }
        ],
        /* 静态class */
        staticClass: 'demo'
    },
    text: undefined,
    children: [
        /* 子节点是一个文本VNode节点 */
        {
            tag: undefined,
            data: undefined,
            text: 'This is a span.',
            children: undefined
        }
    ]
}
```

那么如何生成的呢？

## 实现一个 VNode

```js
class VNode {
  constructor(tag, data, children, text, elm) {
    /*当前节点的标签名*/
    this.tag = tag;
    /*当前节点的一些数据信息，比如props、attrs等数据*/
    this.data = data;
    /*当前节点的子节点，是一个数组*/
    this.children = children;
    /*当前节点的文本*/
    this.text = text;
    /*当前虚拟节点对应的真实dom节点*/
    this.elm = elm;
  }
}
```

上面的 html 就可以使用下面 render 方法生产 VNode：

```js
function render() {
  return new VNode(
    "span",
    {
      /* 指令集合数组 */
      directives: [
        {
          /* v-show指令 */
          rawName: "v-show",
          expression: "isShow",
          name: "show",
          value: true,
        },
      ],
      /* 静态class */
      staticClass: "demo",
    },
    [new VNode(undefined, undefined, undefined, "This is a span.")]
  );
}
```

## 总结

渲染函数如何生成 VNode 节点的？

渲染函数主要就是调用 VNode 类来生成 VNode 的，所以主要是要**实现 VNode 类**。

实现 VNode 类后，可以将 VNode 进一步封装一下，可以实现一些产生常用 VNode 的方法。比如`createEmptyVNode` ，`createTextVNode` 等等。

## 疑问

### 1、我们知道在 Vue 中，在更新视图的时候会将 DOM 映射成 VDOM，然后通过 diff 算法得出一些需要修改的最小单位，再将这些小单位的视图进行更新。那么，diff 是对 VDOM 进行操作还是对 DOM 进行操作？

在 Vue 中,diff 算法是对虚拟 DOM(VDOM)进行操作,不是对真实 DOM 进行操作。

更新视图的过程是:

1. 将组件的数据渲染成一个虚拟 DOM 对象(VNode)

2. 用新的 VNode 和 旧的 VNode 进行 diff,比较两者的差异

3. 将需要更新的部分按照 diff 结果进行最小单位地更新到真实 DOM 中

所以 diff 算法是在内存中对虚拟 DOM 进行比较和 patch,只有必要的部分才会更新到真实 DOM,避免了重复渲染和无效渲染,提高了性能。

diff 算法不会直接操作真实 DOM,它只会告诉渲染系统如何效率地更新真实 DOM。这种虚拟 DOM 的机制是 Vue 提高性能的关键所在。

### 2、VDOM 是一个 js 对象吗？为什么我看 Vue 源码中， 是使用 VNode 类来创建的，最后返回的这个类不是实例吗？就不是个对象了啊。

是的,VDOM 在 Vue 中的实现是通过 VNode 这个类来创建的,它是一个类的实例对象。

VNode 是一个实现了一些属性和方法的类,通过 new VNode()来创建一个 VNode 的实例对象。所以 VDOM 其实是一个 VNode 的实例对象,可以看作是一个 JavaScript 对象。

之所以使用类来构造,是因为一个类可以清晰地包含 VNode 的各种属性和方法,如 tag、data、children 等属性,以及实现一些更新逻辑的方法。直接使用普通 JS 对象会比较杂乱。

另外使用 Class 而不是普通对象还有一些好处:

- 可以避免每次创建虚拟 DOM 时都要重新定义对象属性和方法,有利于性能优化
- 可以基于 VNode 扩展子类如 ComponentVNode 等,提高代码的复用性和扩展性
- 有利于类型系统进行类型检查,比如 Vue 中的 Flow 静态类型检查

所以综合来说,Vue 选择通过 Class 来实现 VDOM 是一个比较好的设计,但本质上一个 VNode 实例是一个 JavaScript 对象,可以被渲染系统识别和更新。

### 3、类的实例是 js 对象？

是的,在 JavaScript 中,类的实例是对象。

当通过 new 关键字实例化一个类时,会执行以下操作:

1. 创建一个空的 JavaScript 对象
2. 将这个空对象链接到类的原型
3. 绑定 this
4. 执行构造函数,将属性和方法添加到这个对象上
5. 返回这个对象

所以类的实例本质上是一个普通的 JavaScript 对象,只是这个对象通过 new 关键字创建,并绑定了这个类的原型原型链。

我们可以验证:

```js
class Person {
  constructor(name) {
    this.name = name;
  }
}

const p = new Person("John");

console.log(typeof p); // 'object'
console.log(p instanceof Person); // true
console.log(p instanceof Object); // true
```

上面代码中,p 是一个 Person 的实例对象,它的类型是 object,既是 Person 的实例,也是 Object 的实例。

所以我们可以认为,类的实例就是一个普通的 JavaScript 对象,它通过原型链拥有了类的属性和方法。

### 4、在 createElement 方法中，如果传入的 data 的`__ob__`已经定义，则创建一个空节点。为什么？

在 Vue 的 createElement 方法中,会检查传入的 data 对象是否已经定义了**ob**属性,如果定义了就会创建一个空节点,这是一种避免重复观测(observe)的优化。

原因是在 Vue 中,一个对象被 observer 的时候,会给这个对象定义一个**ob**属性,用来标记这个对象已经被观测过了。

那么如果 createElement 的时候发现 data 有**ob**属性,就说明这个 data 对象已经被观测过了,就没有必要再次观测。

直接返回一个空节点,可以避免重复执行 Object.defineProperty 给 data 添加 getter/setter 的过程,优化了性能。

这样做有以下好处:

- 避免重复观测同一个对象,减少不必要的计算开销
- 防止因重复观测而导致的错误和警告
- 由于存在缓存,重复使用同一个 data 对象不会有副作用

所以检查 **ob** 属性是一个简单有效的优化手段,可以避免 Vue 多次观测同一个对象,提高系统性能。

### 5、createElement 不是创建 vdom 吗，跟观测有啥关系？

您提出了一个好问题,我来详细解释一下 createElement 和观测的关系:

createElement 函数主要工作是创建 VNode,也就是我们说的虚拟 DOM。但在其内部会对 data 做一些处理:

1. 如果 data 没有**ob**属性,会通过 observe 方法进行观测,给 data 加上响应式的 getter/setter。

2. 如果 data 有**ob**属性,说明已经被观测过了,就直接返回空 VNode。

之所以要在 createElement 做观测,是因为 data 会被合并到 VNode 上,参与后续的 patch 和 diff 过程。为了使视图响应式,data 必须是可观测的。

可以通过下面的流程总结 createElement 和观测的关系:

1. 调用 createElement 时,传入 data。

2. 检查 data 是否被观测过,如果没有,调用 observe 进行观测。

3. 使用数据创建 VNode,VNode 上会包含可观测的 data。

4. VNode 作为虚拟 DOM,进行 diff 和 patch,实现视图响应。

所以 createElement 之所以要与观测系统结合,是通过观测保证生成的 VNode 中包含的 data 是可响应的,实现整体的响应式。

可以说观测是响应式的基础,而 createElement 负责在 VNode 创建时将其集成,两者关系密不可分。
