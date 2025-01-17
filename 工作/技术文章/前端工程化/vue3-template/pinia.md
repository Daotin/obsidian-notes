# 配置 Pinia

## 配置步骤

1、安装依赖

```
npm install pinia
```

2、配置 Pinia

在 `src/stores/index.ts` 中创建一个 Pinia。

```ts
import { createPinia } from "pinia";

const pinia = createPinia();

export default pinia;

export * from "./modules/app";
```

3、创建 store

在 src/stores/modules/app.ts 创建一个 store

```ts
import { defineStore } from "pinia";

import store from "@/stores";

export const useAppStore = defineStore("app", {
  state: () => ({
    count: 0,
  }),
  getters: {
    doubleCount: (state) => state.count * 2,
  },
  actions: {
    increment() {
      this.count++;
    },
    randomizeCount() {
      this.count = Math.round(100 * Math.random());
    },
  },
});

// 在组件外使用store
// 比如如果在其他ts，js文件中使用appStore，需要使用useAppStoreWithOut，而不是useAppStore
export const useAppStoreWithOut = () => useAppStore(store);
```

4、然后在 `main.ts` 中引入 Pinia：

```ts
import pinia from "./stores";
//...
app.use(pinia);
```

5、使用的时候：

```html
<script setup lang="ts">
  import { useAppStore } from "@/stores";

  const appStore = useAppStore();
  // 获取用户信息
  console.log(appStore.userInfo);
</script>
```

## Pinia 配置说明

### 原始方法

最简单的就是 `window._store = {}`，但是缺点是不方便管理，而且不是响应式的。所以需要 Vuex 或 Pinia。

目前有两种选择，Vuex 和 Pinia。但是 Vue3 更推荐 Pinia，号称是 Vuex5。

**Vuex vs Pinia**

Vuex 由于在 API 的设计上，对 TypeScript 的类型推导的支持比较复杂，用起来很是痛苦。因为我们的项目一直用的都是 JavaScript，你可能感触并不深，但对于使用 TypeScript 的用户来说，Vuex 的这种问题是很明显的。

为了解决 Vuex 的这个问题，Vuex 的作者最近发布了一个新的作品叫 Pinia，并将其称之为下一代的 Vuex。Pinia 的 API 的设计非常接近 Vuex5 的提案，首先，Pinia 不需要 Vuex 自定义复杂的类型去支持 TypeScript，天生对类型推断就非常友好，并且对 Vue Devtool 的支持也非常好，是一个很有潜力的状态管理框架。

参考链接：https://juejin.cn/post/7030999394518302727

### 目录结构

```
├── stores
│   ├── modules           // 各模块全局状态
│   │   ├── app.ts        // 全局共用的状态
│   |   └── xxx.ts        // 其他模块共用的状态
│   └── index.ts
```

- index.ts：供暴露出全局状态
- app.ts：整个项目共用的状态
- xxx.ts：某个模块共用的状态

### app.ts 需要统一存储的状态

公共数据：

- `token`
- `userInfo`用户信息
- `menuList`菜单列表
- `permissions`权限清单（功能按钮的权限）
- …

公共方法：

- 登录 login
- 退出 logout
- 获取用户信息 getUserInfo
- 获取菜单和权限 getMenuList
- ...

代码示例：

```ts
import { defineStore } from "pinia";
import _ from "lodash";
import router from "@/router";
import store from "@/store";
import request from "@/utils/request";
import { filterMenus, getPermissions, getMenuIdUrl } from "@/utils/menu";
import { TokenName } from "@/config/const";
import { localMng, sessionMng } from "@/utils/storage-mng";
import { IUser, IMenu } from "@/model/common";

interface IState {
  token: string; // 请求token
  sideCollapse: boolean; // 菜单是否折叠
  userInfo: IUser; // 用户信息
  menuList: IMenu[]; // 菜单列表（后台返回）
  menuIdUrl: Object; // id-url map
  menuUrlId: Object; // url-id map
  permissions: string[]; // 权限清单
}

export const useAppStore = defineStore("app", {
  state: (): IState => ({
    token: localMng.getItem(TokenName),
    sideCollapse: localMng.getItem("sideCollapse"),
    userInfo: {},
    menuList: [],
    menuIdUrl: {},
    menuUrlId: {},
    permissions: [],
  }),

  getters: {
    // 当前登录用户，是否是超级管理员
    isAdmin(state) {
      return state.userInfo.id === 1;
    },
  },
  actions: {
    setSideCollapse(collapse: boolean) {
      this.sideCollapse = collapse;
      localMng.setItem("sideCollapse", collapse);
    },
    // 登录
    async login(data) {
      const token = await window.$apis.common.login(data);
      this.token = token;
      localMng.setItem(TokenName, token);
      request.setHeader({
        Authorization: token,
      });
      await this.getUserInfo();
      router.push("/platform");
    },
    // 获取用户信息
    async getUserInfo() {
      this.userInfo = await window.$apis.common.getUserInfo();
      return Promise.resolve(this.userInfo);
    },
    // 获取菜单和权限
    async getMenuList(isreload = false) {
      if (this.menuList.length != 0 && isreload == false) return;
      const data = await window.$apis.common.getSysMenuNav();
      const menuList = filterMenus(data);
      const permissions = getPermissions(data);
      this.menuList = menuList;
      this.menuIdUrl = getMenuIdUrl(_.cloneDeep(menuList));
      this.menuUrlId = _.invert(this.menuIdUrl);
      this.permissions = permissions;
    },
    //  退出
    async logout(isRequest = true) {
      if (isRequest) {
        await window.$apis.common.logout();
      }
      console.log("logout");
      router.replace("/login");
      sessionMng.clear();
      localMng.removeItem(TokenName);
      request.setHeader({
        Authorization: "",
        teamId: "",
      });
      // 还原store
      this.$reset();
    },
  },
});

export const useAppStoreWithOut = () => useAppStore(store);
```

最后导出`useAppStore` 和`useAppStoreWithOut` 。

`useAppStoreWithOut` 主要是在非 Vue 中（比如一些 ts 文件中，是不能直接使用 useAppStore 的）来操作 state 的数据的。

### 数据持久化

可以使用插件：[pinia-plugin-persistedstate](https://www.npmjs.com/package/pinia-plugin-persistedstate)

> 问：store 里面存的无非是用户信息，菜单列表等，token 啥的存在 storage 里面。页面刷新后可以重新通过 token 获取用户信息和菜单列表，为什么需要`vuex-persistedstate`？

解答：像集中平台登录的，就需要保存 SSO 登录的状态，这种如果刷新界面，就会丢失，或者复制 url 在新标签页打开的情况下，也会没有 sso 登陆信息，所以需要保存在 localStorage 中。这种是需要使用数据持久化的。

哈哈终于找到应用场景了…
