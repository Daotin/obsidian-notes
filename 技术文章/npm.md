- 使用私有NPM镜像
    - `npm set registry <https://npm.uino.cn`或者> `.npmrc` 文件配置 `registry=https://npm.uino.cn`
    - 请求NPM资源需要鉴权
        - npm login
            - 用户名
            - 密码为Token（个人Token，而非仓库Token）

### 查看某个包的文档

```bash
npm docs lodash
# or
npm home lodash
```

npm docs或者npm home命令在不接参数时，会在当前项目中，通过 package.json 文件中的homepage配置，来打开对应的地址。没有设置homepage属性时，npm 会继续寻找其中的repository属性，这时候打开的就是项目在 github 中的托管地址 url 拼接“#readme” (例如：[https://github.com/用户名/仓库名#readme](https://github.com/%E7%94%A8%E6%88%B7%E5%90%8D/%E4%BB%93%E5%BA%93%E5%90%8D#readme))，如果你repository属性也没设置，那么就会打开 npm 官网中包的所在地址，（例如：[https://www.npmjs.com/package/npm-limit）](https://www.npmjs.com/package/npm-limit%EF%BC%89)

当然，你也可以在npm docs/home后不接参数，这样就会直接打开当前项目的主页。

### 查看某个包的详细信息

```bash
npm v [package-name]
# or
npm view [package-name]
npm info [package-name]
npm show [package-name]
```

![](images/Pasted%20image%2020250118105109.png)
### 查看某个包的所有历史版本

```bash
npm v [package-name] versions
```