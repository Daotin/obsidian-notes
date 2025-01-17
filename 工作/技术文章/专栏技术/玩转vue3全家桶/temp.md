对于 value，官方是这样解释的：

将值封装在一个对象中，看似没有必要，但为了保持 JavaScript 中不同数据类型的行为统一，这是必须的。这是因为在 JavaScript 中，Number 或 String 等基本类型是通过值而非引用传递的：在任何值周围都有一个封装对象，这样我们就可以在整个应用中安全地传递它，而不必担心在某个地方失去它的响应性

---

补充一下 vue-router 4.x 已经废弃了 hashchange 统一使用 popstate

history.pushState()并不会触发监听的 popstate 事件，得自己手动改 current.value 的值。。。

```
defineProps类型定义的两种方式：

1、

interface IProps {
  title?: string;
  back?: () => void;
}

const props = defineProps<IProps>();

或者

const props = defineProps<{
  title?: string;
  back?: () => void;
}>();

缺点：没有默认值，需要使用withDefaults

const props = withDefaults(defineProps<IProps>(), {
  size: 14,
  strokeWidth: 3,
})

2、

const props = defineProps({

  size: {
    type: number,
    default: 0,
  },
  optionType: {
    type: Number as PropType<enumOptionType>,
    validator(value: enumOptionType) {
      return [enumOptionType.add, enumOptionType.edit].includes(value)
    },
  },

})
```
