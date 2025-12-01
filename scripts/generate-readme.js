const fs = require("fs");
const path = require("path");

// 配置
const ROOT_DIR = path.join(__dirname, "..");
const README_PATH = path.join(ROOT_DIR, "README.md");
const EXCLUDE_DIRS = [
  ".git",
  "node_modules",
  ".github",
  "scripts",
  "images",
  "file",
];
const EXCLUDE_FILES = ["index.md", "README.md"];

/**
 * 获取北京时间格式化字符串
 */
function getBeijingTime() {
  const now = new Date();
  // 转换为北京时间 (UTC+8)
  const beijingTime = new Date(now.getTime() + 8 * 60 * 60 * 1000);

  const year = beijingTime.getUTCFullYear();
  const month = String(beijingTime.getUTCMonth() + 1).padStart(2, "0");
  const day = String(beijingTime.getUTCDate()).padStart(2, "0");
  const hours = String(beijingTime.getUTCHours()).padStart(2, "0");
  const minutes = String(beijingTime.getUTCMinutes()).padStart(2, "0");
  const seconds = String(beijingTime.getUTCSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

/**
 * 判断是否为需要排除的目录
 */
function isExcludedDir(name) {
  return EXCLUDE_DIRS.includes(name);
}

/**
 * 判断是否为需要排除的文件
 */
function isExcludedFile(name) {
  return EXCLUDE_FILES.includes(name);
}

/**
 * 判断是否为 Markdown 文件
 */
function isMarkdownFile(name) {
  return name.endsWith(".md");
}

/**
 * 递归获取目录结构
 */
function getDirectoryStructure(dirPath, relativePath = "") {
  const items = fs.readdirSync(dirPath);
  const structure = {
    dirs: [],
    files: [],
  };

  // 排序：按字符编码排序
  items.sort();

  for (const item of items) {
    const fullPath = path.join(dirPath, item);
    const itemRelativePath = relativePath ? `${relativePath}/${item}` : item;
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      if (!isExcludedDir(item)) {
        const subStructure = getDirectoryStructure(fullPath, itemRelativePath);
        // 只添加包含 md 文件的目录
        if (subStructure.files.length > 0 || subStructure.dirs.length > 0) {
          structure.dirs.push({
            name: item,
            path: itemRelativePath,
            children: subStructure,
          });
        }
      }
    } else if (stat.isFile()) {
      if (isMarkdownFile(item) && !isExcludedFile(item)) {
        structure.files.push({
          name: item.replace(".md", ""),
          path: itemRelativePath,
        });
      }
    }
  }

  return structure;
}

/**
 * 生成 Markdown 内容
 */
function generateMarkdown(structure, depth = 1) {
  let content = "";

  // 先处理当前层级的文件
  for (const file of structure.files) {
    content += `- [${file.name}](${file.path})\n`;
  }

  if (structure.files.length > 0 && structure.dirs.length > 0) {
    content += "\n";
  }

  // 再处理子目录
  for (const dir of structure.dirs) {
    // 根据深度生成不同级别的标题
    if (depth <= 3) {
      const heading = "#".repeat(depth + 1); // depth 1 -> ##, depth 2 -> ###, depth 3 -> ####
      content += `${heading} ${dir.name}\n\n`;
    } else {
      // 深度超过3层，使用加粗文字
      content += `**${dir.name}**\n\n`;
    }

    content += generateMarkdown(dir.children, depth + 1);
  }

  return content;
}

/**
 * 主函数
 */
function main() {
  console.log("开始生成 README...");

  // 获取目录结构
  const structure = getDirectoryStructure(ROOT_DIR);

  // 生成 Markdown 内容
  let readmeContent = `# 前端专栏笔记

> 我的前端学习专栏笔记，持续更新中...
>
> 最后更新时间：${getBeijingTime()} 

---

`;

  // 先添加根目录的 md 文件
  if (structure.files.length > 0) {
    for (const file of structure.files) {
      readmeContent += `- [${file.name}](${file.path})\n`;
    }
    readmeContent += "\n";
  }

  // 再添加各目录的内容
  for (const dir of structure.dirs) {
    readmeContent += `## ${dir.name}\n\n`;
    readmeContent += generateMarkdown(dir.children, 2);
  }

  // 写入 README.md
  fs.writeFileSync(README_PATH, readmeContent, "utf-8");

  console.log("README 生成完成！");
}

main();
