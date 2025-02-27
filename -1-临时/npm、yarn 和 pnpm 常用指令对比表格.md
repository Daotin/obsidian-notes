| 功能描述       | npm                                  | yarn                            | pnpm                              |
| ---------- | ------------------------------------ | ------------------------------- | --------------------------------- |
| 初始化项目      | `npm init`                           | `yarn init`                     | `pnpm init`                       |
| **安装所有依赖** | `npm install`                        | `yarn`                          | `pnpm install`                    |
| 安装指定包      | `npm install <package>`              | `yarn add <package>`            | `pnpm add <package>`              |
| 安装开发依赖     | `npm install <package> --save-dev`   | `yarn add <package> --dev`      | `pnpm add <package> --save-dev`   |
| 全局安装包      | `npm install -g <package>`           | `yarn global add <package>`     | `pnpm add -g <package>`           |
| 卸载包        | `npm uninstall <package>`            | `yarn remove <package>`         | `pnpm remove <package>`           |
| 更新包        | `npm update <package>`               | `yarn upgrade <package>`        | `pnpm update <package>`           |
| 查看过时的包     | `npm outdated`                       | `yarn outdated`                 | `pnpm outdated`                   |
| **运行脚本**   | `npm run <script>`                   | `yarn <script>`                 | `pnpm run <script>`               |
| 清理缓存       | `npm cache clean --force`            | `yarn cache clean`              | `pnpm store prune`                |
| 锁定依赖版本文件   | `package-lock.json`                  | `yarn.lock`                     | `pnpm-lock.yaml`                  |
| 添加精确版本依赖   | `npm install <package> --save-exact` | `yarn add <package> --exact`    | `pnpm add <package> --save-exact` |
| 安装生产环境依赖   | `npm install --production`           | `yarn install --production`     | `pnpm install --prod`             |
| 查看全局安装的包列表 | `npm list -g --depth=0`              | `yarn global list`              | `pnpm list -g --depth=0`          |
| 升级全局包      | `npm update -g <package>`            | `yarn global upgrade <package>` | `pnpm update -g <package>`        |
| 查看某个包的信息   | `npm info <package>`                 | `yarn info <package>`           | `pnpm info <package>`             |
| 强制重新安装依赖   | `npm install --force`                | `yarn install --force`          | `pnpm install --force`            |
| 执行一次性命令    | `npx <command>`                      | `yarn dlx <command>`            | `pnpm dlx <command>`              |

### `pnpm` 的不同版本对 `Node.js` 的版本有特定的依赖要求:

| Node.js 版本 | pnpm 8 | pnpm 9 | pnpm 10 |
| ---------- | ------ | ------ | ------- |
| Node.js 14 | ✅      | ❌      | ❌       |
| Node.js 16 | ✅      | ✅      | ❌       |
| Node.js 18 | ✅      | ✅      | ✅       |
