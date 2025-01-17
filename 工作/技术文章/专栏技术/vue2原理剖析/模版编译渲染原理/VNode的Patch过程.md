# VNode 的 Patch 过程

通过 render function 产生的新的 VNode 会和老 VNode 进行一个 patch 的过程，比对得出「差异」，最终将这些「差异」更新到视图上。

## diff 算法

**diff 算法是通过同层的树节点进行比较而非对树进行逐层搜索遍历的方式，所以时间复杂度只有 O(n)，是一种相当高效的算法。**

### patch 的简单逻辑：

```js
function patch(oldVnode, vnode, parentElm) {
  if (!oldVnode) {
    addVnodes(parentElm, null, vnode, 0, vnode.length - 1);
  } else if (!vnode) {
    removeVnodes(parentElm, oldVnode, 0, oldVnode.length - 1);
  } else {
    if (sameVnode(oldVNode, vnode)) {
      patchVnode(oldVNode, vnode);
    } else {
      removeVnodes(parentElm, oldVnode, 0, oldVnode.length - 1);
      addVnodes(parentElm, null, vnode, 0, vnode.length - 1);
    }
  }
}
```

其中关键是，当是相同的 VNode 的时候，才会进行 patch 过程。

### sameVnode 判断

sameVnode 其实很简单，只有当 key、 tag、 isComment（是否为注释节点）、 data 同时定义（或不定义），同时满足当标签类型为 input 的时候 type 相同（某些浏览器不支持动态修改`<input>`类型，所以他们被视为不同类型）即可。

```js
function sameVnode() {
  return (
    a.key === b.key &&
    a.tag === b.tag &&
    a.isComment === b.isComment &&
    !!a.data === !!b.data &&
    sameInputType(a, b)
  );
}

function sameInputType(a, b) {
  if (a.tag !== "input") return true;
  let i;
  const typeA = (i = a.data) && (i = i.attrs) && i.type;
  const typeB = (i = b.data) && (i = i.attrs) && i.type;
  return typeA === typeB;
}
```

### patchVnode 过程

```js
function patchVnode(oldVnode, vnode) {
  // 如果新老VNode相同，直接返回
  if (oldVnode === vnode) {
    return;
  }

  // 如果都是静态node，并且key也相同，只要将 componentInstance 与 elm 从老 VNode 节点“拿过来”即可
  if (vnode.isStatic && oldVnode.isStatic && vnode.key === oldVnode.key) {
    vnode.elm = oldVnode.elm;
    vnode.componentInstance = oldVnode.componentInstance;
    return;
  }

  const elm = (vnode.elm = oldVnode.elm);
  const oldCh = oldVnode.children;
  const ch = vnode.children;

  // 新 VNode 节点是文本节点的时候，直接用 setTextContent 来设置 text
  // nodeOps是适配器，根据不同平台提供不同的操作平台 DOM 的方法，实现跨平台
  if (vnode.text) {
    nodeOps.setTextContent(elm, vnode.text);
  } else {
    // oldCh 与 ch 都存在且不相同时，使用 updateChildren 函数来更新子节点
    if (oldCh && ch) {
      if (oldCh !== ch) {
        updateChildren(elm, oldCh, ch);
      }
    } else if (ch) {
      // 如果只有 ch 存在的时候，如果老节点是文本节点则先将节点的文本清除，然后将 ch 批量插入插入到节点elm下
      if (oldVnode.text) nodeOps.setTextContent(elm, "");
      addVnodes(elm, null, ch, 0, ch.length - 1);
    } else if (oldCh) {
      // 同理当只有 oldch 存在时，说明需要将老节点通过 removeVnodes 全部清除
      removeVnodes(elm, oldCh, 0, oldCh.length - 1);
    } else if (oldVnode.text) {
      // 当只有老节点是文本节点的时候，清除其节点文本内容。
      nodeOps.setTextContent(elm, "");
    }
  }
}
```

### updateChildren 逻辑

```js
function updateChildren(parentElm, oldCh, newCh) {
  /**
   * 首先我们定义 oldStartIdx、newStartIdx、oldEndIdx 以及 newEndIdx 分别是新老两个 VNode 的两边的索引，同时 oldStartVnode、newStartVnode、oldEndVnode 以及 newEndVnode 分别指向这几个索引对应的 VNode 节点。
   */
  let oldStartIdx = 0;
  let oldEndIdx = oldCh.length - 1;
  let oldStartVnode = oldCh[0];
  let oldEndVnode = oldCh[oldEndIdx];

  let newStartIdx = 0;
  let newEndIdx = newCh.length - 1;
  let newStartVnode = newCh[0];
  let newEndVnode = newCh[newEndIdx];

  let oldKeyToIdx, idxInOld, elmToMove, refElm;

  /**
   * 接下来是一个 while 循环，在这过程中，oldStartIdx、newStartIdx、oldEndIdx 以及 newEndIdx 会逐渐向中间靠拢。
   */
  while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
    // 当 oldStartVnode 或者 oldEndVnode 不存在的时候，oldStartIdx 与 oldEndIdx 继续向中间靠拢
    if (!oldStartVnode) {
      oldStartVnode = oldCh[++oldStartIdx];
    } else if (!oldEndVnode) {
      oldEndVnode = oldCh[--oldEndIdx];
    } else if (sameVnode(oldStartVnode, newStartVnode)) {
      /**
       * 首先是 oldStartVnode 与 newStartVnode 符合 sameVnode 时，说明老 VNode 节点的头部与新 VNode 节点的头部是相同的 VNode 节点，直接进行 patchVnode，同时 oldStartIdx 与 newStartIdx 向后移动一位。
       */
      patchVnode(oldStartVnode, newStartVnode);
      oldStartVnode = oldCh[++oldStartIdx];
      newStartVnode = newCh[++newStartIdx];
    } else if (sameVnode(oldEndVnode, newEndVnode)) {
      /**
       * 同样，两个 VNode 的结尾是相同的 VNode，同样进行 patchVnode 操作并将 oldEndVnode 与 newEndVnode 向前移动一位
       */
      patchVnode(oldEndVnode, newEndVnode);
      oldEndVnode = oldCh[--oldEndIdx];
      newEndVnode = newCh[--newEndIdx];
    } else if (sameVnode(oldStartVnode, newEndVnode)) {
      /**
       * 当老 VNode 节点的头部与新 VNode 节点的尾部是同一节点的时候，将老VNode头部节点直接移动到老VNode尾部节点的后面即可。然后 oldStartIdx 向后移动一位，newEndIdx 向前移动一位。
       */
      patchVnode(oldStartVnode, newEndVnode);
      nodeOps.insertBefore(
        parentElm,
        oldStartVnode.elm,
        nodeOps.nextSibling(oldEndVnode.elm)
      );
      oldStartVnode = oldCh[++oldStartIdx];
      newEndVnode = newCh[--newEndIdx];
    } else if (sameVnode(oldEndVnode, newStartVnode)) {
      /**
       * 同理，当老VNode尾部节点与新 VNode头部节点是同一节点的时候，将老VNode尾部节点插入到老VNode头部节点前面。同样的，oldEndIdx 向前移动一位，newStartIdx 向后移动一位。
       */
      patchVnode(oldEndVnode, newStartVnode);
      nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm);
      oldEndVnode = oldCh[--oldEndIdx];
      newStartVnode = newCh[++newStartIdx];
    } else {
      /**
       * 最后是当以上情况都不符合的时候
       */
      let elmToMove = oldCh[idxInOld];
      if (!oldKeyToIdx) {
        oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx);
      }
      idxInOld = newStartVnode.key ? oldKeyToIdx[newStartVnode.key] : null;
      if (!idxInOld) {
        createElm(newStartVnode, parentElm);
        newStartVnode = newCh[++newStartIdx];
      } else {
        elmToMove = oldCh[idxInOld];
        if (sameVnode(elmToMove, newStartVnode)) {
          patchVnode(elmToMove, newStartVnode);
          oldCh[idxInOld] = undefined;
          nodeOps.insertBefore(parentElm, newStartVnode.elm, oldStartVnode.elm);
          newStartVnode = newCh[++newStartIdx];
        } else {
          createElm(newStartVnode, parentElm);
          newStartVnode = newCh[++newStartIdx];
        }
      }
    }
  }

  if (oldStartIdx > oldEndIdx) {
    refElm = newCh[newEndIdx + 1] ? newCh[newEndIdx + 1].elm : null;
    addVnodes(parentElm, refElm, newCh, newStartIdx, newEndIdx);
  } else if (newStartIdx > newEndIdx) {
    removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx);
  }
}

/**
 * 产生 key 与 index 索引对应的一个 map 表
 */
function createKeyToOldIdx(children, beginIdx, endIdx) {
  let i, key;
  const map = {};
  for (i = beginIdx; i <= endIdx; ++i) {
    key = children[i].key;
    if (isDef(key)) map[key] = i;
  }
  return map;
}
```

## 总结

patch 主要是在更新视图的时候，通过对比两个 VNode 来计算重新渲染的视图。

VNode 比较过程如下：

1. 如果旧的 VNode 不存在，则直接添加新的 VNode
2. 如果新的 VNode 不存在，则删除旧的 VNode
3. 如果都存在
   1. 如果是相同的 VNode，这进行 patch
   2. 如果是不同的 VNode，这删除旧的 VNode，再添加新的 VNode

patch 的过程如下：

1. 如果新旧 VNode 相同，直接返回
2. 如果都是 static Node，则直接使用旧的 VNode
3. 如果新 VNode 节点是文本节点的时候，直接用 setTextContent 来设置 text
4. 当新 VNode 节点是非文本节点当时候，需要分几种情况：
   1. oldCh 与 ch 都存在且不相同时，使用 updateChildren 函数来更新子节点
   2. 如果只有 ch 存在的时候
      1. 如果老节点是文本节点，则先将节点的文本清除，然后将 ch 批量插入插入到节点 elm 下
      2. 如果老节点不是文本节点，oldCh 也不存在，这为空节点，直接将 ch 批量插入插入到节点 elm 下
   3. 同理当只有 oldch 存在时，说明需要将老节点通过 removeVnodes 全部清除。
   4. 当只有老节点是文本节点的时候，清除其节点文本内容。

updateChildren 的逻辑如下：

1. 首先我们定义 oldStartIdx、newStartIdx、oldEndIdx 以及 newEndIdx 分别是新老两个 VNode 的两边的索引，同时 oldStartVnode、newStartVnode、oldEndVnode 以及 newEndVnode 分别指向这几个索引对应的 VNode 节点。
2. 接下来是一个 while 循环，在这过程中，oldStartIdx、newStartIdx、oldEndIdx 以及 newEndIdx 会逐渐向中间靠拢。
   1. 当 oldStartVnode 或者 oldEndVnode 不存在的时候，oldStartIdx 与 oldEndIdx 继续向中间靠拢
   2. 首先是 oldStartVnode 与 newStartVnode 符合 sameVnode 时，说明老 VNode 节点的头部与新 VNode 节点的头部是相同的 VNode 节点，直接进行 patchVnode，同时 oldStartIdx 与 newStartIdx 向后移动一位。
   3. 同样，两个 VNode 的结尾是相同的 VNode，同样进行 patchVnode 操作并将 oldEndVnode 与 newEndVnode 向前移动一位
   4. 如果当老 VNode 节点的头部与新 VNode 节点的尾部是同一节点的时候，将老 VNode 头部节点直接移动到老 VNode 尾部节点的后面即可。然后 oldStartIdx 向后移动一位，newEndIdx 向前移动一位。
   5. 同理，当老 VNode 尾部节点与新 VNode 头部节点是同一节点的时候，将老 VNode 尾部节点插入到老 VNode 头部节点前面。同样的，oldEndIdx 向前移动一位，newStartIdx 向后移动一位。
   6. 最后是当以上情况都不符合的时候
      1. 根据 newStartVnode 的 key 获取到 idxInOld
         1. 如果没有找到相同的节点（也就是旧的 node 里面不存在新的 node），则通过 createElm 创建一个新节点，并将 newStartIdx 向后移动一位。
         2. 如果找到了，
            1. 如果符合 sameVnode，则将这两个节点进行 patchVnode，将该位置的老节点赋值 undefined，同时将 newStartVnode.elm 插入到 oldStartVnode.elm 的前面
            2. 如果不符合 sameVnode，只能创建一个新节点插入到 parentElm 的子节点中，newStartIdx 往后移动一位。
      2. 如果没有找到相同的节点，则通过 createElm 创建一个新节点，并将 newStartIdx 向后移动一位。

过程对比查看：

- https://github.com/aooy/blog/issues/2
- https://www.cnblogs.com/wind-lanyan/p/9061684.html

**最好用纸和笔画图，更易理解！**
