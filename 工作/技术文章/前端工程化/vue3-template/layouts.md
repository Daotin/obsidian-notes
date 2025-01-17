# 页面布局 layouts

## 目录结构

```
├── layouts
│   ├── HeaderBar.vue         // 头部 header
│   |── SideBar.vue           // 侧边栏
│   |── MenuItem.vue          // 侧边栏菜单
│   └── index.vue             // 入口
```

- `HeaderBar`：主要是展示头部 header，以及菜单的收起和展开
- `SideBar`：侧边框，包裹着 MenuItem 菜单
- `MenuItem`：渲染具体的菜单
- `index`：入口文件，里面需要有 router-view 来渲染所有页面

在路由中，我们得页面都在 layouts 二级之下，所以路由配置如下：

```ts
// 需要鉴权的界面
const innerPaths: RouteRecordRaw[] = [
  {
    name: "Portal",
    path: "/portal",
    // redirect: "/welcome",
    component: () => import("@/layouts/index.vue"),
    children: [...commonRoute],
  },
];
```

具体可以看代码就能理解。
