# APP 交互方法说明文档

## 概述

本文档详细说明了 H5 项目中与原生 APP 的交互方法。项目支持 Android 和 iOS 两个平台的交互，通过统一的`callApp`方法进行调用。

## 交互方法实现

### 统一调用方法

```javascript
export function callApp(methodName, params = undefined) {
	// 检查方法名是否存在
	if (!methodName) {
		console.warn('Method name is required')
		return null
	}

	try {
		// 安卓环境
		if (sessionStorage.getItem('isAndroid') && window.AndroidWebView) {
			if (params !== undefined && params !== null) {
				return window.AndroidWebView[methodName](params)
			} else {
				return window.AndroidWebView[methodName]()
			}
		}

		// iOS环境
		if (sessionStorage.getItem('isIOS') && window.webkit?.messageHandlers?.[methodName]) {
			if (params !== undefined && params !== null) {
				return window.webkit.messageHandlers[methodName].postMessage(params)
			} else {
				return window.webkit.messageHandlers[methodName].postMessage()
			}
		}

		return null
	} catch (error) {
		console.error('callApp 调用原生方法出错:', error)
		return null
	}
}
```

### 调用说明

1. 方法名称：`callApp`
2. 参数说明：
   - methodName: 必填，要调用的原生方法名
   - params: 可选，传递给原生方法的参数

### 平台支持

#### Android 平台

- 通过`window.AndroidWebView`对象调用原生方法
- 直接调用对象上的同名方法
- 支持传参和无参两种调用方式

#### iOS 平台

- 通过`window.webkit.messageHandlers`对象调用原生方法
- 使用`postMessage`方法发送消息
- 支持传参和无参两种调用方式

## 具体交互方法列表

### 用户信息相关

1. `getUserInfo`

   - 说明：获取用户信息
   - 参数：无
   - 使用场景：初始化时获取用户信息

2. `skip2Login`
   - 说明：跳转到登录页面
   - 参数：无
   - 使用场景：未登录时跳转登录

### 支付相关

1. `signPayType`
   - 说明：签约支付方式
   - 参数：支付方式信息对象
   - 使用场景：签约/注销支付方式时调用

### 系统功能

1. `finish`

   - 说明：关闭当前页面
   - 参数：无
   - 使用场景：返回上一页

2. `goToBack`

   - 说明：返回上一页（iOS 专用）
   - 参数：无
   - 使用场景：返回上一页

3. `useAppTitle`
   - 说明：使用 APP 导航栏
   - 参数：无
   - 使用场景：页面初始化时

### 通知相关

1. `onNotifyMessge`
   - 说明：发送通知消息
   - 参数：消息内容对象（JSON 字符串）
   - 使用场景：需要向 APP 发送通知时

### 版本相关

1. `onAppVersionClick`
   - 说明：获取 APP 版本信息
   - 参数：无
   - 使用场景：查看 APP 版本信息时

### 通讯相关

1. `goCall`
   - 说明：拨打电话
   - 参数：电话号码
   - 使用场景：需要拨打电话时

### 导航相关

1. `executeUri`

   - 说明：执行 URI 跳转
   - 参数：URI 字符串
   - 使用场景：打开第三方应用（如高德地图）

2. `isInstallApp`
   - 说明：检查是否安装某个 APP
   - 参数：应用包名
   - 返回值：布尔值
   - 使用场景：检查是否安装了指定的 APP

## 环境判断

项目使用 sessionStorage 存储当前运行环境：

- `isAndroid`: Android 环境标识
- `isIOS`: iOS 环境标识

## 使用示例

```javascript
// 无参数调用
callApp('methodName')

// 带参数调用
callApp('methodName', {
	key: 'value',
})
```

## 注意事项

1. 调用前需确保 methodName 存在
2. 建议在 try-catch 中使用，以防止调用异常
3. 不同平台的返回值可能不同
4. 需要提前在 sessionStorage 中设置正确的环境标识

## 错误处理

1. 方法名为空时返回 null
2. 调用出错时会在控制台输出错误信息
3. 非移动端环境调用返回 null

## 调试建议

1. 使用 console.log 输出调用信息
2. 检查环境标识是否正确设置
3. 确认原生方法是否已实现
4. 验证参数格式是否正确
