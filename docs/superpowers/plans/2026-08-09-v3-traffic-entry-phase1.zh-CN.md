# V3 流量入口阶段 1 实施计划

English version: [2026-08-09-v3-traffic-entry-phase1.md](./2026-08-09-v3-traffic-entry-phase1.md)

> **面向代理开发者：** 必须使用 `superpowers:subagent-driven-development`（推荐）或 `superpowers:executing-plans`，按任务逐项实施本计划。步骤使用复选框（`- [ ]`）跟踪。

**目标：** 围绕现有浏览器本地 JSON 编辑器，增加 V3 阶段 1 的可抓取工具入口网络。

**架构：** 保持 React 首页作为主要交互工具。扩展现有 Node 静态生成器，输出可索引的工具页、`/tools/` 中心、更丰富的指南链接、sitemap 条目和结构化数据。更新首页导航和入口区域，将用户和搜索引擎引导到新的工具网络。

**技术栈：** Vite、React、TypeScript、Node ESM、Vitest、ESLint。

---

## 文件结构

- `scripts/generate-static-pages.test.mjs`：更新现有 V2 静态页面断言，增加 V3 路由、工具页、sitemap 和结构化数据断言。
- `scripts/generate-static-pages.mjs`：增加工具页数据、路由注册、`/tools/` 渲染、相关链接模块以及 SoftwareApplication/Breadcrumb Schema。
- `src/App.tsx`：更新首页定位、导航、模式/任务入口链接、指南链接、FAQ 和页脚矩阵。
- `src/styles.css`：增加工具入口网格、页脚矩阵以及静态工具/中心页面样式，同时保留现有深色开发者工具视觉风格。
- `index.html`：更新首页标题、描述、Open Graph 元数据和 V3 的 FAQ JSON-LD。

### 任务 1：静态生成器 TDD

**文件：**
- 修改：`scripts/generate-static-pages.test.mjs`
- 修改：`scripts/generate-static-pages.mjs`

- [ ] **步骤 1：编写失败的静态生成器测试**

增加以下断言：

```js
expect(PAGE_ROUTES.length).toBeGreaterThanOrEqual(25)
expect(TOOL_PAGES.map((page) => page.path)).toEqual(expect.arrayContaining([
  '/json-formatter/',
  '/json-validator/',
  '/json-minifier/',
  '/json-beautifier/',
  '/json-pretty-print/',
  '/json-error-finder/',
  '/fix-invalid-json/',
  '/json-viewer/',
]))
expect(TOOLS_INDEX.path).toBe('/tools/')
```

增加渲染断言：

```js
const html = renderStaticPage(TOOL_PAGES[0])
expect(html).toContain('"@type":"SoftwareApplication"')
expect(html).toContain('"@type":"BreadcrumbList"')
expect(html).toContain('Related JSON tools')
expect(html).toContain('Related guides')
```

- [ ] **步骤 2：运行目标测试并确认 RED**

运行：`npm test -- scripts/generate-static-pages.test.mjs`

预期：由于 `TOOL_PAGES` 和 `TOOLS_INDEX` 尚未导出且 V3 路由缺失，测试失败。

- [ ] **步骤 3：实现静态页面数据和渲染**

增加导出的 `TOOL_PAGES`、`TOOLS_INDEX` 和额外指南页。扩展 `PAGE_ROUTES`，包含首页、工具中心、工具页、指南页和信任页。工具页使用静态演示壳、FAQ、相关工具、相关指南、Breadcrumb JSON-LD 和 SoftwareApplication JSON-LD。

- [ ] **步骤 4：运行目标静态生成器测试并确认 GREEN**

运行：`npm test -- scripts/generate-static-pages.test.mjs`

预期：通过。

### 任务 2：首页入口网络

**文件：**
- 修改：`src/App.tsx`
- 修改：`src/styles.css`
- 修改：`index.html`

- [ ] **步骤 1：通过静态/构建测试增加首页预期**

通过 `HOME_PAGE` 增加对 V3 首页元数据的断言：

```js
expect(HOME_PAGE.title).toContain('JSON Formatter')
expect(HOME_PAGE.description).toContain('Validate')
```

- [ ] **步骤 2：如果元数据尚未更新，验证 RED**

运行：`npm test -- scripts/generate-static-pages.test.mjs`

预期：在首页元数据符合 V3 定位前，测试失败。

- [ ] **步骤 3：更新首页 UI 和元数据**

将首页 H1 更新为 `JSON formatter, validator, and error finder`。增加 Formatter、Validator、Minifier、Error Finder、Guides 和 Tools 的顶部导航链接。增加核心工具页任务入口网格，并扩展页脚矩阵。

- [ ] **步骤 4：运行目标测试和 lint**

运行：`npm test -- scripts/generate-static-pages.test.mjs`

预期：通过。

运行：`npm run lint`

预期：通过。

### 任务 3：完整验证

**文件：**
- 所有已修改的文件。

- [ ] **步骤 1：运行全部测试**

运行：`npm test`

预期：所有测试通过。

- [ ] **步骤 2：运行 lint**

运行：`npm run lint`

预期：没有 ESLint 错误。

- [ ] **步骤 3：运行生产构建**

运行：`npm run build`

预期：构建成功，生成的 `dist` 包含 `/tools/`、核心工具页、扩展指南、信任页、`sitemap.xml` 和 `robots.txt`。

- [ ] **步骤 4：检查路由输出**

运行：`node -e "import('./scripts/generate-static-pages.mjs').then(m => console.log(m.PAGE_ROUTES.map(p => p.path).join('\\n')))"`.

预期：输出包含所有 V3 阶段 1 工具路由，并且公开路由总数至少为 25。
