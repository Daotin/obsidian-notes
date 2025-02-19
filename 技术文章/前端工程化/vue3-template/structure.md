# 项目结构规范

项目结构规范包括文件命名、文件目录组织方式。

一个项目的文件结构就像是一本书的目录，是其他开发者了解项目最快的方法。代码的组织方式，也是项目架构设计的体现，比如如何划分视图层、控制层等。如果你是项目的创建者，那么你需要好好设计项目的文件结构和代码的组织方式，框架搭好了，再加砖添瓦就容易了。如果你是项目的维护者，那么你需要遵守项目的文件结构规范，风格统一了后续才好维护，同时也避免了公共函数\组件重复开发的问题。

项目结构看似很简单，但确是在项目创建初期要仔细思考的问题。项目结构混乱，就如同一本书的目录混乱，目录混乱那么你项目的“读者”能快速争取的理解项目的内容吗？

建立统一的目录结构和规范的命名方式有助于其他人快速找到需要的资源。

```
.
├── src
│   ├── apis
│   │   ├── modules
│   │   │   ├── common.ts      // 登录、退出等通用api
│   │   │   ├── system.ts      // 系统管理部分api
│   │   │   └── `xxx.ts`       // 按业务划分其他api
│   │   └── index.ts
│   ├── assets
│   │   ├── icons             // svg目录
│   │   ├── images            // 图片目录，建议按业务划分
│   │   ├── styles
│   │   │   ├── reset.less     // 全局重置样式
│   │   │   ├── element.less  // element相关重置样式
│   │   │   ├── common.less    // 项目通用样式
│   │   │   ├── main.less    // 汇总tailwind和其他样式，在main.ts中被引入
│   │   │   └── variable.less // 全局颜色变量
│   ├── components
│   │   ├── base              // 基础UI组件。功能比较单一的组件放在此目录，与其他功能0耦合性
│   │   └── business          // 复合型、业务型组件
│   ├── config
│   │   ├── const.ts          // 常量配置
│   │   ├── domain.ts         // 各种url配置，如requestUrl、imageUrl、wsUrl、cdnUrl
│   │   ├── enum.ts           // 前端枚举配置
│   │   └── regexp.ts         // 常用正则表达式
│   ├── directives
│   │   ├── modules
│   │   │   └── auth.ts       // 鉴权指令
│   │   └── index.ts          // 自定义指令全局注册
│   ├── hooks
│   │   ├── base              // 基础功能hook
│   │   └── business          // 业务功能hook
│   ├── layouts               // 框架布局相关
│   │   ├── components          // 基础框架，主要是用来渲染二级路由
│   │   │   ├── HeaderBar.ts
│   │   │   ├── SideBar.ts
│   │   │   └── MenuItem.ts
│   │   └── index.vue         // 比如门户、收银台等
│   ├── mock
│   │   ├── modules           // 按模块划分mock文件
│   │   └── index.ts          // 入口文件，引入各模板mock
│   ├── model
│   │   ├── common.ts         // 用户信息、菜单等公共interface
│   ├── router
│   │   ├── modules           // 各模板路由配置，输出：`RouteRecordRaw[]`类型
│   │   └── index.ts          // 路由入口文件，包含路由钩子
│   ├── store
│   │   ├── modules           // 各模块全局状态
│   │   └── index.ts
│   ├── utils                 // 工具函数库
│   ├── views                 // 页面部分
│   ├── App.vue               // 页面入口，一级路由在此处渲染
│   ├── main.ts               // 逻辑入口，各种全局引入在此处处理
|   └── env.d.ts              // 全局TS变量声明
├── package.json
├── .env                      // 环境变量
├── .env.development
├── .env.production
├── .prettierrc.js            // 代码格式化
├── tailwind.config.js        // tailwind配置
└── vite.config.js            // vite配置
```
