```vue
<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue'
import message from '@/utils/message'

// 获取所有svg名称
const svgFiles = import.meta.globEager('@/assets/icons/*.svg')
const iconNames = [] as string[]
Object.keys(svgFiles).forEach(item => {
	try {
		iconNames.push(item.split('/').pop()!.split('.')[0])
	} catch (error) {
		console.error(error)
	} finally {
	}
})
console.log('⭐svgFiles==>', iconNames)

// 复制
function copyIcon(icon) {
	if (navigator.clipboard) {
		// let iconComp = `<IconCustom${nameThansfer(icon)}  />`
		// navigator.clipboard.writeText(iconComp)
		navigator.clipboard.writeText(icon)
		message.msgSuccess(`复制成功 ${icon}`)
	} else {
		console.log(
			'浏览器不支持navigator.clipboard，兼容方案 https://www.zhangxinxu.com/wordpress/2021/10/js-copy-paste-clipboard/'
		)
		message.msgWarn('浏览器不支持navigator.clipboard，详情看console.log信息')
	}
}

// 字符串转大驼峰
function nameThansfer(name) {
	let arr = name.split('')
	arr.map((item, index) => {
		if (item == '-' || item == '_') {
			arr.splice(index, 1)
			arr[index] = arr[index].toUpperCase()
		}
	})
	arr[0] = arr[0].toUpperCase()
	return arr.join('')
}

// 获取svg路径作为url
const getSvgUrl = name => {
	return new URL(`../../assets/icons/${name}.svg`, import.meta.url).href
}
</script>

<template>
	<div class="icons-preview p-5">
		<h1 class="py-5 font-bold">svg 预览</h1>
		<div class="icon-box">
			<ul class="flex flex-wrap">
				<li
					class="flex flex-col items-center justify-center cursor-pointer px-2"
					:title="icon"
					v-for="icon in iconNames"
					@click="copyIcon(icon)"
				>
					<el-image :src="getSvgUrl(icon)"></el-image>
					<div class="mt-2 w-full truncate text-center">{{ icon }}</div>
				</li>
			</ul>
		</div>
	</div>
</template>

<style lang="less" scoped>
.icons-preview {
	background-color: #fff;
	h1 {
		font-size: 20px;
	}
	.icon-box {
		ul {
			li {
				width: 100px;
				height: 100px;
				border: @base-border;
				&:hover {
					background-color: #f6f6f6;
				}
				:deep(.el-image) {
					img {
						width: 30px !important;
					}
				}
			}
		}
	}
}
</style>

```