在vue2中有一个mixin.js文件，用来混入enum枚举和const常量，以及图片到所有的组件中。避免每次在组件中使用，需要import导入。

在此基础上增加一些代码，如果图片的文件名相同，则优先使用webp格式的图片。

代码如下：

```diff

import * as configConst from "@/config/const";
import * as configEnum from "@/config/enum";

let requireContext = require.context("./../assets/img", false, /\\\\.(jpg|jpeg|png|webp|svg|bmp)$/);

+ // 判断是否有重复的图片文件名
+ let repeatImg = {};
+ let repeatImgKeys = [];
+ requireContext.keys().forEach(file => {
+  const fileName = file.replace(/^\\\\.\\\\/(.*)\\\\.\\\\w+$/, "$1");
+  if (repeatImg[fileName]) {
+     repeatImg[fileName]++;
+   } else {
+     repeatImg[fileName] = 1;
+   }
+ });

+ for (const key in repeatImg) {
+   const count = repeatImg[key];
+   if (count > 1) {
+     repeatImgKeys.push(key);
+   }
+ }

let imgObj = {};
requireContext.keys().forEach(file => {
  const fileName = file.replace(/^\\\\.\\\\/(.*)\\\\.\\\\w+$/, "$1");

  // 格式示例：imgbgproductpng
  let imgName = file.replace(/\\\\.|-|_/g, "").replace(/\\\\//g, "img");
  imgObj[imgName] = requireContext(file);

  // 格式示例：imgBgProduct
  let imgNameNew = file.replace(/\\\\.\\\\//g, "").split(".")[0];
  imgNameNew = "img" + _.upperFirst(_.camelCase(imgNameNew));

+   // 优先使用webp图片
+   if (repeatImgKeys.includes(fileName)) {
+     if (file.includes("webp")) {
+       imgObj[imgNameNew] = requireContext(file);
+     }
+   } else {
+     imgObj[imgNameNew] = requireContext(file);
+   }
  // console.log("⭐imgNameNew==>", file);
  // console.log("⭐imgNameNew==>", imgNameNew);
  // console.log("⭐imgObj==>", imgObj);
});

console.log("==== mixin done! ====");

const list = {
  data() {
    return {
      ...imgObj,
      ...configConst,
      ...configEnum
    };
  }
};

export default list;

```

在main.js中进行混入：

```js
import mixin from "@/utils/mixin.js";

Vue.mixin(mixin);
```