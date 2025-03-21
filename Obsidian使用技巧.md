## 内部链接
- 页面引用：`[[xxx]]`  
- 标题引用：`[[Topic#背景]]`
- 别名引用：`[[Topic|新的名称]]`
- 嵌入引用
	- 嵌入引用的语法`![[Note Name]]`，即在使用「双向链接」的时候，我们可以在「双向链接」前边输入一个`!`（叹号），这种「双向链接」的添加方式称为「嵌入引用」。嵌入引用带来的好处是，我们无需跳转，直接在原笔记中查看到被引入的「新笔记」。
- 块级引用
	- 块引用的语法 `[[Note Name ^]]` ，既在使用「双向链接」的时候，我们可以在「双向链接」的后边输入 `^` ，此时我们可以将被链接的笔记中的某一行（包括它的从属段落）引入到当前笔记中。这种方式成为「块引用」。


```
[[笔记名称]]
[[子文件夹/笔记名称]]
[[笔记名称#标题]]  // 指向具体标题
[[笔记名称^块ID]] // 指向具体块
```

## Callout（呼叫框）

> [!warning] 这是一个callout标题
> 这里是callout里的内容
> [[#20 Callout blocks|callout]]内部支持双链
> - 同样支持==MD语法==
> ```js
> console.log(111)
> ```

默认共支持**12种**类别 （可自己在 **Admonitions插件** 里添加）

参考：[Obsidian Callouts](https://notes.nicolevanderhoeven.com/Obsidian+Callouts)

1.  note
2.  abstract, summary, tldr
3.  info, todo
4.  tip, hint, important
5.  success, check, done
6.  question, help, faq
7.  warning, caution, attention
8.  failure, fail, missing
9.  danger, error
10.  bug
11.  example
12.  quote, cite

|Callout 类型|说明|
|---|---|
|`> [!NOTE]`|提示信息（默认蓝色）|
|`> [!TIP]`|建议/技巧（绿色）|
|`> [!WARNING]`|警告（黄色）|
|`> [!DANGER]`|危险/错误（红色）|
|`> [!INFO]`|额外信息（蓝色）|
|`> [!QUOTE]`|引用（灰色）|
|`> [!EXAMPLE]`|示例|
## 折叠与展开

> [!note]+ 这是一个可折叠的标题
> 这里的内容可通过点击 **Callouts标题** 折叠起来


### 多层嵌套

> [!failure] 这是第一层
> 这里是第一层的内容
>> [!bug]+ 这是嵌套的第二层
>> 这里是第二层的内容
>>> [!warning]- 这是嵌套的第三层，且默认为折叠状态
>>> 这里是第三层被折叠的内容


## 参考教程

https://publish.obsidian.md/csj-obsidian/0+-+Obsidian/Markdown/Markdown%E8%B6%85%E7%BA%A7%E6%95%99%E7%A8%8B+Obsidian%E7%89%88



```Mermaid
flowchart TD
    A[屏幕截图] --> VLM[VLM]
    B[用户输入] --> VLM
    
    VLM --> D{任务是否已完成}
    
    D -->|N| E[调用对应工具]
    E --> A
    
    D -->|Y| F[返回用户]
```


Obsidian 在标准 Markdown 的基础上扩展了许多功能，使其更适用于笔记管理和知识库构建。以下是 Obsidian 的 **Markdown 扩展**：

---

## **1. Callout（呼叫框）**

> ✅ **独有特性，标准 Markdown 不支持**

```markdown
> [!TIP] 这是一个技巧
> 你可以在这里写任何内容，包括 Markdown 语法！
```

**渲染效果：**

> [!TIP] 这是一个技巧  
> 你可以在这里写任何内容，包括 Markdown 语法！

---

## **2. 内部链接**

> ✅ **Obsidian 特有，用于笔记间跳转**

```markdown
[[笔记名称]]
[[子文件夹/笔记名称]]
[[笔记名称#标题]]  // 指向具体标题
[[笔记名称^块ID]] // 指向具体块
```

- **区别于标准 Markdown**，Obsidian 不需要 `[文本](URL)` 语法，而是直接 `[[笔记]]`。
- 支持跳转到 **标题** (`#标题`) 或 **特定块** (`^块ID`)。

---

## **3. 嵌入笔记和多媒体**

> ✅ **扩展 Markdown 语法，支持本地文件嵌入**

```markdown
![[图片.png]]  // 嵌入图片
![[音频.mp3]]  // 播放音频
![[视频.mp4]]  // 播放视频
![[笔记名称]]  // 直接显示笔记内容
```

- `[[...]]` 形式用于 **内部引用**，`![[...]]` 可直接 **嵌入显示**。
- **区别于标准 Markdown**：标准 Markdown 只能通过 `![Alt 文本](路径)` 插入图片，不能嵌入音视频或笔记。

---

## **4. 高亮文本**

> ✅ **非标准 Markdown**

```markdown
==高亮文本==
```

**渲染效果：**  
==高亮文本==

---

## **5. 任务列表**

> ✅ **类似 GitHub Task List，但支持交互**

```markdown
- [ ] 任务 1
- [x] 已完成任务
```

**渲染效果（可点击切换状态）：**

- [ ]  任务 1
- [x]  已完成任务

---

## **6. 数学公式（KaTeX）**

> ✅ **扩展 Markdown，标准 Markdown 不支持**

```markdown
$$
E = mc^2
$$
```

**渲染效果：**  
E=mc2E = mc^2

---

## **7. 块引用**

> ✅ **Obsidian 特有**

```markdown
> ^123abc  // 赋予某个块一个唯一 ID
```

然后可以在任何地方引用该块：

```markdown
[[笔记名称^123abc]]
```

**区别于标准 Markdown**：标准 Markdown 没有块级引用概念。

---

## **8. YAML Front Matter**

> ✅ **标准 Markdown 支持，但 Obsidian 额外解析**

```yaml
---
title: 我的笔记
tags: [Obsidian, Markdown]
created: 2025-03-21
---
```

- 用于定义 **元数据**（标题、标签、时间等）。
- Obsidian **会解析这些字段**，可以用于搜索、插件等。

---

## **9. Mermaid 图表**

> ✅ **扩展 Markdown，支持流程图、甘特图等**

````markdown
```mermaid
graph TD
  A --> B
  B --> C
````


```mermaid
graph TD
  A --> B
  B --> C
```

---

## **10. Dataview 查询**

> ✅ **通过插件实现，非标准 Markdown**

```markdown
```dataview
TABLE file.name, file.ctime
FROM "笔记/日记"
SORT file.ctime DESC
```


- **Dataview** 允许查询和筛选 Obsidian 笔记数据。
- **标准 Markdown 不支持**，需安装插件。

---

## **11. Canvas（画布）**
> ✅ **Obsidian 特色功能，Markdown 本身不支持**
- 允许将 **多个笔记** 连接成 **思维导图**。
- **标准 Markdown 无法表示**，只能在 Obsidian 内使用。

---

## **总结：Obsidian Markdown 扩展 vs 标准 Markdown**
| 扩展功能 | Obsidian | 标准 Markdown |
|----------|---------|--------------|
| **Callout（呼叫框）** | ✅ | ❌ |
| **内部链接 `[[...]]`** | ✅ | ❌ |
| **笔记/文件嵌入 `![[...]]`** | ✅ | ❌ |
| **高亮文本 `==...==`** | ✅ | ❌ |
| **可交互任务列表 `- [ ]`** | ✅ | 部分支持（GitHub） |
| **数学公式 `$$...$$`** | ✅（KaTeX） | ❌ |
| **块引用 `[[...^ID]]`** | ✅ | ❌ |
| **YAML Front Matter** | ✅ | ✅（部分支持） |
| **Mermaid 图表** | ✅ | ❌（需插件） |
| **Dataview 查询** | ✅（插件） | ❌ |
| **Canvas（画布）** | ✅ | ❌ |

---
**📌 结论**
1. **Obsidian 扩展了 Markdown**，使其更适合 **知识管理**，但部分功能（如 `[[链接]]`、`![[嵌入]]`）不兼容其他 Markdown 编辑器。
2. **在其他 Markdown 解析器中**，Obsidian 的扩展可能不会正确显示。
3. **如果要在多个 Markdown 编辑器中使用**，建议避免使用 Obsidian 的特有语法，尽量使用标准 Markdown。
