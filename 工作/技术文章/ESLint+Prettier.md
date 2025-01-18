# ESLint+Prettier

ESlint：javascript 代码检测工具。

> ”针对 vue 的 ESlint 需要使用 eslint-plugin-vue（因为是基于 ESlint 的，所以 ESlint 也要安装）

> ”This plugin allows us to check the `<template>` and `<script>` of `.vue` files with ESLint, as well as Vue code in `.js` files.

> **Requirements**
>
> - ESLint v6.2.0 and above
> - Node.js v14.17.x, v16.x and above

# 使用前声明：**`*2022年8月2日*`**

<aside>
💡 如果不是持续迭代的项目，比如半年就完结的项目，不必使用eslint，只使用`prettier+vscode插件`即可。

</aside>

# ESlint 配置

1、初始化配置文件（自动创建 `.eslintrc.cjs`文件）

```bash
npx eslint --init
```

![Untitled](images/Untitled.png)

> 由于在  [ESLint 优先级](https://eslint.org/docs/user-guide/configuring/configuration-files#configuration-file-formats)中  `.eslintrc.js`的[优先级](https://so.csdn.net/so/search?q=%E4%BC%98%E5%85%88%E7%BA%A7&spm=1001.2101.3001.7020)最高，故使用  `.eslintrc.js`。

![Untitled](images/Untitled%201.png)

```jsx
module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
  },
  globals: {
    defineEmits: "readonly",
    defineProps: "readonly",
    defineExpose: "readonly",
    withDefaults: "readonly",
    onMounted: "readonly",
    ref: "readonly",
    reactive: "readonly",
    watch: "readonly",
    computed: "readonly",

    Status: "readonly",
    Operation: "readonly",
    SearchComparator: "readonly",
  },
  extends: [
    "plugin:vue/vue3-recommended",
    "plugin:@typescript-eslint/recommended",
    "airbnb-base",
    "plugin:prettier/recommended", // 添加 prettier 插件
  ],
  parser: "vue-eslint-parser",
  parserOptions: {
    ecmaVersion: "latest",
    parser: "@typescript-eslint/parser",
    sourceType: "module",
  },
  plugins: ["vue", "@typescript-eslint"],
  rules: {
    "no-console": "off",
    "no-empty": "off",
    "import/extensions": "off",
    "import/no-unresolved": "off",
    "import/no-extraneous-dependencies": "warn",
    "no-unused-vars": "warn",
    // 不允许标识符中的悬空下划线
    "no-underscore-dangle": "off",
    "@typescript-eslint/no-var-requires": "off",
    // 为每个未标记为必需的prop设置默认值（布尔除外）。
    "vue/require-default-prop": "off",
    // 在注释中的 // 或 /* 之后强制保持一致的间距
    "spaced-comment": "off",
    // === 替换 ==
    eqeqeq: "warn",
    //禁止未使用的表达式，对程序状态没有影响的未使用表达式表示逻辑错误。
    "no-unused-expressions": [
      "warn",
      {
        allowShortCircuit: true,
      },
    ],
    // 强制每行属性的最大数量
    "vue/max-attributes-per-line": [
      "warn",
      {
        singleline: {
          max: 5,
        },
        multiline: {
          max: 1,
        },
      },
    ],
    // 此规则要求组件名称始终为多字，除了根 App 组件，以及 Vue 提供的内置组件，例如 <transition> 或 <component>。这可以防止与现有和未来的 HTML 元素发生冲突，因为所有 HTML 元素都是一个单词。
    "vue/multi-word-component-names": "off",
    // 禁止 case 中的词法声明
    "no-case-declarations": "off",
  },
};
```

## **extends 配置扩展**

实际项目中配置 rules 的时候，不可能团队一条一条的去商议配置，太费精力了。通常的做法是使用业内大家普通使用的、遵循的编码规范；然后通过 extends 去引入这些规范。

extends 可以理解为**rules 的快捷配置字段**，一般先配置 extends 为业内通用规范，且数组时后面的会覆盖前面的，并自定义配置 rules 覆盖 extends 中不满足你想要规范的规则。

- 预设 lint 的包一般命名以 eslint-config-xxx 这样的格式，常见的预设包有 standard，Airbnb 等。一般可以省略 eslint-config-，比如 eslint-config-standard 可以简写为 standard
- 如果选用了多个配置文件，是从右至左读取的，也就是前面的如果和后面的配置文件有重合，是会覆盖后面的。

extends 配置的时候接受字符串或者数组：

- 指定配置的字符串(配置文件的`路径`、可共享配置的名称、`eslint:recommended`  或  `eslint:all`)
- 字符串数组：每个配置继承它前面的配置

### 配置 Configurations for using Vue.js 3.x

有三种选择，一种比一种严格：

• `"plugin:vue/base"` ：启用正确 ESLint 解析的设置和规则.

- `"plugin:vue/vue3-essential"` ： `base`规则+防止错误或意外行为的规则
- `"plugin:vue/vue3-strongly-recommended"` ：以上，再加上大大提高代码可读性和/或开发体验的规则
- `"plugin:vue/vue3-recommended"` ：以上，再加上强制执行主观社区默认值的规则，以确保一致性。

这里我们使用最后一种：

```jsx
"extends": [
  "plugin:vue/vue3-recommended",
],
```

### Airbnb 标准

```bash
npm i eslint-config-airbnb-base eslint-plugin-import -D
```

> [\*\*eslint-config-airbnb](https://www.npmjs.com/package/eslint-config-airbnb) 和 [eslint-config-airbnb-base](https://www.npmjs.com/package/eslint-config-airbnb-base) 的区别\*\*

- [\*\*eslint-config-airbnb](https://www.npmjs.com/package/eslint-config-airbnb) 包含了 React，而 base 提供了 Airbnb 的基本 JS .eslintrc（没有 React 插件）\*\*
- 安装 [\*\*eslint-config-airbnb-base](https://www.npmjs.com/package/eslint-config-airbnb-base) 时，需要同步安装 `eslint-plugin-import`\*\*

## 插件 plugin

plugin 与 extend 的区别：extend 提供的是 eslint 现有规则的一系列预设，而 plugin 则提供了除预设之外的自定义规则，当你在 eslint 的规则里找不到合适的的时候，就可以借用插件来实现了。

## 其他配置项说明

- **root：**一般在项目中，我们经常将 lint 文件放在根目录，因此为了没必要的向上遍历，一般我们会配置`"root": true`

```jsx
// Eslint检测配置文件步骤：
// 1.在要检测的文件同一目录里寻找.eslintrc.*和package.json
// 2.紧接着在父级目录里寻找，一直到文件系统的根目录
// 3.如果在前两步发现有root：true的配置，停止在父级目录中寻找.eslintrc
// 4.如果以上步骤都没有找到，则回退到用户主目录~/.eslintrc中自定义的默认配置
"root": true,
```

- env

指定不同的环境可以给对应环境下提供预设的全局变量，比如说在 browser 环境下，可以使用 window 全局变量；在 node 环境下，可以使用 process 全局变量等。 可用的环境包括： 可选配置项如下

- `browser` - 浏览器环境中的全局变量。
- `node` - Node.js 全局变量和 Node.js 作用域。
- `commonjs` - CommonJS 全局变量和 CommonJS 作用域 (用于 Browserify/WebPack 打包的只在浏览器中运行的代码)。
- `es6` - 启用除了 modules 以外的所有 ECMAScript 6 特性（该选项会自动设置  `ecmaVersion`  解析器选项为 6）

- **globals 全局变量**

当访问当前源文件内未定义的变量时，[no-undef](https://link.juejin.cn/?target=https%3A%2F%2Feslint.bootcss.com%2Fdocs%2Frules%2Fno-undef) 规则将发出警告。如果你想在一个源文件里使用全局变量，在 Globals 中定义这些全局变量，这样 ESLint 就不会发出警告了

```jsx
"globals": {
    "var1": "writable", // "off" 禁用全局变量
    "var2": "readonly"
}
```

- **parser 解析器**

`解析器`将源代码转换为称为`抽象语法树（AST）`的数据格式，然后，插件使用这种数据格式围绕代码的外观或行为创建称为 lint 规则的断言。

ESLint 附带了一个`内置的解析器（称为espree）`，因此如果你只编写标准 JavaScript，就不需要自定义解析器了

如果我们想支持非标准 JavaScript 语法，我们需要做的就是为 ESLint 提供一个可供使用的`替代解析器`。根据工程的实际情况，对解析器进行设置，比如基于`vue框架`的工程需要用到能解析 vue 语法解析器；再比如使用到`TypeScript`的工程，需要配置能解析 TypeScript 的解析器

- rules 规则

简单来说，rules 的规则是为 extends 而生的，如果我们没有写 extends，那么其实也是没有必要写 rules 的。rules 的作用就是用来扩展或者直接 override 我们的 extends 文件中的配置。

- `"off"`  或  `0` - 关闭规则
- `"warn"`  或  `1` - 开启规则，使用警告级别的错误：`warn` (不会导致程序退出)
- `"error"`  或  `2` - 开启规则，使用错误级别的错误：`error` (当被触发的时候，程序会退出)

## .eslintignore

```tsx
node_modules
dist
/public/*

# Editor directories and files
.DS_Store
.idea
.vscode
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?
**/*.svg
**/*.sh
*.log
*.local
components.d.ts

# 重要的环境依赖文件
package.lock.json
yarn.lock

# 代码格式化插件的配置文件
.prettierignore
.eslintignore
.gitignore

# 不对markdown进行格式化, 容易打乱自己编排的样式
*.md
```

## 配置 vscode 文件

> vscode 首先安装 ESlint 插件

![Untitled](images/Untitled%202.png)

您必须配置扩展的 eslint.validate 选项来检查 .vue 文件，因为默认情况下扩展只针对 _.js 或 _.jsx 文件。

示例 .vscode/settings.json：

```tsx
"editor.formatOnSave": true,
"eslint.validate": [
  "javascript",
  "javascriptreact",
  "vue",
  "typescript",
  "typescriptreact"
],
"eslint.alwaysShowStatus": true,
"eslint.format.enable": true,
"editor.codeActionsOnSave": {
  "source.fixAll": true
},
// 在快速修复菜单中显示打开的 lint 规则文档网页
"eslint.codeAction.showDocumentation": {
  "enable": true
},
```

保存后重启 VSCode 编辑器，基本上配置完成了。

### 在浏览器中显示 ESLint 错误

通过运行安装  `vite-plugin-eslint` ，任何  `ESLint`  错误现在都会在浏览器中报告。

```
npm i vite-plugin-eslint -D
```

用法：

```jsx
import { defineConfig } from "vite";
import eslint from "vite-plugin-eslint";

export default defineConfig({
  plugins: [eslint()],
});
```

# Prettier

1、安装 Prettier

```bash
npm i prettier -D
```

2、创建 Prettier 配置文件

Prettier 的配置文件可以用 4 种文件格式编写：

1. JavaScript `.prettierrc.js`或`prettier.config.js` （⭐ 推荐—可以写注释）
2. JSON `.prettierrc.json`
3. YAML `.prettierrc.yaml`或`.prettierrc.yml`
4. TOML `.prettierrc.toml`

当同一个目录下有多个不同格式的配置文件时，Prettier 只会使用一个。Prettier 会按照以下优先级（从高到低）读取：

1. `package.json`
2. `.prettierrc` YAML 或 JSON 格式
3. `.prettierrc.json`
4. `.prettierrc.yaml`
5. `.prettierrc.yml`
6. `.prettierrc.js`
7. `.prettier.config.js`
8. `.prettierrc.toml`

```jsx
module.exports = {
  // 超过多少字符后换行
  printWidth: 120,
  // 行末分号
  semi: false,
  // 单引号
  singleQuote: true,
  // 缩进
  tabWidth: 2,
  // 使用tab缩进还是空格
  useTabs: true,
  // 是否使用尾逗号
  trailingComma: "es5",
  // > 标签放在最后一行的末尾，而不是单独放在下一行
  jsxBracketSameLine: false,
  // (x) => {} 箭头函数参数只有一个时是否要有小括号。 alwaysz:总是带括号，avoid：省略括号
  arrowParens: "avoid",
  // 解决：Delete `␍` 问题
  endOfLine: "auto",
};
```

3、VSCode 编辑器使用 Prettier 配置需要下载插件 Prettier - Code formatter

![Untitled](images/Untitled%203.png)

4、在项目的根目录下新建 `.prettierignore` 忽略文件

（内容跟`.eslintignore`相同）

```
node_modules
dist
/public/*

# Editor directories and files
.DS_Store
.idea
.vscode
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?
**/*.svg
**/*.sh
*.log
*.local
components.d.ts

# 重要的环境依赖文件
package.lock.json
yarn.lock

# 代码格式化插件的配置文件
.prettierignore
.eslintignore
.gitignore

# 不对markdown进行格式化, 容易打乱自己编排的样式
*.md
```

### 解决 Prettier 和 ESLint 的冲突

冲突的本质在于 `eslint`既负责了代码质量检测，又负责了一部分的格式美化工作,格式化部分的部分规则和 `prettier`不兼容。 能不能让`eslint`只负责代码质量检测而让`prettier`负责美化呢? 好在社区有了非常好的成熟方案，即 `eslint-config-prettier` + `eslint-plugin-prettier`。

- `eslint-plugin-prettier` 将 Prettier 的规则设置到 ESLint 的规则中。
- `eslint-config-prettier` 关闭 ESLint 中与 Prettier 中会发生冲突的规则。

最后形成优先级：`Prettier 配置规则` > `ESLint 配置规则`。

1、安装插件

```bash
npm i eslint-plugin-prettier eslint-config-prettier -D
```

2、在 `.eslintrc.js` 添加 prettier 插件

```jsx
module.exports = {
  ...
  extends: [
    'plugin:vue/essential',
    'airbnb-base',
    'plugin:prettier/recommended' // 添加 prettier 插件
  ],
  ...
}
```

这样，我们在执行 `eslint --fix` 命令时，ESLint 就会按照 Prettier 的配置规则来格式化代码，轻松解决二者冲突问题。

### 其他问题

报错：`Parsing error: '>' expected.eslint`

这个解析器允许我们对 .vue 文件的 <template> 进行 lint。如果我们在模板中使用复杂的指令和表达式，我们很容易在 <template> 上出错。这个解析器和 eslint-plugin-vue 的规则会捕捉到一些错误。

安装

```jsx
npm install --save-dev vue-eslint-parser
```

### package.json 新增的内容

```jsx
{
	"scripts": {
		"lint": "npx eslint --fix --ext .js,.ts,.vue ."
	},
	"devDependencies": {
		"eslint": "^8.21.0",
		"eslint-config-airbnb-base": "^15.0.0",
		"eslint-config-prettier": "^8.5.0",
		"eslint-plugin-import": "^2.26.0",
		"eslint-plugin-prettier": "^4.2.1",
		"eslint-plugin-vue": "^9.3.0",
		"prettier": "^2.7.1",
	}
}
```

## **集成 husky 和 lint-staged**

我们在项目中已集成 ESLint 和 Prettier，在编码时，这些工具可以对我们写的代码进行实时校验，在一定程度上能有效规范我们写的代码，但团队可能会有些人觉得这些条条框框的限制很麻烦，选择视“提示”而不见，依旧按自己的一套风格来写代码，或者干脆禁用掉这些工具，开发完成就直接把代码提交到了仓库，日积月累，ESLint 也就形同虚设。

所以，我们还需要做一些限制，让没通过 ESLint 检测和修复的代码禁止提交，从而保证仓库代码都是符合规范的。

为了解决这个问题，我们需要用到 Git Hook，在本地执行  `git commit`的时候，就对所提交的代码进行 ESLint 检测和修复（即执行  `eslint --fix`），如果这些代码没通过 ESLint 规则校验，则禁止提交。

> husky —— Git Hook 工具，可以设置在 git 各个阶段（pre-commit、commit-msg、pre-push 等）触发我们的命令。
> lint-staged —— 在 git 暂存的文件上运行 linters。

（待续…）

## 参考文档

（很详细）[https://juejin.cn/post/6951649464637636622](https://juejin.cn/post/6951649464637636622)

（蛮清楚）[https://juejin.cn/post/6977611901232480286](https://juejin.cn/post/6977611901232480286)

[https://juejin.cn/post/6844904065319731208](https://juejin.cn/post/6844904065319731208)

[https://www.panyanbin.com/article/47d1c4a4.html](https://www.panyanbin.com/article/47d1c4a4.html)

[https://juejin.cn/post/7011871773687808031](https://juejin.cn/post/7011871773687808031)

[https://juejin.cn/post/7020653715363217445](https://juejin.cn/post/7020653715363217445)

- [**VSCode 插件与 npm 包的区别和使用（ESlint、Prettier、Vetur）**](https://www.panyanbin.com/article/47d1c4a4.html)
