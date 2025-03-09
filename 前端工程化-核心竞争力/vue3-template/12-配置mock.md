## 配置步骤

1、安装依赖

```
npm i mockjs
```

2、新增 mocks/index.ts 文件

```ts
import Mock from "mockjs";
import "./modules/common";

//延时数据返回
Mock.setup({
  timeout: "100-1000",
});
```

以及每个模块的 mock 文件，以 common 为例，新增文件 `src/mocks/modules/common.ts`：

```ts
import Mock from "mockjs";

// 定义通用的成功返回值
export const basicSuccess = () => {
  return {
    code: 200,
  };
};

const getUserInfo = () => {
  return Mock.mock({
    code: 200,
    body: {
      id: 1,
      userName: "@email",
      email: "@email",
      mobile: /^1[345789]\d{9}$/,
      createdTime: '@datetime("yyyy-MM-dd HH:mm:ss")',
    },
  });
};

// 拦截 Ajax 请求，返回模拟的响应数据。
Mock.mock(/sys\/users\/info/, "post", getUserInfo);
Mock.mock(/sys\/login/, "post", basicSuccess);
```

3、最后在 main.ts 中引入即可：

```ts
import "./mocks";
```

4、也可以在 vite.config.ts 中配置，在开发环境下自动引入，生产环境不引入

```ts{10}
{
  name: 'dev-auto-import',
  transform(code, id) {
    if (mode === 'development' && /src\/main.ts$/.test(id)) {
      return {
        code: code.replace(
          `app.mount("#app")`,
          `import ElementPlus from 'element-plus';
            import 'element-plus/dist/index.css';
            import './mocks';
            app.use(ElementPlus);
            app.mount("#app")`
        ),
        map: null,
      }
    }
  },
}
```

## 配置说明

在项目开发前期，后端接口还没好的时候，前端需要根据接口文档，自己 mock 数据来进行业务开发。

最后的效果就是在联调的时候，只需要很小的改动（屏蔽掉 mock）就可以使用后端数据。

### 目录结构

```ts
├── mocks
│   ├── modules           // 各模块mock
│   │   ├── common.ts        // 全局共用的mock
│   |   └── xxx.ts        // 其他模块的mock
│   └── index.ts
```

目录说明：

- `index.ts`：引入 mock 和其他模块的 mock
- `common.ts`：可以放一些登录，注册，获取用户信息等的 mock

## 其他工具推荐

1、使用[vite-plugin-mock](https://github.com/vbenjs/vite-plugin-mock)代替Mockjs

vite-plugin-mock是专为Vite设计的mock插件，主要特点：

1. 与Vite完全集成，利用Vite的开发服务器
2. 支持开发和生产环境的配置分离
3. 基于connect中间件实现，不修改请求路径
4. 内部实际上也使用了MockJS的数据模板功能
5. 支持热更新

与Mockjs的区别如下：
- 集成方式：MockJS需要手动引入和配置，vite-plugin-mock作为Vite插件直接集成
- 实现原理：MockJS通过重写XMLHttpRequest来拦截请求，vite-plugin-mock利用Vite开发服务器中间件
- 使用场景：MockJS可用于任何前端项目，vite-plugin-mock专为Vite项目设计
- 热更新支持：vite-plugin-mock支持热更新，修改mock文件后自动生效
- 开发生产环境分离：vite-plugin-mock提供了更好的环境隔离机制

**最大的区别可能就是，mockjs的请求，不会再Network中显示，但是vite-plugin-mock会显示（基于connect中间件实现），可能更方便调试。但是需要额外安装一个依赖。**

因此，没必要使用vite-plugin-mock。

2、[just mock](https://just-mock.vercel.app/) 是一个浏览器插件，在代码中什么都不需要更改，只需要添加相应的接口和数据即可实现拦截。

插件安装好后添加相应的域名就可以拦截到相应的请求。接着进行相应的编辑添加对应的 mock 数据就好。

浏览器插件原理和 Better-mock 是一样的，但会更加轻便，无需融入到代码中。两者的原理是一样的，都是在网络请求前重写了全局的 xhr 和 fetch ，具体可以参考 油猴脚本重写fetch和xhr请求。




