# 登录注册

目的：只有登录的用户才可以进入页面。

> 如何判断用户是否已登录？

答：每次用户登录后，都会把 token 保存在 locakStorage 中，然后设置`router.beforeEach`在进入某个页面时，检查本地 token 是否存在，不存在就跳转到登录页面。

## 用户登录

当用户点击登录按钮的时候，

1. 首先校验表单;
2. 调用 stores 中的登录方法.

```ts
import { useAppStore } from "@/stores";
const appStore = useAppStore();

// 登录
const handleLogin = async () => {
  try {
    await formRef.value?.validate();
    submitLoading.value = true;
    await appStore.login(formData.value);
    window.$message.success("登录成功");
  } catch (err) {
    // 失败的话，需要输入验证码
    loadCaptcha();
    console.error(err);
  } finally {
    submitLoading.value = false;
  }
};
```

::: warning
验证码功能需要后端生成，而不应该是前端生成。
参考：https://v2ex.com/t/729665
:::

在 stores 中登录会调用登录接口，登陆完后：

1. 设置请求 header，每次都携带 token 信息
2. 获取个人信息，存储在 store（此时也可以获取菜单 menuList）
3. 跳转到首页。

```ts
// stores中的登录
async login(data) {
  const token = await window.$apis.common.login(data);
  this.token = token;
  localMng.setItem(TokenName, token);
  request.setHeader({
    Authorization: token,
  });
  await this.getUserInfo();
  router.push("/home");
},
```

## 用户退出

在用户退出后，需要清理 session，清除 token，清除请求头，然后还原 store。

```tsx
//  退出
async logout(isRequest = true) {
  if (isRequest) {
    await window.$apis.common.logout();
  }
  console.log("logout");
  router.replace("/login");
  sessionMng.clear();
  localMng.removeItem(TokenName);
  request.setHeader({
    Authorization: "",
  });
  // 还原store
  this.$reset();
},
```
