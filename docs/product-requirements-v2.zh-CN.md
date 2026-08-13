# JSONFmt.org V2 产品需求

English version: [product-requirements-v2.md](./product-requirements-v2.md)

## 目标

将 `https://jsonfmt.org/` 从单页 JSON 工具升级为适合 AdSense 和 SEO 的英文 JSON 工具网站。

V2 保持 V1 工具体验稳定。主要工作是完善网站信任内容、静态内容、导航和技术 SEO。

## 范围

V2 增加：

- 顶部导航：`Tool`、`Guides`、`About` 和 `Contact`。
- 指向 `Privacy Policy` 和 `Terms of Use` 的页脚链接。
- 静态 `/guides/` 指南索引页。
- 6 个面向开发者的指南页：
  - `/guides/trailing-comma-in-json/`
  - `/guides/unexpected-token-in-json/`
  - `/guides/single-quotes-in-json/`
  - `/guides/unquoted-property-name-in-json/`
  - `/guides/unclosed-string-in-json/`
  - `/guides/comments-in-json/`
- 4 个信任页面：
  - `/privacy/`
  - `/terms/`
  - `/about/`
  - `/contact/`
- `sitemap.xml` 和 `robots.txt`。
- 每个页面的 title、description、canonical URL、Open Graph 标签，以及适用时的 JSON-LD。

## 内容需求

每篇指南都必须面向开发者使用英文撰写。语气要实用、直接：解释错误，展示错误代码，展示修复后的代码，解释严格 JSON 为什么拒绝该输入，列出常见错误，并以回到工具的 CTA 结尾。

每篇指南目标长度为 800-1200 个英文单词。前 6 个主题聚焦语法错误，因为它们与当前 V1 诊断引擎匹配。

Contact 页面使用 `zhulinkaikai@gmail.com`。About、Privacy 和 Terms 页面将运营方称为 `JSON Formatter team`。

## 技术需求

项目继续使用 Vite + React + TypeScript，不迁移到 Astro 或 Next.js。

首页继续是由 React 驱动的工具。额外的 V2 页面在 Vite 构建后生成到 `dist` 中的静态 HTML。每个页面都必须能够在不依赖客户端路由的情况下独立被抓取。

网站基础 URL 是 `https://jsonfmt.org/`。

## 广告和分析

V2 不包含真实 AdSense 代码、AdSense 验证代码、Google Analytics、Plausible 或 Umami。

指南页可以在文章中部和接近结尾的位置保留广告位区域。这些区域必须明确是无功能的占位区域，并且不能加载第三方脚本。

隐私政策必须说明 JSON 在浏览器本地处理，并披露未来的 Google AdSense 等广告服务可能使用 Cookie 或类似技术。

## 非目标

V2 不增加 JSON 树形视图、JSONPath 搜索、差异比较、Schema 生成、转换、账户功能、云端保存、分享链接或基于 URL 的 JSON 预填充。

V2 不将工具迁移到 `/tool/`，不把首页替换成内容落地页，也不添加真实广告。

## 验收标准

- `npm test`、`npm run lint` 和 `npm run build` 通过。
- 构建后的 `dist` 目录包含所有 V2 路由的 `index.html` 文件。
- `sitemap.xml` 和 `robots.txt` 引用 `https://jsonfmt.org/`。
- 每个静态页面都有 title、description、canonical 和 Open Graph 标签。
- 指南页包含 Article 和 FAQ JSON-LD。
- 首页保留 V1 JSON 工具，并增加 V2 导航和页脚链接。
