# SEO Phase 2 长尾增长实施计划

English version: [2026-08-13-seo-phase2-long-tail-growth.md](./2026-08-13-seo-phase2-long-tail-growth.md)

> **面向代理开发者：** 必须使用 `superpowers:subagent-driven-development`（推荐）或 `superpowers:executing-plans`，按任务逐项实施本计划。步骤使用复选框（`- [ ]`）跟踪。

**目标：** 新增 20 篇长尾 JSON 错误指南、外部发现清单和 Google Search Console 监控表，让 JSONFmt 不只依赖竞争激烈的 formatter 大词增长。

**架构：** 保持现有静态页面生成器作为可抓取内容来源。新增专门的 Phase 2 指南数据模块，将这些指南加入 `GUIDE_PAGES`，在指南中心按 runtime and serialization errors 分组，并继续通过文档配对测试保证文档双语。

**技术栈：** Node ESM、Vite 静态生成、Vitest、Markdown 文档。

---

## 文件结构

- `scripts/phase2-guides.mjs`：维护 Phase 2 指南 slug 和指南内容。
- `scripts/generate-static-pages.mjs`：导入 Phase 2 指南数据，并增加运行时指南分组。
- `scripts/generate-static-pages.test.mjs`：验证路由数、指南数、Phase 2 slug、sitemap 覆盖、关键词地图覆盖和运营文档。
- `docs/seo-keyword-map.md`：增加 Phase 2 主关键词映射。
- `docs/seo-keyword-map.zh-CN.md`：关键词地图更新的中文版。
- `docs/seo-external-submission-checklist.md`：外部发现清单。
- `docs/seo-external-submission-checklist.zh-CN.md`：外部清单中文版。
- `docs/gsc-monitoring-table.md`：每周 Search Console 监控模板。
- `docs/gsc-monitoring-table.zh-CN.md`：监控模板中文版。

### 任务 1：Phase 2 静态测试

- [x] **步骤 1：增加失败的静态生成器测试**

断言 `PAGE_ROUTES` 至少达到 53 个路由，`GUIDE_PAGES` 达到 38 篇指南，20 个 Phase 2 slug 全部存在，指南中心包含 `Runtime and serialization errors` 分组，关键词地图包含所有新指南，并且新的运营文档存在。

- [x] **步骤 2：验证 RED**

运行：`npm test -- scripts/generate-static-pages.test.mjs`

预期：失败，因为 `scripts/phase2-guides.mjs` 尚不存在。

### 任务 2：Phase 2 长尾指南

- [x] **步骤 1：创建 Phase 2 指南数据**

新增 20 篇长尾指南，覆盖 `JSON.parse`、fetch、response body、特殊数字、转义、BOM、重复 key、截断响应和 content-type 错误。

- [x] **步骤 2：注册到静态生成**

在 `scripts/generate-static-pages.mjs` 中导入 `createPhase2Guides`，将返回页面加入 `GUIDE_PAGES`，并增加运行时指南分组。

- [x] **步骤 3：验证指南质量**

运行：`npm test -- scripts/generate-static-pages.test.mjs`

预期：所有 Phase 2 指南存在，包含 5 个 sections、4 个 FAQ，并保持在 800-1200 词目标范围内。

### 任务 3：SEO 运营文档

- [x] **步骤 1：增加外部发现清单**

创建 `docs/seo-external-submission-checklist.md` 和 `.zh-CN.md`，包含自有资料页、开发者社区、工具目录和 Search Console 跟进动作。

- [x] **步骤 2：增加 GSC 监控表**

创建 `docs/gsc-monitoring-table.md` 和 `.zh-CN.md`，包含每周 URL、关键词、索引、展示、点击、CTR、排名和动作字段。

- [x] **步骤 3：更新关键词地图**

在英文和中文关键词地图中加入 Phase 2 指南集群。

### 任务 4：完整验证

- [ ] **步骤 1：运行目标静态测试**

运行：`npm test -- scripts/generate-static-pages.test.mjs`

预期：通过。

- [ ] **步骤 2：运行全量测试**

运行：`npm test`

预期：通过。

- [ ] **步骤 3：运行 lint**

运行：`npm run lint`

预期：通过。

- [ ] **步骤 4：运行生产构建**

运行：`npm run build`

预期：构建成功，`dist/sitemap.xml` 包含 53 个公开路由。
