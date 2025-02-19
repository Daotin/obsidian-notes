|              |                                      |                                       |                                                                                     |
| ------------ | ------------------------------------ | ------------------------------------- | ----------------------------------------------------------------------------------- |
| **操作描述**     | **npm 指令**                           | **Yarn 指令**                           | **关键差异说明**                                                                          |
| **初始化项目**    | `npm init`                           | `yarn init`                           | 功能相同，交互式创建`package.json`                                                            |
| **安装全部依赖**   | `npm install`                        | `yarn install` 或 `yarn`               | Yarn默认并行下载，速度更快；自动生成/更新`yarn.lock`锁定版本                                              |
| **添加生产依赖**   | `npm install <package> --save`       | `yarn add <package>`                  | Yarn无需显式添加`--save`，默认记录到`dependencies`                                              |
| **添加开发依赖**   | `npm install <package> --save-dev`   | `yarn add <package> --dev`            | Yarn支持`-D`简写（`yarn add <package> -D`）                                               |
| **全局安装包**    | `npm install -g <package>`           | `yarn global add <package>`           | Yarn通过`global`前缀区分全局操作                                                              |
| **更新指定依赖**   | `npm update <package> --save`        | `yarn upgrade <package>`              | Yarn通过`upgrade`命令更新版本，默认更新到语义化版本允许的最新范围                                             |
| **卸载依赖**     | `npm uninstall <package> --save`     | `yarn remove <package>`               | Yarn无需`--save`，自动从`package.json`移除记录                                                |
| **清除缓存**     | `npm cache clean --force`            | `yarn cache clean`                    | Yarn缓存机制更高效，支持离线安装                                                                  |
| **运行自定义脚本**  | `npm run <script>`                   | `yarn run <script>` 或 `yarn <script>` | Yarn支持直接省略`run`（如`yarn serve` vs `npm run serve`）                                   |
| **检查过期依赖**   | `npm outdated`                       | `yarn outdated`                       | 功能相同，输出格式略有差异                                                                       |
| **锁定文件生成**   | 自动生成`package-lock.json`              | 自动生成`yarn.lock`                       | Yarn的锁定文件格式更严格，确保跨环境安装一致性                                                           |
| **强制重新安装依赖** | `rm -rf node_modules && npm install` | `yarn install --force`                | Yarn通过`--force`参数强制重新拉取所有包                                                          |
| **切换镜像源**    | `npm config set registry <url>`      | `yarn config set registry <url>`      | 两者命令结构相似，常用淘宝源：`[https://registry.npmmirror.com ](https://registry.npmmirror.com )` |