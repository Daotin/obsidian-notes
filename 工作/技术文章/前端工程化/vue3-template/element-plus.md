# 引入 ElementPlus 组件库

## 安装 Element Plus 组件库

```bash
npm install element-plus -S
```

## 设置为生产环境按需加载，开发环境全量加载

安装插件

```bash
npm install unplugin-auto-import unplugin-element-plus unplugin-vue-components -D
```

在 vite.config.ts 中配置：

```ts
//...

// Element Plus按需引入
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";

import ElementPlus from "unplugin-element-plus/vite";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    plugins: [
      // ...
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        // 生产环境按需导入
        resolvers: mode !== "development" ? ElementPlusResolver() : undefined,
      }),
      // 开发环境完整引入element-plus
      {
        name: "dev-auto-import",
        transform(code, id) {
          if (mode === "development" && /src\/main.ts$/.test(id)) {
            return {
              code: code.replace(
                `app.mount("#app")`,
                `import ElementPlus from 'element-plus';import 'element-plus/dist/index.css';app.use(ElementPlus);app.mount("#app")`
              ),
              map: null,
            };
          }
        },
      },
      // 解决ElementPlus非标签元素丢失样式的问题
      ElementPlus(),
    ],
  };
});
```
