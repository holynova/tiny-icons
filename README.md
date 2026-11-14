# Tiny Icons

小图标生成器：选一个模板或输一句话生成草案，调整图形、字母、配色与布局，导出 Chrome 扩展或网站图标包。

在线使用：https://holynova.github.io/tiny-icons/

![Tiny Icons](./screenshot.png)

## 怎么用

1. 左侧选一个模板（终端 / 闪光 / 箭头 / 徽章），或用「AI 草案」输一句话生成一个草案。
2. 中间画布下方调整：字母或汉字、46 个 Lucide 开源图标、15 种布局、4 种字体、大小、阴影、形状与 20 种配色。
3. 右侧预览 16 / 32 / 48 / 128 四个尺寸，确认小尺寸下依然清晰。
4. 点「导出图标包」或「下载 ZIP 包」，得到一个 ZIP 文件。

## 导出内容

- Chrome 图标包（7 个文件）：icon16 / icon32 / icon48 / icon128.png、icon.svg、manifest-snippet.json（扩展清单片段）、icon-spec.json（可编辑配置）。
- 网站图标包（6 个文件）：icon16 / icon32 / icon48.png、favicon.ico、icon.svg、icon-spec.json（可编辑配置）。

## 草稿

修改会自动保存在当前浏览器本地，刷新页面后恢复；不用注册账号，不上传服务器。

## 本地开发

```bash
pnpm install
pnpm dev          # 本地开发
pnpm build:pages  # 构建并生成 docs/（GitHub Pages 产物）
pnpm test         # 构建 + 渲染测试
```

Repo: https://github.com/holynova/tiny-icons
