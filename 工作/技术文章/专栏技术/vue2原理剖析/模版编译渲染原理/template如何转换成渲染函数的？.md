# template 如何转换成渲染函数的？

compile 编译可以分成 `parse`、`optimize` 与 `generate` 三个阶段，最终需要得到渲染函数 render function。

示例 template：

```html
<div :class="c" class="demo" v-if="isShow">
  <span v-for="item in sz">{{item}}</span>
</div>
```

## parse

parse 会用正则等方式将 template 模板中进行字符串解析，得到指令、class、style 等数据，形成 AST.

> AST 是抽象语法树（Abstract Syntax Tree）的缩写。它是在计算机科学中用于表示源代码语法结构的一种数据结构。在编译器和解释器中，AST 通常是从源代码生成的中间表示形式，用于进行后续的分析、优化和执行。

这个过程比较复杂，会涉及到比较多的正则进行字符串解析，我们来看一下得到的 AST 的样子。

```js
{
    /* 标签属性的map，记录了标签上属性 */
    'attrsMap': {
        ':class': 'c',
        'class': 'demo',
        'v-if': 'isShow'
    },
    /* 解析得到的:class */
    'classBinding': 'c',
    /* 标签属性v-if */
    'if': 'isShow',
    /* v-if的条件 */
    'ifConditions': [
        {
            'exp': 'isShow'
        }
    ],
    /* 标签属性class */
    'staticClass': 'demo',
    /* 标签的tag */
    'tag': 'div',
    /* 子标签数组 */
    'children': [
        {
            'attrsMap': {
                'v-for': "item in sz"
            },
            /* for循环的参数 */
            'alias': "item",
            /* for循环的对象 */
            'for': 'sz',
            /* for循环是否已经被处理的标记位 */
            'forProcessed': true,
            'tag': 'span',
            'children': [
                {
                    /* 表达式，_s是一个转字符串的函数 */
                    'expression': '_s(item)',
                    'text': '{{item}}'
                }
            ]
        }
    ]
}


```

正则的写法非常麻烦，这里略过。

然后继续。

## 转化过程简单总结

上面的 template 就是一个字符串：

```js
var html =
  '<div :class="c" class="demo" v-if="isShow"><span v-for="item in sz">{{item}}</span></div>';
```

### parse 阶段

- parse 阶段会定义很多复杂的正则，来匹配标签名，属性啊，标签开始，标签结束等等
- 还有一个 advance 函数，当匹配到字符串后，继续往下匹配的时候，会将上一个匹配的内容去掉

开始循环遍历 template 字符串:

1、匹配开始标签：比如`<div :class="c" class="demo" v-if="isShow">`部分的内容

- 如果匹配到开始标签，则获取 tagName，attrs 数组，和位置 start
- 然后一直匹配到第一个">"
- 还要维护一个 stack，来保存已经解析好的标签头，这样我们可以根据在解析尾部标签的时候得到所属的层级关系以及父标签。
- 在处理`v-if`和`v-for`是需要单独的 processIf 函数和 processFor 函数

2、匹配结束标签：比如`</div>`部分

- 更新 stack：从 stack 栈中取出最近的跟自己标签名一致的那个元素

3、解析标签中间的文本

- 一种是普通的文本，直接构建一个节点 push 进
- 还有一种情况是文本是如“{{item}}”这样的 Vue.js 的表达式，需要用 parseText 来将表达式转化成代码

### optimize

optimize 就是为静态的节点做上一些「标记」，在 patch 的时候我们就可以直接跳过这些被标记的节点的比对，从而达到「优化」的目的。

- `isStatic` 函数：判断该 node 是否是静态节点
- `markStatic`：为所有的节点标记上 static，遍历所有节点通过 isStatic 来判断当前节点是否是静态节点
- `markStaticRoots`：对特定的情况进行标记（如果当前节点是静态节点，同时满足该节点并不是只有一个文本节点（作者认为这种情况的优化消耗会大于收益），会标记 staticRoot 为 true）

### generate

上面的 parse 和 optimize 后，我们会得到一个 js 类型的 AST，generate 会将 AST 转化成 render funtion 字符串。

- `genIf`：处理 if 语法
- `genFor`： 处理 for 语法
- `genElement`：根据当前节点是否有 if 或者 for 标记然后判断是否要用 genIf 或者 genFor 处理，否则通过 genChildren 处理子节点
- `genChildren`：比较简单，遍历所有子节点，通过 genNode 处理后用“，”隔开拼接成字符串。
- `genNode`：则是根据 type 来判断该节点是用文本节点 genText 还是标签节点 genElement 来处理。

经过 generate 处理后，就能生成 render function：

```js
render () {
  return isShow ? (new VNode(
    'div',
    {
      'staticClass': 'demo',
      'class': c
    },
    /* begin */
    renderList(sz, (item) => {
        return new VNode('span', {}, [
            createTextVNode(item);
        ]);
    })
    /* end */
  )) : createEmptyVNode();
}
```

而 render function，这会进一步转换成 VNode。

## 补充

- vue-loader 是解析`.vue`文件，拆分出 template js css，template 由 `vue-template-compile` 编译。

## 总结

template 转换成渲染函数的过程如下：

1. template 通过正则等手段生成 AST
2. 优化 AST，对 AST 进行 static 静态打标，方便之后的 patch
3. 根据优化后的 AST，调用各种处理函数生成 render function 渲染函数
