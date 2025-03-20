
> [!tip] 首先思考优化的流程，思路很重要！应该如何一步步思考去优化，而不是死记硬背。不同的场景有不同的配置！

打包构建优化，无非就是**构建速度优化**和**打包体积优化**。

相比之下，当然是打包体积优化优先，所以先做打包体积优化。

## 打包体积优化

vite默认的build打包，会把所有的模块单独打包，形成很多1kb这种小的chunk，但是对于HTTP/1，同一个域名下，网络请求的并发是6个，所以会影响加载的速度。

所以，首先会对代码进行合并打包。

如何合并？

如果合并过于简单（比如只有vendor和index），那么首屏加载时间又会过长，而且无法做到资源缓存（每次contenthash都会变）。

所以最佳合并思路是：**将第三方依赖与业务代码分开打包**
- 对于依赖：
	- 将变动频率低的大型依赖（如 Vue、Element Plus 等）
		- 后台管理系统：推荐 `external`（外链 rollup-plugin-external-globals，inject自动引入）
		- ToC 应用/不能连外网：单独分包（如果单独分包还是很大，考虑按需导入而非全量导入）
	- 将小型依赖适当合并，减少 HTTP 请求数量（一般来说，合并后的文件**压缩后**大小在**30-50 KB**左右比较合理，若支持 HTTP/2可不合并）
- 对于业务代码
	- 对于首屏：最好请求总数 **< 6 个**（含 JS/CSS/图片），并且满足**压缩后**大小在**30KB~50KB**之间。
		- 可以使用`vite-plugin-webpackchunkname`或者文件路径的形式，比如 id.includes('src/pages/A') 方式。
	- 其他页面按照`默认方式`，但是控制**压缩后**大小在**30KB~50KB**之间。
	- 对于components组件库和utils工具库，尽量合并处理。

然后还有一些通用的配置：
- 打包后的contenthash文件名，文件夹分类
- gzip/br压缩（Brotli打包后比gzip体积更小，但是需要Nginx 配置 Brotli 支持，配置 brotli_static on; 并启用 Content-Encoding: br	让浏览器正确解析）
	- js，css，图片压缩
- css tree shaking
- production 环境不生成 SourceMap
- 删除生产环境 console.log，debugger
- ~~动态 polyfill （Vite 默认不会进行 polyfill，如需兼容旧版浏览器，可以使用 `@vitejs/plugin-legacy` 插件或手动引入 `core-js`。）~~



示例配置：
```js
// vite.config.js示例
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // 大型依赖单独打包
          if (id.includes('node_modules/vue/')) {
            return'vue';
          }
          if (id.includes('node_modules/element-plus/')) {
            return 'element-plus';
          }
          // 小型依赖合并
          if (id.includes('node_modules/') && !id.includes('big-lib')) {
            return 'vendor';
          }
          // 业务模块按页面拆分
          if (id.includes('src/pages/')) {
            const matchResult = id.match(/src\/pages\/([^/]+)/);
            if (matchResult) {
              return `page-${matchResult[1]}`;
            }
          }
          // 组件库合并
          if (id.includes('src/components/')) {
            return 'components';
          }
          // 工具库合并
          if (id.includes('src/utils/')) {
            return 'utils';
          }
        },
        // 使用contenthash确保缓存优化
        entryFileNames:'js/[name].[hash].js',
        chunkFileNames:'js/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]'
      }
    },
    // 启用terser压缩
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  },
  plugins: [
    // gzip压缩
    viteCompression({
      algorithm: 'gzip',
      threshold: 10240// 大于10kb才压缩
    }),
    // 可选：br压缩
    viteCompression({
      algorithm: 'brotliCompress',
      threshold: 10240
    })
  ]
})
```

## 构建速度优化

- 使用高版本的 vite 和 Node.js
- 并行构建
- 并行压缩
- 开启构建缓存



