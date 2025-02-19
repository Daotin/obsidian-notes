# 代码规范

## 开启 VSCode 插件推荐

新增 `.vscode/extensions.json` 文件

```json
{
  "recommendations": [
    "johnsoncodehk.volar",
    "johnsoncodehk.vscode-typescript-vue-plugin",
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode"
  ]
}
```

## 项目工作区规范

新增 `.vscode/settings.json` 文件

```json
{
  // // eslint 保存格式化
  // "eslint.enable": true,
  // "eslint.run": "onType",
  // "eslint.options": {
  //   "extensions": [".js", ".ts", ".jsx", ".tsx", ".vue"]
  // },
  // // 编辑器保存格式化
  // "editor.codeActionsOnSave": {
  //   "source.fixAll": true,
  //   "source.fixAll.eslint": true
  // },
  // 保存到额时候用使用 prettier进行格式化
  "editor.formatOnSave": true,
  // // 默认使用prittier作为格式化工具
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[javascriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescriptreact]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[vue]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  // 操作时作为单词分隔符的字符
  "editor.wordSeparators": "`~!@#%^&*()=+[{]}\\|;:'\",.<>/?",
  // 一个制表符等于的空格数
  "editor.tabSize": 2,
  // 行尾字符
  "files.eol": "\n"
}
```

## Prettier 配置

### 如果只使用 Prettier 不使用 eslint

> Prettier 主要是为了代码风格的规范或统一，例如单引号还是双引号，每行最大长度，等号左右空格，使用 tab 还是 空格等等

1、在 VSCode 中安装[Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)插件

2、新增`.prettierrc.js`文件

```js
module.exports = {
  // 超过多少字符后换行
  printWidth: 120,
  // 使用tab缩进还是空格
  useTabs: true,
  // 缩进
  tabWidth: 2,
  // 行末分号
  semi: false,
  // 单引号
  singleQuote: true,
  // 是否使用尾逗号
  trailingComma: 'all', // 对象或数组末尾加逗号
  // > 标签放在最后一行的末尾，而不是单独放在下一行
  jsxBracketSameLine: false,
  // (x) => {} 箭头函数参数只有一个时是否要有小括号。 alwaysz:总是带括号，avoid：省略括号
  arrowParens: 'avoid',
  // 仅在需要时为对象的键添加引号，如果至少一个键需要引号，则所有键都用引号
  quoteProps: 'consistent',
  // 在对象的大括号内添加空格
  bracketSpacing: true,
  // 将多行元素的结束标签放在最后一行的末尾，而不是单独占一行
  bracketSameLine: true,
  // 保持文本换行符的处理方式不变
  proseWrap: 'preserve',
  //html存在空格是不敏感的
  htmlWhitespaceSensitivity: 'ignore',
  // 在Vue文件中的<script>和<style>标签内缩进代码
  vueIndentScriptAndStyle: false,
  // 自动检测并使用文件中已有的行尾样式，作为行结束符
  endOfLine: 'auto',
  // 自动格式化嵌入的代码块
  embeddedLanguageFormatting: 'auto',
  // 每行单个HTML属性
  singleAttributePerLine: false,
};
```

3、新增`.prettierignore`文件

```
/dist/*
.local
.output.js
/node_modules/**

**/*.svg
**/*.sh

/public/*
```

#### idea 配置 Prettier

1、下载 prettier 插件
![](images/img-20240524160554.png)

2、配置

![](images/img-20240524160502.png)

3、代码的右键就可以手动格式化了，当然，可以设置保存时自动格式化。

![](images/img-20240524160505.png)

![](images/img-20240524160553.png)

### 如果使用了 eslint 规则校验

上面的配置均可忽略，包括不安装 vscode 的 Prettier 插件。

## ESLint 配置

> ESLint 主要是为了做代码检测，例如未使用的变量，未定义的引用，比较时使用 ===，禁止不必要的括号等等

### 如果只使用 Prettier 不使用 eslint

新增 `.eslintrc.cjs` 文件，并配置规则，关闭 prettier 的警告：

```js
/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution');

module.exports = {
  rules: {
    'prettier/prettier': 'off',
  },
};
```

### 如果使用了 eslint 规则校验

1、安装插件

> 需要安装 9 个，别怕都是开发才会使用，不会打包到生产环境

```

npm i -D eslint eslint-config-prettier eslint-plugin-prettier eslint-plugin-vue prettier vue-eslint-parser @typescript-eslint/eslint-plugin @typescript-eslint/parser @vue/eslint-config-typescript

```

2、新增 `.eslintrc.js` 文件，并配置规则：

```js
module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ['plugin:vue/vue3-essential', 'eslint:recommended', '@vue/typescript/recommended', 'plugin:prettier/recommended'],
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    // 避免同时使用多个三目运算符
    'no-nested-ternary': 'error',

    // 单行注释使用 `//`，注释应单独一行写在被注释对象的上方，不要追加在某条语句的后面
    'spaced-comment': ['error', 'always', { markers: ['/'] }],
    'line-comment-position': ['error', { position: 'above' }],

    // 未使用的变量
    '@typescript-eslint/no-unused-vars': 'warn',
    // 可以使用 any
    '@typescript-eslint/no-explicit-any': 'off',

    // 类型命名规则
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'interface',
        format: ['PascalCase'],
        custom: {
          regex: '^I[A-Z]',
          match: true,
        },
      },
      {
        selector: 'typeAlias',
        format: ['PascalCase'],
        custom: {
          regex: '^T[A-Z]',
          match: true,
        },
      },
      {
        selector: 'class',
        format: ['PascalCase'],
      },
      {
        selector: 'variable',
        modifiers: ['global', 'const'],
        format: ['PascalCase', 'UPPER_CASE'],
      },
      {
        selector: 'variable',
        format: ['camelCase'],
      },
      // 枚举需要以 Enum 开头
      {
        selector: 'enum',
        format: ['PascalCase'],
        custom: {
          regex: '^Enum[A-Z]',
          match: true,
        },
      },
    ],
    // 类名使用大驼峰
    '@typescript-eslint/class-name-casing': 'off',

    // 多行注释使用 /** ... */ 风格
    'multiline-comment-style': ['error', 'starred-block'],

    // 禁用组件名必须多个单词
    'vue/multi-word-component-names': 'off',

    'prettier/prettier': [
      'error',
      {
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
        trailingComma: 'es5',
        // > 标签放在最后一行的末尾，而不是单独放在下一行
        jsxBracketSameLine: false,
        // (x) => {} 箭头函数参数只有一个时是否要有小括号。 alwaysz:总是带括号，avoid：省略括号
        arrowParens: 'avoid',
        // Prettier 使用与你的项目中现有的换行符一致
        endOfLine: 'auto',
      },
    ],
  },
  // 添加 overrides，忽略vue文件中的命名规则
  overrides: [
    {
      files: ['*.vue'],
      rules: {
        '@typescript-eslint/naming-convention': [
          'warn',
          {
            selector: ['variable', 'function'],
            format: ['camelCase'],
          },
        ],
      },
    },
  ],
};
```

然后，可以在 package.json 中添加下面指令，用来检测和修复代码的 eslint 错误：

```json
"scripts": {
  "lint": "eslint --ext .js,.ts,.vue --ignore-path .gitignore src/",
  "lint:fix": "eslint --ext .js,.ts,.vue --ignore-path .gitignore src/ --fix"
}
```

::: warning
需要注意的是，`eslint --fix` 不能修复所有的问题。它主要用于自动修复那些可以安全地更改的问题，例如缩进、空格、换行符、引号类型等。这些问题通常与代码格式有关，而不涉及代码逻辑。

对于一些可能需要更复杂的逻辑或代码结构调整的问题，如注释位置、变量未使用、变量未声明等，eslint 通常无法自动修复。这是因为自动修复这些问题可能会引入新的错误或改变程序的行为，所以需要开发者手动检查并修复这些问题。

:::

或者使用`ctrl+shift+p`打开 vscode 控制台，通过`ESLint: Fix all auto-fixable Problems` 进行修复当前代码。

VSCode 的 ESLint 插件中的 `ESLint: Fix all auto-fixable Problems` 命令底层调用的就是 `eslint --fix` 指令。

当你在 VSCode 中使用这个命令时，插件会针对当前打开的文件运行 eslint --fix，并尝试自动修复所有可以修复的问题。这与在命令行中使用 npm run lint:fix 类似，只是作用范围限于当前打开的文件，而不是整个项目。
