该文件用来封装统一的storage操作，比如setItem，getItem等。

## 背景

- 本地存储的读取往往分散在各个不同的地方，会显得很乱。
- 使用本地存储的时候推荐统一采用该，同时在这里记录每个key和它的作用。
- 配合Typscript使用还可以进行key的限制

## 源代码

```tsx
/**
 * 本地存储的读取往往分散在各个不同的地方，会显得很乱。
 * 使用本地存储的时候推荐统一采用该，同时在这里记录每个key和它的作用。
 * 配合Typscript使用还可以进行key的限制
 */

// 项目中所有存储在localStorage中的数据
export const tupleStr = <T extends string[]>(...args: T) => args
const localKeys = tupleStr(
	// 是否折叠侧边菜单
	'sideCollapse',
	// token
	'tokenName',
	'AuthCode',
	'AuthCodeStamp'
)

// 项目中所有存在sessionStorage中的数据的名称
const sessionKeys = tupleStr('')

// 限制key只能为定义的几个值
type localKeyName = typeof localKeys[number]
type sessionKeyName = typeof sessionKeys[number]
type keyName = localKeyName | sessionKeyName

class StorageMng {
	// key名称前缀
	private prefix: string
	// 使用localStorage还是sessionStorage
	private mode: Storage

	constructor(mode: Storage, prefix: string = '') {
		this.prefix = prefix
		this.mode = mode
	}

	public setItem(key: keyName, value: any) {
		try {
			this.mode.setItem(`${this.prefix}${key}`, window.JSON.stringify(value))
		} catch (err) {
			console.warn(`Storage ${key} set error`, err)
		}
	}

	/**
	 * 设置带有过期时间的storage
	 * @param key
	 * @param value
	 * @param sec 过期时间(秒)
	 *
	 * TODO daotin: 现在是分为两个变量存储，后续可改为一个对象的形式存储 `key: { value: xxx, expires: xxx }`
	 */
	public setExpires(key: keyName, value: any, sec?: number) {
		try {
			this.mode.setItem(`${this.prefix}${key}`, window.JSON.stringify(value))

			if (sec) {
				if (isNaN(Number(sec)) || sec < 1) {
					throw new Error('过期时间需大于0')
				}
				let expiresDate = new Date(Date.now() + sec * 1000).getTime()
				this.mode.setItem(`${this.prefix}${key}_expires`, expiresDate + '')
			}
		} catch (err) {
			console.warn(`Storage ${key} set error`, err)
		}
	}

	/**
	 * 获取storage，如果设置了过期时间，过期后删除storage及对应的过期时间
	 * @param key
	 * @returns
	 */
	public getExpires(key: keyName) {
		const result = this.mode.getItem(`${this.prefix}${key}`)
		const expires = this.mode.getItem(`${this.prefix}${key}_expires`)
		try {
			if (!result) {
				return null
			}
			// 现在的时间>设置的过期时间
			// console.log(Date.now(), new Date(Number(expires)).getTime(), Date.now() > new Date(Number(expires)).getTime())
			if (expires && Date.now() > new Date(Number(expires)).getTime()) {
				this.mode.removeItem(`${this.prefix}${key}`)
				this.mode.removeItem(`${this.prefix}${key}_expires`)
				return null
			}
			return result ? window.JSON.parse(result) : result
		} catch (err) {
			console.warn(`Storage ${key} get error`, err)
		}
	}

	public getItem(key: keyName) {
		const result = this.mode.getItem(`${this.prefix}${key}`)
		try {
			return result ? window.JSON.parse(result) : result
		} catch (err) {
			console.warn(`Storage ${key} get error`, err)
		}
	}

	/**
	 *
	 * @param key
	 * @param deleteExpires 是否删除对应的过期时间（默认删除）
	 */
	public removeItem(key: keyName, deleteExpires: boolean = true) {
		this.mode.removeItem(`${this.prefix}${key}`)
		deleteExpires && this.mode.removeItem(`${this.prefix}${key}_expires`)
	}

	public clear() {
		this.mode.clear()
	}

	public getKey(index: number) {
		return this.getKeys()[index]
	}

	// 获取所有数据的名称
	public getKeys() {
		const keys: keyName[] = []
		Array.from({ length: this.mode.length }).forEach((item, index) => {
			const key = this.mode.key(index)
			if (key?.startsWith(this.prefix)) {
				keys.push(key.slice(this.prefix.length) as keyName)
			}
		})
		return keys
	}

	// 获取所有数据
	public getAll() {
		return Object.fromEntries(this.getKeys().map(key => [key, this.getItem(key)]))
	}
}

const localMng = new StorageMng(localStorage)
const sessionMng = new StorageMng(sessionStorage)

export { StorageMng, localMng, sessionMng }
```

## 使用方式

```tsx
// 基本使用

import { localMng } from '@/utils/storage.ts'

// 设置storage
localMng.setItem(AuthCode, '123456')
// 获取storage
let authCode = localMng.getItem(AuthCode)
// 清除
localMng.removeItem(AuthCode)

// 设置5s过期的storage
localMng.setExpires(AuthCode, '123456', 5)
// 获取（如果过期，则返回null，并且清除相应的storage）
let authCode = localMng.getExpires(AuthCode)
```

## 参考

- [localStorage 的高阶用法](https://mp.weixin.qq.com/s/VBTAWVMAUq822dwNA1A2kg)