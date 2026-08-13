# V2 AdSense SEO 升级实施计划

English version: [2026-08-07-v2-adsense-seo.md](./2026-08-07-v2-adsense-seo.md)

> **面向代理开发者：** 必须使用 `superpowers:subagent-driven-development`（推荐）或 `superpowers:executing-plans`，按任务逐项实施本计划。步骤使用复选框（`- [ ]`）跟踪。

**目标：** 在不改变 V1 工具工作流的前提下，为现有 JSON 工具增加静态 SEO 页面和信任页面。

**架构：** 保持 React 应用作为首页工具。增加一个基于 Node 的静态页面生成器，在 `vite build` 后生成可抓取的 HTML 页面、`sitemap.xml` 和 `robots.txt` 到 `dist`。

**技术栈：** Vite、React、TypeScript、Vitest、ESLint、Node ESM。

---

### 任务 1：基线和文档

**文件：**
- 创建：`docs/product-requirements-v2.md`
- 创建：`docs/superpowers/plans/2026-08-07-v2-adsense-seo.md`

- [ ] **步骤 1：运行基线测试**

运行：`npm test`

预期：现有 JSON 诊断测试通过。

- [ ] **步骤 2：运行基线构建**

运行：`npm run build`

预期：Vite 生产构建成功。

- [ ] **步骤 3：保存 V2 PRD 和实施计划**

记录已确认的 V2 范围、路由列表、SEO 需求、非目标和验证命令。

### 任务 2：静态站点生成器测试

**文件：**
- 创建：`scripts/generate-static-pages.test.mjs`
- 创建：`scripts/generate-static-pages.mjs`

- [ ] **步骤 1：编写失败测试**

覆盖路由数量、canonical URL、sitemap URL、robots 指令、Article Schema、FAQ Schema 以及不包含真实广告脚本。

- [ ] **步骤 2：运行测试确认失败**

运行：`npm test -- scripts/generate-static-pages.test.mjs`

预期：由于 `generate-static-pages.mjs` 尚未实现，测试失败。

### 任务 3：静态页面数据和渲染

**文件：**
- 创建：`scripts/generate-static-pages.mjs`
- 修改：`package.json`

- [ ] **步骤 1：实现页面元数据和内容**

增加一个指南索引页、六个指南页、四个信任页和渲染辅助函数。

- [ ] **步骤 2：加入构建后生成**

在 `vite build` 后将构建脚本改为运行 `node scripts/generate-static-pages.mjs`。

- [ ] **步骤 3：运行生成器测试**

运行：`npm test -- scripts/generate-static-pages.test.mjs`

预期：通过。

### 任务 4：首页导航和共享样式

**文件：**
- 修改：`src/App.tsx`
- 修改：`src/styles.css`
- 修改：`index.html`

- [ ] **步骤 1：增加顶部导航和页脚**

增加 `Tool`、`Guides`、`About`、`Contact`、`Privacy Policy` 和 `Terms of Use` 链接。

- [ ] **步骤 2：增加首页 Guides 入口区域**

链接到六个指南页，同时不将工具移出首页。

- [ ] **步骤 3：增加首页 SEO 元数据**

为 `https://jsonfmt.org/` 增加 canonical 和 Open Graph 标签。

### 任务 5：验证

**文件：**
- 所有已修改的项目文件。

- [ ] **步骤 1：运行测试**

运行：`npm test`

预期：所有 Vitest 测试通过。

- [ ] **步骤 2：运行 lint**

运行：`npm run lint`

预期：没有 ESLint 错误。

- [ ] **步骤 3：运行构建**

运行：`npm run build`

预期：生产构建成功，并且生成的静态页面存在于 `dist` 中。

- [ ] **步骤 4：检查生成文件**

检查 `dist/sitemap.xml`、`dist/robots.txt`、`dist/guides/index.html`、文章页和信任页是否存在，并确认它们包含 `https://jsonfmt.org/` 的 canonical 链接。
