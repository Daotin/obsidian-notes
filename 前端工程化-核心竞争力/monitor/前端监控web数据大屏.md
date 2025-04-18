> 目前demo页面，演示了错误的收集，sourcemap的还原，rrweb录屏播放，用户行为栈展示。
>

错误的收集：
![](images/Pasted%20image%2020250418102204.png)


sourcemap的还原：

![](images/Pasted%20image%2020250418102236.png)
rrweb录屏播放：
![](images/Pasted%20image%2020250418102301.png)


用户行为栈展示：
![](images/Pasted%20image%2020250418102306.png)





## 数据展示
### 性能指标汇总
TODO

### 错误列表
使用列表展示即可。

### pv uv统计
TODO

## 错误还原
### sourcemap错误还原
实现原理：

1. 根据上报的错误数据，使用 `ErrorStackParser` 库解析 JavaScript 错误堆栈（提取每一帧的信息：文件路径、行号、列号、函数名）
2. 用户为每个堆栈帧上传对应的 SourceMap 文件，使用 `source-map-js` 库解析 SourceMap 文件
3. 通过source-map-js库的SourceMapConsumer 类，调用 originalPositionFor 方法，传入压缩代码的行号和列号，获取原始代码的对应位置（文件名、行号、列号、函数名）
4. 如果 SourceMap 包含源代码内容，可通过 sourceContentFor 方法提取原始文件内容，并截取错误行附近的代码片段（如前后 5 行）。



**使用的工具：**

+ **error-stack-parser**
    - **作用**：解析 JavaScript 错误堆栈，生成堆栈帧数组。
    - **用法**：ErrorStackParser.parse(error)，返回包含文件名、行号、列号等的对象数组。
+ **source-map**** 或 ****source-map-js**
    - **作用**：加载和解析 SourceMap 文件，提供位置映射功能。
    - **用法**： 
        1. const consumer = new SourceMapConsumer(sourceMapData) 创建消费者实例。
        2. consumer.originalPositionFor({ line, column }) 获取原始位置。
        3. consumer.sourceContentFor(source) 获取源码内容（若存在）。



### rrweb录屏
#### **rrweb 的作用与原理**
+ **作用**：rrweb（Record and Replay the Web）是一个用于录制用户在网页上的操作（如点击、输入、滚动等）并回放的开源工具，常用于错误复现、用户行为分析等场景。
+ **原理**： 
    - **录制**：rrweb 通过监听 DOM 变化和用户交互事件，记录网页的状态快照和事件序列（包括 DOM 结构、CSS 样式和交互操作）。
    - **回放**：rrweb 根据录制的事件序列，使用 rrweb-player 重现 DOM 变化和用户操作，模拟用户行为。



> 如何只录制报错时候 10s 的视频？
>

```javascript
	/**
	 * 将数据发送到服务器
	 * @param {Object} data - 要发送的数据
	 * @returns {boolean} - 数据是否被接受发送
	 */
	send(data) {
		// 应用采样
		if (Math.random() >= this.config.sampling) {
			return false // 由于采样而丢弃
		}

		// 添加公共字段
		const reportData = {
			id: generateUniqueId(), // 添加唯一ID
			appId: this.config.appId,
			userId: this.config.userId,
			sessionId: this.sessionId,
			timestamp: getTimestamp(),
			pageUrl: getCurrentPageUrl(),
			userAgent: navigator.userAgent,
			...getBrowserInfo(),
			...getDeviceInfo(),
			...data,
		}

		// 添加到队列
		this.queue.push(reportData)

		console.log('捕获数据已入队:', this.queue.length, reportData.type, reportData.subType, reportData)

		// 触发相应类型的事件
		if (reportData.type) {
			this.emit(reportData.type, reportData)

			// 如果有子类型，也触发子类型事件
			if (reportData.subType) {
				this.emit(`${reportData.type}:${reportData.subType}`, reportData)
			}
		}

		// 如果队列已满，自动刷新
		if (this.queue.length >= this.config.maxQueueSize) {
			this.flushQueue()
		}

		return true
	}
```

在监控sdk中，收集到的任何消息，都会emit抛出。

我们就在rrweb插件，监控到error事件，监听到后就上报rrweb录屏，这样录屏的最后一帧就能看到错误的操作了。



### 用户行为栈
+ 跟rrweb一样，我们在behavior-stack插件不仅会监听error事件，还会监听所有的behavior事件（比如click，pageChange等），每监听到一个，就记录在stack数组中
+ 还会监听error事件，如果监控到error事件，就把之前收集到的所有stack一起上报，这样stack的最后一个就是错误信息了。

## 数据监控和报警
### 报警规则
TODO

### 报警方式
TODO

