# Tiny Icons

一个聚焦 Chrome 扩展图标和 Favicon 的网页端小图标生成器。

## 功能

- 选择简洁模板，编辑文字、符号、形状和配色
- 用一句描述生成一个可继续编辑的 AI 草案
- 查看 16、32、48、128 像素预览
- 下载 Chrome 图标包或 Favicon 图标包
- 同时保留 PNG、ICO、SVG 和可编辑的 `icon-spec.json`

## 开发

```bash
npm install
npm run dev
```

构建检查：

```bash
npm run build
npm run lint
```

当前版本的 AI 草案使用本地规则生成，不需要账号或 API Key。接入真实模型时，应让模型返回结构化图标参数，再交给同一个编辑器渲染。
