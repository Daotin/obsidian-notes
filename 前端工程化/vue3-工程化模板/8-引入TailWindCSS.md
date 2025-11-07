::: tip
更多关于 tailwindcss 的介绍，用法，性能等，参考：https://mp.weixin.qq.com/s/C9-611RHvUOhsAJi9J0bYw
:::

# 引入 TailWindCSS

1、安装插件

```
npm install tailwindcss@latest postcss@latest autoprefixer@latest -D
```

2、新增`postcss.config.js`文件

将 `tailwindcss` 和 `autoprefixer` 添加到您的 PostCSS 配置中：

```js
// postcss.config.js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

3、在 main.less 中引入即可

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

4、在 main.ts 中引入 main.less 文件

```js
import './assets/main.less';
```

5、通过`npx tailwindcss init`，生成 tailwind 配置文件：

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,vue,jsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

## ~~使用 WindiCSS 替换 TailwindCSS~~<Badge type="danger" text="Deprecate" />

::: danger WindiCSS 官方已经不再维护!
查看链接：[Windi CSS is Sunsetting](https://windicss.org/posts/sunsetting.html)
:::

## tailwind 个性化配置

> tailwindcss 默认全量配置：[https://github.com/tailwindlabs/tailwindcss/blob/master/stubs/config.full.js](https://github.com/tailwindlabs/tailwindcss/blob/master/stubs/config.full.js)

### 伪类写法

修改器 hover, focus, before, after, group, important

- 伪类选择器:`hover`,`focus`,`active`
- 子选择器:`first`,`last`,`even`,`odd`
- 父状态选择器:`group`<- tailwindcss 特有
- 伪元素:`before`,`after`
- `!important`修改器

```HTML
<div class="hover: font-bold"></div>
```

### 响应式设计

对于一些需要 media query 实现的响应式样式，tailwindcss 提供了一组默认规则，使用 `min-width` 实现的断点功能实现响应式方案。

![](../images/2023-05-18-14-57-59.png)

```HTML
 <div className="flex flex-wrap sm:flex-nowrap"/>
```

宽度也是可以配置的：

```
screens: {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
},
```

### 自定义样式类

> 其实可以使用公共类替换。

如果想在项目内添加自己实现的类，例如如下：

```CSS
.article {
   position: relative;
   color: orange;
   line-height: 1.2;
   font-family: ...;
   @apply text-ellipsis;
 }

 .article1{
   @apply inline-block h-12 w-12 font-bold flex flex-col itemscenter;
 }
```

这里 tailwind 建议写在主文件 (具有 tailwind 指令的文件) 并放在对应的 layer 下，所以需要改成如下

```CSS
 @tailwind base;
 @tailwind components;
 @tailwind utilities;

 @layer base {
    h1 {
      @apply text-2xl font-bold;
    }
}

 @layer components {
  .article {
       position: relative;
       color: orange;
       line-height: 1.2;
       font-family: ...;
       @apply text-ellipsis;
    }
    .article1 {
       @apply inline-block h-12 w-12 font-bold flex flex-col itemscenter;
    }
 }
```

通过@layer 和 @apply 就能扩展内置原子 class。

使用：

```HTML
 <h1 class="article absolute"></h1>
```

### 插件 plugin

其实上面那个 `@layer` 和 `@apply` 就能扩展内置原子 class。

但如果你想**跨项目复用**，那可以开发个 tailwind 插件：

自定义一个`tailwind.plugin.js`文件：

```JavaScript
const plugin = require('tailwindcss/plugin');

module.exports = plugin(function({ addUtilities }) {
    addUtilities({
        '.aaa': {
            background: 'blue',
            color: 'yellow'
        }
    })
})

```

在 tailwind.config.js 里引入：

```JavaScript
/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: ["./src/**/*.html", "./src/**/*.vue", "./src/**/*.js"],
  content: [],
  theme: {
    extend: {
    }
  },
  plugins: [
    require("./tailwind.plugin.js")
  ]
};

```

使用：

```HTML
 <div class="aaa"/>
```

### tailwind 3.0 新特性

> 参考：[https://segmentfault.com/a/1190000041150879](https://segmentfault.com/a/1190000041150879)

JIT 模式

- 闪电般的快速构建时间
- 能够使用`[]`语法
- 您的 CSS 在开发和生产中是相同的，因为是即时生成的
- 开发中更好的浏览器性能

>[!warning]
> 从 Tailwind CSS v2.1 开始，新的 JIT 引擎就包含在 Tailwind CSS 本身中，因此您不再需要 `@tailwindcss/jit` 包。但是在 2.x 中需要在写上下面内容：
>
> ```JavaScript
> module.exports = {
>    mode: 'jit',
>   // ...
> }
> ```
> 
> 而在 v3.0 中，Tailwind 内置了 JIT，无需在配置文件里面声明 JIT 模式，默认就是按需构建、可使用任意辅助类、开发和生产构建方式与产物统一，避免了不一致性、还获得了极大的性能优化。


比如：临时设置一些值，可以用 `[]` 语法。

- `w-[100px]` -> `width: 100px`
- `text-[#333]`
- `top-[10px]`
- `bg-[#999]`

其他的还有：

- 所有的颜色都开箱即用
- 支持有颜色的阴影
- 滚动捕捉
- 多列布局
- 原生的表单控制样式
- 好看的下划线样式
- RTL 与 LTR 修饰符
- 任意值辅助类支持
- 使用 CDN 来使用 Tailwind
- ...

## tailwindcss 2.x 配置文件

> 可直接复制后，按需修改使用！

```js
/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');
const colors = require('tailwindcss/colors');
const plugin = require('tailwindcss/plugin');
/**
 * 生成 tailwindcss 的 属性值
 * @param {number} n 生成的个数
 * @param {number} per 倍率
 * @param {string} unit 单位
 */
function generateValue(n = 100, per = 5, unit = 'px') {
  let obj = {};
  for (let i = 1; i <= n; i++) {
    obj[i] = `${i * per}${unit}`;
  }
  return obj;
}
/**
 * 个性化 tailwindcss 的 属性
 * 参考：https://juejin.cn/post/7074754321279090718
 */
module.exports = {
  purge: ['./src/**/*.html', './src/**/*.vue', './src/**/*.js'],
  mode: 'jit',
  content: [],
  theme: {
    /**
     * 直接在 theme 属性中设置的基础类会完全覆盖原有的预设基础类
     * 比如：colors会覆盖colors类，而非只是覆盖其中的属性（所以一般不在这里面写）
     * */
    fontSize: {
      //字号和行高，12号字体1行高
      // sm: ["24px", "24px"], //最小12，12一下不能保证
      // base: ["28px", "40px"],
      // lg: ["32px", "48px"] // 以上三种为项目中主要字号，不以数字命名，其他特殊字号以数字命名
    },
    /**
     * theme函数：如果在定制 theme 选项中的某个属性时，希望访问当前 theme 选项的其他属性的基础类，可以使用函数的方式（最后返回表示基础类的对象）
     * 注意：该函数只能用于 theme 选项下的一级属性，而不能直接用于设置次级属性
     */
    backgroundColor: (theme) => theme('colors'),
    /**
     * tabSize给plugin中的matchUtilities使用
     */
    tabSize: {
      1: '1',
      2: '2',
      4: '4',
      8: '8',
    },
    /**
     * 在 theme 属性的 extend 属性下添加的基础类会以扩展添加新值的方式来添加自定义基础类（仍保留默认的基础类）
     */
    extend: {
      // spacing使用：padding, margin, width, height, maxHeight, gap, inset, space, and translate
      spacing: {
        ...generateValue(),
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
      },
      // 使用示例：class="bg-gray text-blue"
      // 如果希望在 HTML 页面使用一次自定义的任意颜色，可以通过 [color] 的方式来实现: class="bg-[#1da1f2]"
      colors: {
        ...colors,
        blue: '#1890ff',
        purple: '#a37ae8',
        orange: '#fa8564',
        green: '#2bd99f',
        yellow: '#ffd85c',
        // 使用示例：class="bg-gray-333"
        gray: {
          DEFAULT: '#ccc', // 不带有后缀时，其默认的样式
          333: '#333',
          666: '#666',
          999: '#999',
        },
      },
      // 使用示例：class="rounded-5"
      borderRadius: generateValue(100, 1),
      /**
       * 如果希望获取默认基础类的值，可以通过导入 tailwindcss/defaultTheme 来获取
       */
      fontFamily: {
        sans: ['Lato', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  /**
   * 禁止对某些核心插件的基础类进行编译
   */
  corePlugins: {
    opacity: false, // 禁止编译生成 opacity 基础类相应的样式
  },
  /**
   * plugins 选项让我们可以通过创建插件的方式，以 JS 而非 CSS 方式来新增基础类、状态变量等。
   * 参考：https://juejin.cn/post/7074754321279090718#heading-6
   */
  plugins: [
    plugin(function ({ addBase, addUtilities, matchUtilities, theme, addComponents, e, prefix, config }) {
      // 添加基础类，并将（重置）样式添加到 base 容器
      // 由于重置样式 reset 一般匹配的是一类元素，例如 div、h1 等，为它们设置预设样式，以便在不同的浏览器中具有相同的初始样式
      addBase({
        h1: { fontSize: theme('fontSize.2xl') },
        h2: { fontSize: theme('fontSize.xl') },
        h3: { fontSize: theme('fontSize.lg') },
      });

      // 样式添加到 components 容器
      // 在 components 容器中添加的基础类，它们的样式都更复杂，一般用于设置一些具体的视觉元素的，如按钮、表单等
      addComponents({
        '.btn': {
          padding: '.5rem 1rem',
          borderRadius: '.25rem',
          fontWeight: '600',
        },
        '.btn-blue': {
          backgroundColor: '#3490dc',
          color: '#fff',
          '&:hover': {
            backgroundColor: '#2779bd',
          },
        },
        '.btn-red': {
          backgroundColor: '#e3342f',
          color: '#fff',
          '&:hover': {
            backgroundColor: '#cc1f1a',
          },
        },
      });

      // 添加静态自定义样式
      addUtilities({
        '.daotin': {
          background: 'yellow',
          color: 'blue',
        },
      });
      // 添加动态自定义样式（乐意在 HTML 元素上使用时支持使用任意值，比如：tab-[13]，需要开启jit模式）
      matchUtilities(
        {
          tab: (value) => ({
            tabSize: value,
          }),
        },
        { values: theme('tabSize') }
      );
    }),
  ],
};
```

## tailwindcss 3.x 配置文件

TODO
