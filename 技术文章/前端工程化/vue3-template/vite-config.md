# vite 工程化配置

## 设置 @ 指向 src 目录

```ts
import { resolve } from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"), // 设置 `@` 指向 `src` 目录
    },
  },
});
```

::: warning
如果编辑器提示 path 模块找不到，则可以安装一下 `@types/node` -> `npm i @types/node -D`
:::

或者使用创建项目时，默认配置的写法：

```ts
resolve: {
  alias: {
    // fileURLToPath:函数确保百分比编码字符的正确解码，并确保跨平台的有效绝对路径字符串。
    // URL:如果url参数是相对 URL，则构造函数将使用url参数和可选的base参数作为基础
    '@': fileURLToPath(new URL('./src', import.meta.url)),
  },
},
```
