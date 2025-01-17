# 配置路由 vue-router

## 配置步骤

1、安装插件

```
npm install vue-router@next
```

2、在 router/index.ts 中配置路由

```ts
import {
  createRouter,
  createWebHashHistory,
  type RouteRecordRaw,
} from "vue-router";
import HomeView from "../views/HomeView.vue";
import commonRoute from "./modules/common";

// 不需要鉴权的外部界面
const outerPaths: RouteRecordRaw[] = [
  // {
  //   path: "/",
  //   redirect: "/login",
  // },
  {
    path: "/",
    name: "home",
    component: HomeView,
    meta: {
      title: "首页",
    },
  },
  {
    path: "/about",
    name: "about",
    // route level code-splitting
    // this generates a separate chunk (About.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import("../views/AboutView.vue"),
    meta: {
      title: "关于",
    },
  },
  ...commonRoute,
];

// 需要鉴权的界面
const innerPaths: RouteRecordRaw[] = [
  // {
  //   name: "Portal",
  //   path: "/portal",
  //   redirect: "/welcome",
  //   component: () => import("@/layouts/platform/index.vue"),
  //   children: [...demoRoute],
  // },
];

const routes: RouteRecordRaw[] = [
  ...outerPaths,
  ...innerPaths,
  {
    path: "/:pathMatch(.*)*",
    redirect: "/error/not-found",
  },
];

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
});

// 全局路由守卫
router.beforeEach(async (to) => {
  const title = (to.meta && (to.meta.title as string)) || "";
  if (title) {
    document.title = title;
  }
  // const appStore = useAppStoreWithOut();

  // const token = localMng.getItem(TokenName);
  // console.log(token, to.path);
  // if (!token) {
  //   if (to.path !== "/login") {
  //     return "/login";
  //   }
  // } else {
  //   // 从后端获取菜单（保证菜单是最新的，因为有可能管理员会修改菜单权限）
  //   appStore.getMenuList();
  // }
});

export default router;
```

common.ts 文件：

```ts
import type { RouteRecordRaw } from "vue-router";

const route: RouteRecordRaw[] = [
  {
    name: "NotFound",
    path: "/error/not-found",
    component: () => import("@/views/common/NotFound.vue"),
    meta: {
      title: "页面丢失",
    },
  },
  {
    name: "Forbidden",
    path: "/error/forbidden",
    component: () => import("@/views/common/Forbidden.vue"),
    meta: {
      title: "无权限",
    },
  },
];

export default route;
```

3、在 main.ts 中引入 vue-router

```ts
import router from "./router";

app.use(router);
```

## 路由说明

### 目录结构

```
router
	- modules
		- common.ts
		- system.ts
		- 模块1.ts
		- 模块2.ts
	- index.ts
```

router 目录下有一个 index.ts 文件和 modules 文件夹。

modules 文件夹下放置各个模块的路由配置。

一般来说：

- common.ts 放置：error 页面，not-found 页面，forbidden 页面，欢迎页面等通用页面
- system.ts 放置：用户管理，角色管理，系统日志等系统相关的页面

其他就是各个模块的路由设置，比如路由`common.ts`，最后在 index.ts 中引入。

### index.ts 的配置

下面说下 index.ts 的配置。

首先是基本的路由配置，需要注意的是：

1. 路由我们分为两种，一种是不需要鉴权的外部界面，比如登录注册，错误页面等；一种是需要鉴权的，所以我们可以分为`outerPaths`和`innerPath`作为区分。
2. 我们其他模块的配置应该都是作为 Layout 框子的 children，这样框子（包含 header 和侧边栏的框子）只有一个，其他的模块都可以填充进去。
3. 所有一级路由会渲染在`App.vue`的`<router-view>`中，二级路由会渲染在 Layout 框子的`<router-view>`中

基本代码结构如下：

```ts
import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import Home from "@/views/home.vue";
import About from "@/views/about.vue";
import walletRoute from "./modules/wallet";
import demoRoute from "./modules/demo";
// 不需要鉴权的外部界面
const outerPaths = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    name: "login",
    path: "/login",
    component: () => import("@/views/login/Login.vue"),
    meta: {
      title: "登录",
    },
  },
];

// 需要鉴权的界面
const innerPaths = [
  {
    name: "Portal",
    path: "/portal",
    redirect: "/welcome",
    component: () => import("@/layouts/platform/index.vue"),
    children: [...demoRoute],
  },
  {
    name: "platform",
    path: "/platform",
    redirect: "/welcome",
    component: () => import("@/layouts/platform/index.vue"),
    children: [...walletRoute],
  },
];

const routes: Array<RouteRecordRaw> = [
  ...outerPaths,
  ...innerPaths,
  {
    path: "/:pathMatch(.*)*",
    redirect: "/error/not-found",
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
```

回到引入 common.ts，只需要使用`…commonRoute`的方式作为框子的 children 即可。

### meta 内容

- `title`：路由对应的中文名称，可以显示在面包屑上，或者标签页中
- `hiddenInBreadcrumb`：是否在面包屑上隐藏
- `hiddenInMenu`：是否在菜单上隐藏
- `parentPath`：父组件 url。一般详情页面会指定该属性，用于确定该详情页面的父页面是谁。目的有 2 个作用：
  - 菜单激活。当进入详情页是，左侧导航应该激活哪个菜单
  - 作为 keepAlive 判断使用
- `keepAlive`：是否需要开启 keepAlive，一般用于菜单的列表型界面

### 设置全局守卫

全局守卫一般用来：

- 判断用户是否已登录，未登录则跳转到登录页。
- 设置页面 title

:::tip
使用 axios 的响应拦截也可以，但是会先进入页面，调用接口后才跳转到登录页，体验不好。
:::

一般，用户登录后，会把 token 和个人信息放在 store 里面（token 也会放在 localStorage 中），我们只需要在全局守卫里面获取 token 然后判断即可。

在`export default router;`之前加入下面守卫代码：

```tsx
// 导航守卫
router.beforeEach(async (to) => {
  const title = (to.meta && (to.meta.title as string)) || "";
  if (title) {
    document.title = title;
  }
  const appStore = useAppStoreWithOut();

  const token = localMng.getItem(TokenName);
  console.log(token, to.path);
  if (!token) {
    if (to.path !== "/login") {
      return "/login";
    }
  } else {
    // 从后端获取菜单（保证菜单是最新的，因为有可能管理员会修改菜单权限，或者刷新界面后，store的内容消失）
    appStore.getMenuList();
    appStore.getUserInfo();
  }
});
```

### 路由守卫

路由守卫可以用在，当跳转到该路由时，进行鉴权判断，或者做一些其他操作。比如可以在跳转到商户页面是，如果还未认证时，显示特定界面。

```tsx{25-27}
import { RouteRecordRaw } from "vue-router";
import { useAppStoreWithOut } from "@/store";

const appStore = useAppStoreWithOut();

const route: RouteRecordRaw = {
  path: "/shop",
  component: () => import("@/layouts/platform/Platform.vue"),
  redirect: "/shop/list",
  meta: {
    title: "门店管理",
    icon: "merchant",
  },
  children: [
    {
      path: "/shop/list",
      component: () => import("@/views/shop/list.vue"),
      meta: {
        title: "门店信息",
        parentPath: "/shop",
        hiddenInBreadcrumb: false,
        hiddenInMenu: false,
      },
      // 路由守卫
      beforeEnter() {
        if (!appStore.isCertified) return "/error/not-verified";
      },
    },
  ],
};

export default route;
```
