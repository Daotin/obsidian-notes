## 安装 Element Plus 组件库

```bash
npm install element-plus -S
```

## 设置为生产环境按需加载，开发环境全量加载

安装插件

```bash
npm install unplugin-auto-import unplugin-element-plus unplugin-vue-components unplugin-icons -D
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

## 配置unplugin-icons

[unplugin-icons](https://github.com/antfu/unplugin-icons) 是一个用于按需自动导入图标的 Vite 插件。它允许我们以组件的形式轻松使用来自不同图标集的图标，无需手动导入或担心打包体积问题。

本项目已集成 unplugin-icons，可以直接使用多种图标集，特别是 Element Plus 图标。

### 安装

本项目已经安装了以下依赖：

```bash
# 核心依赖
npm install -D unplugin-icons
```

### 配置

已在 `vite.config.ts` 中配置如下：

```typescript
// 引入 unplugin-icons
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'

// 在 plugins 中配置
plugins: [
	// ... 其他插件

	// 自动导入
	AutoImport({
		imports: ['vue'],
		resolvers: [
			ElementPlusResolver(),
			// 自动导入图标组件
			IconsResolver({
				prefix: 'Icon',
			}),
		],
	}),

	// 组件注册
	Components({
		dts: true,
		resolvers: [
			// 自动注册图标组件
			IconsResolver({
				enabledCollections: ['ep'], // 启用 Element Plus 图标集
				prefix: 'icon',
			}),
			// ... 其他 resolvers
		],
	}),

	// Icons 插件
	Icons({
		autoInstall: true,
	}),

	// ... 其他插件
]
```

### 使用方法

#### 1. 组件式使用（推荐）

直接在模板中使用图标组件，无需导入：

```vue
<template>
	<!-- Element Plus 图标 -->
	<icon-ep-edit />
	<icon-ep-delete />
	<icon-ep-search />
	<icon-ep-arrow-down />

	<!-- 格式: icon-{集合}-{图标名} -->
</template>
```

#### 2. 手动导入使用

也可以手动导入图标：

```vue
<script setup>
// 导入格式: ~icons/{集合}/{图标名}
import IconEpEdit from '~icons/ep/edit'
import IconEpDelete from '~icons/ep/delete'
</script>

<template>
	<IconEpEdit />
	<IconEpDelete />
</template>
```

### 图标集合

支持的流行图标集包括：

- `ep`: Element Plus 图标
- `mdi`: Material Design 图标
- `carbon`: Carbon 图标
- `ant-design`: Ant Design 图标
- `fa`: Font Awesome 图标
- `ri`: Remix 图标
- `tabler`: Tabler 图标
- 更多图标集和预览请访问 [Icônes](https://icones.js.org/) 或 [Iconify](https://icon-sets.iconify.design/)

```typescript
// vite.config.ts 中修改 enabledCollections
IconsResolver({
	enabledCollections: ['ep', 'mdi', 'carbon', 'fa'],
	prefix: 'icon',
})
```

> 当项目启动的时候，会自动下载所配置的图标集。

### 动态图标

可以使用动态组件实现图标的动态渲染：

```vue
<script setup>
import { ref, computed } from 'vue'

const iconName = ref('edit')
const dynamicIcon = computed(() => `icon-ep-${iconName.value}`)
</script>

<template>
	<component :is="dynamicIcon" />

	<button @click="iconName = 'delete'">切换图标</button>
</template>
```

### 自定义本地图标

如需使用自定义图标，推荐使用项目中已配置的 SVG 精灵图功能：

```vue
<svg-icon name="icon-name" />
```
