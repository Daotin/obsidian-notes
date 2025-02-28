---
layout: mypost
title: 一文搞懂cursor
tags: [前端]
---

## 背景
cursor断断续续也用了几个月了，tab功能确实用的很happy，还有claude加持的chat，不管是对代码进行提问，还是修改，都很舒服。

所以想进一步好好学习cursor的进阶使用，包括composor agent功能等，全面摸索一下。

## 功能
废话不多说，比如介绍什么是cursor，如何安装使用的就免了。

直接介绍常用的功能。

### Tab 自动补全
这是用的最多的功能。

Cursor 和 GitHub Copilot 完成代码的最大区别在于：GitHub Copilot 可以在光标位置插入文本。它无法编辑光标周围的代码或删除文本。

- 在光标周围建议编辑，而不仅仅是插入额外的代码。
- 同时修改多行。


### Chat 对话（CTRL+L）
Cursor Chat 让您在代码库中提问或解决问题。

为了能够更好的解决问题，需要提供：
- 清晰的指令
- 足够的上下文Content


关于上下文：
- 默认情况下，Cursor Chat 包含`当前文件`作为上下文。
- 通过@符合，可以添加额外的上下文Content信息

@符号支持的功能：

 #### `@Files`
 引用文件。支持拖放的形式添加文件。
 
 **注意：指定文件的话，Cursor中如果@ 某个代码文件，cursor会尽量完整读取（测试临界点2000行）
 
 对于`Cmd K 分块策略`,Cursor 也根据内容长度以不同方式使用文件引用。有auto，full file，outline，chunks。
 
- 自动
    - 根据文件大小自动选择三种阅读策略之一
- 完整文件
    - 整个文件作为上下文使用。
- 大纲
    - Cursor 解析文件的大纲并使用该信息作为上下文。
- 块
    - Cursor 将文件分成较小的块，并选择最相关的一个。


#### `@Folders`
将整个文件夹作为上下文引用。`@Folders` 在需要提供大量上下文时特别有用。

相当于`@Files`整个文件夹下的文件。

#### `@Code`

引用某个文件特定的代码片段。

#### `@Docs`

Cursor 附带了一套爬取、索引并准备好作为上下文使用的第三方文档。

如果没有，还可以自己添加自定义的文档链接。

![](images/Pasted%20image%2020250228135453.png)


使用案例：基于第三方文档进行搜索，使结果最准确。

#### `@Git`
使用 `@Git` 将 git 提交、差异或拉取请求添加到您的提示中。

使用场景：
- 使用Cursor查找某一次提交可能存在的问题
- 使用`@diff of working state` 生成本次提交commit


#### `@Codebase`

从整个代码仓库查找上下文信息，遵循：

- 收集：扫描您的代码库以寻找重要文件/代码块
- 重新排序：根据与查询的相关性重新排列上下文项
- 推理：思考使用上下文的计划
- 生成：提出响应

#### `@Web`

使用 `@Web`，Cursor 根据您提供的查询和上下文构建搜索查询，并在网络上搜索相关信息作为额外的上下文。这对于查找最新信息特别有用。

> 可以通过在 `Cursor settings` > `Features` > `Chat` 下启用“始终搜索网络”，使 Cursor 在每个查询中搜索网络。这相当于在每个查询中使用 `@web`。



#### `@Chat`

> 此功能目前仅适用于 Cmd K。

用于将右侧当前聊天消息作为打开窗口的上下文。

使用场景：当希望将其应用于编辑或生成代码。



#### `@Definitions`

将所有附近的定义添加到Cmd K作为上下文。

#### `@Link`
比如：`@https://your-link.com`：在cursor响应之前，先访问链接。

使用场景：可以用来总结文章。

## 命令面板（CTRL+K）

在编辑器窗口中生成新代码或编辑现有代码。


## Composor 作曲家（CTRL+I）

分为normal/Agent模式。

#### Normal（普通模式）
normal提供了代码探索和生成的核心功能：
- 搜索您的代码库和文档
- 使用网络搜索
- 创建和写入文件
- 访问扩展`@`符号命令

#### Agent（代理模式）
- **功能特点**：Agent 模式下，Cursor 扮演智能编程助手的角色，能够自主完成复杂的编程任务。它可以：
- **自动上下文理解**：自动从代码库中提取相关上下文信息，主动分析项目结构和相关代码，理解用户需求。
- **多文件操作**：同时处理多个文件的修改、创建或删除。
- **命令执行**：直接在编辑器中运行终端命令，自动安装依赖或执行脚本。
- **任务规划与执行**：根据用户的高层次指令，制定详细的实现方案，并逐步执行。
- **适用场景**：适用于复杂的项目需求，如项目初始化、代码重构、错误诊断和修复等。Agent 模式能够处理涉及多个文件和步骤的任务，减少用户的手动干预，提高开发效率。


每次生成代码时，Composer 都会创建一个检查点。可以通过单击该检查点附近`restore`返回到任何以前的版本。如果不喜欢当前的更改并想要恢复到较早的状态，这会很方便。

Composor与Chat聊天的比较：
- chat：询问有关您的代码的问题。为您的代码提供建议，然后您可以将其应用到您的代码中。询问有关您的代码的一些知识。
- Composer ：给出一些更改代码的说明。在多文件中重构代码。在多文件中添加代码。（能够生成代码并创建文件和目录）

**简单来说，就是composor会比chat可以多文件增删改。**

> Cursor agent模式下，**默认读一个代码文件的前250行**，如果不够，偶尔会主动续读，增加250行；在部分要求明确的情况，Cursor会执行搜索，每次搜索结果最多为100行代码。


## Cursor 规则
- 全局规则：在 Cursor 设置中的 General > Rules for AI 下设置。
- 项目特定规则：在项目根目录的 `.cursorrules` 文件中定义。这些规则允许您根据自己的编码风格和项目需求定制 AI 的行为。

![](images/Pasted%20image%2020250228135507.png)

**换句话说，Rules for AI 是针对所有项目的全局提示词，而cursorrules相当于每个项目的提示词配置。**

关于cursorrules如何配置，可以参考：
- https://cursor.directory/
- https://cursorlist.com/
- https://github.com/PatrickJS/awesome-cursorrules

## 参考文档

- [Cursor官方文档（英文）](https://docs.cursor.com/get-started/welcome)
- [Cursor 中文文档](https://cursordocs.com/)
- [一文读懂Cursor与WindSurf的代码索引逻辑](https://mp.weixin.qq.com/s/Fl-K-tdRuhlT9I-bcLbtdg)




## Project Rules

Cursor 0.45 新增的 **Project Rules** 是一种功能，允许用户为项目编写特定的规则，以指导 AI 更好地理解和处理代码库。这些规则可以帮助 AI 创建更准确和符合项目规范的代码。

### 具体编写方法如下：

#### 1. 创建规则文件
- **打开 Cursor**，按下 `CMD + SHIFT + P`（或 `Ctrl + SHIFT + P`）打开命令面板。
- 输入 `File: New Cursor Rule` 并回车，创建一个新的规则文件。
- 为规则文件命名，例如 `instructions`，然后回车。

#### 2. 编写规则内容
规则文件是 Markdown 格式的 `.mdc` 文件，包含以下三个主要部分：
- **Description**：描述规则的用途，帮助 AI 选择合适的规则。
- **Globs**：指定文件模式（如 `*.tsx`），规则将自动应用于匹配的文件。
- **Content**：编写具体的规则内容，可以使用 Markdown 语法。

**示例**：
```markdown
---
Description: React Component Standards
Globs: src/components/**/*.tsx
---

# Coding Guidelines
- Use functional components with TypeScript
- Follow Atomic Design patterns
- PropTypes validation required
- Unit test coverage >80%
```

#### 3. 保存并应用规则
- 保存规则文件后，AI 会自动加载并应用这些规则。
- 如果需要手动加载规则，可以按下 `CMD + SHIFT + P`，然后选择 `Reload Window`。

#### 4. 管理规则文件
- 将规则文件放在项目根目录下的 `.cursor/rules` 文件夹中。
- 可以为不同的文件类型或目录创建多个规则文件，例如 `typescript.mdc`、`database.mdc` 等。

### 优势
- **更灵活的规则管理**：可以为不同的文件类型或目录设置特定的规则，避免上下文过载。
- **动态上下文选择**：AI 会根据当前文件自动选择相关的规则，确保建议的上下文适当。
- **更好的代码一致性**：通过项目特定的规则，AI 生成的代码更符合项目规范。

通过这些步骤，你可以充分利用 Cursor 0.45 的 Project Rules 功能，提升代码质量和开发效率。


## 现代前端Vue3+Vite项目的Project Rules最佳实践

在 Cursor 0.45 中，你可以通过将规则拆分为多个 `.mdc` 文件来精细化管理 Vue 3 + Vite 项目的规则。以下是一些最佳实践，按不同模块或文件类型进行分类：

### 1. 创建 `.cursor/rules` 目录
在项目根目录下创建 `.cursor/rules` 文件夹，用于存放所有规则文件。

### 2. 按模块或文件类型创建规则文件
根据项目需求，为不同的模块或文件类型创建单独的规则文件。以下是一些示例：

#### 2.1. Vue 组件规则 (`vue-components.mdc`)
```markdown
---
Description: Vue 3 Component Standards
Globs: src/components/**/*.vue
---

# Vue 组件规范
- 使用单文件组件（SFC）格式
- 遵循 Vue 3 Composition API
- 组件命名使用 PascalCase
- Props 验证使用 TypeScript interfaces
- 样式使用 scoped 或 CSS Modules
```

#### 2.2. TypeScript 规则 (`typescript.mdc`)
```markdown
---
Description: TypeScript Coding Standards
Globs: src/**/*.ts, src/**/*.tsx
---

# TypeScript 编码规范
- 使用最新的 TypeScript 版本
- 避免使用 `any` 类型
- 使用接口（interfaces）而不是类型断言（type assertions）
- 遵循 ESLint 和 Prettier 规范
```

#### 2.3. API 请求规则 (`api.mdc`)
```markdown
---
Description: API Request Standards
Globs: src/api/**/*.ts
---

# API 请求规范
- 使用 Axios 进行 HTTP 请求
- 集中管理 API 接口
- 请求方法使用 TypeScript 泛型
- 错误处理统一使用 try-catch
```

#### 2.4. 路由规则 (`router.mdc`)
```markdown
---
Description: Vue Router Standards
Globs: src/router/**/*.ts
---

# 路由规范
- 使用 Vue Router 4
- 路由配置使用 TypeScript interfaces
- 动态加载路由组件
- 路由元信息（meta）包含权限控制
```

#### 2.5. 状态管理规则 (`store.mdc`)
```markdown
---
Description: Pinia State Management Standards
Globs: src/store/**/*.ts
---

# 状态管理规范
- 使用 Pinia 进行状态管理
- 模块化状态管理
- 避免直接修改 state
- 使用 actions 进行异步操作
```

#### 2.6. 工具函数规则 (`utils.mdc`)
```markdown
---
Description: Utility Functions Standards
Globs: src/utils/**/*.ts
---

# 工具函数规范
- 函数命名使用 camelCase
- 避免函数过长，保持单一职责
- 使用 TypeScript 泛型
- 添加 JSDoc 注释
```

### 3. 全局规则文件
如果需要全局规则，可以创建一个 `instructions.mdc` 文件：

```markdown
---
Description: Global Project Instructions
Globs: *
---

# 全局项目规范
- 使用 Vite 作为构建工具
- 遵循 Vue 3 最佳实践
- 代码提交遵循 Commitlint 规范
- 使用 Git Hooks 自动化代码检查
```

### 4. 项目结构规则
如果需要对项目结构进行规范，可以创建一个 `project-structure.mdc` 文件：

```markdown
---
Description: Project Structure Standards
Globs: *
---

# 项目结构规范
- 目录结构清晰，遵循以下规范：
  - `src/components/`：通用组件
  - `src/views/`：页面组件
  - `src/router/`：路由配置
  - `src/store/`：状态管理
  - `src/utils/`：工具函数
  - `src/api/`：API 请求
- 文件命名使用有意义的名称，例如 `UserList.vue`、`AuthService.ts`
```

### 5. 优势
- **精细化管理**：通过将规则拆分为多个文件，可以更灵活地管理不同模块或文件类型的规则。
- **自动匹配**：Cursor 会根据文件路径和扩展名自动匹配相应的规则文件，无需手动选择。
- **上下文清晰**：每个规则文件专注于特定的模块或文件类型，避免了上下文过载，提高了 AI 的建议准确性。

通过以上方法，你可以为 Vue 3 + Vite 项目创建精细化的 Project Rules，提升代码质量和开发效率。