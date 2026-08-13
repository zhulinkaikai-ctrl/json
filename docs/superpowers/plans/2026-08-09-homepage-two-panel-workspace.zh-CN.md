# 首页双面板工作区实施计划

English version: [2026-08-09-homepage-two-panel-workspace.md](./2026-08-09-homepage-two-panel-workspace.md)

> **面向代理开发者：** 必须使用 `superpowers:subagent-driven-development`（推荐）或 `superpowers:executing-plans`，按任务逐项实施本计划。步骤使用复选框（`- [ ]`）跟踪。

**目标：** 将首页的诊断侧栏替换为命令驱动的双面板 JSON 输入和只读输出工作区。

**架构：** 增加一个纯首页工作区状态模块，根据输入文本计算操作结果和结果过期状态。React 首页使用该模块，左侧渲染可编辑 Monaco 输入，右侧渲染只读结果或诊断面板。工具专属路由保留现有工具页面表面。

**技术栈：** React、TypeScript、Monaco Editor、Vitest、Lucide、CSS。

---

### 任务 1：首页工作区 TDD

**文件：**
- 创建：`src/lib/homepageWorkspace.test.ts`
- 创建：`src/lib/homepageWorkspace.ts`

- [x] **步骤 1：编写失败的操作状态测试**

```ts
expect(runHomepageAction('{"name":"Ada"}', 'format')).toMatchObject({
  kind: 'text',
  action: 'format',
  value: '{\n  "name": "Ada"\n}',
})

expect(runHomepageAction('{"name":"Ada",}', 'format')).toMatchObject({
  kind: 'diagnostic',
  action: 'format',
})

expect(isHomepageOutputStale('{"name":"Ada"}', {
  kind: 'text',
  action: 'format',
  value: '{\n  "name": "Ada"\n}',
  sourceInput: '{"name":"Ada"}',
})).toBe(true)
```

- [x] **步骤 2：验证 RED**

运行：`npm test -- src/lib/homepageWorkspace.test.ts`

预期：由于首页工作区模块不存在，测试失败。

- [x] **步骤 3：增加最小纯状态实现**

创建 `runHomepageAction`、`isHomepageOutputStale` 和 `getHomepageOutputText`。`format` 和 `minify` 只有在 JSON 有效时才返回文本。无效输入返回 `diagnoseJson` 的诊断结果，因此会替换之前的输出。

- [x] **步骤 4：验证 GREEN**

运行：`npm test -- src/lib/homepageWorkspace.test.ts`

预期：通过。

### 任务 2：首页工作区 UI

**文件：**
- 修改：`src/App.tsx`
- 修改：`src/styles.css`

- [x] **步骤 1：渲染首页命令栏和双面板**

在首页路由中使用纯工作区模块。左侧 Monaco 编辑器保留源 JSON。右侧面板作为不可编辑内容，渲染空状态、格式化、压缩、验证、诊断和结果过期状态。

- [x] **步骤 2：保留输入并增加显式结果操作**

使用独立的 `inputValue` 和 `output` 状态。`Format`、`Validate` 和 `Minify` 不得通过转换后的值调用 `setInputValue`。只有有可用输出文本时，才启用 `Copy Output` 和 `Use output as input`。

- [x] **步骤 3：保持工具页路由稳定**

非首页工具路由继续渲染当前单编辑器诊断布局，确保生成的 SEO 页面仍然可以加载对应的交互表面。

### 任务 3：验证

**文件：**
- 所有已修改的文件。

- [x] **步骤 1：运行测试**

运行：`npm test`

预期：首页工作区测试和现有诊断/静态生成测试通过。

- [x] **步骤 2：运行 lint**

运行：`npm run lint`

预期：没有 ESLint 错误。

- [x] **步骤 3：运行构建**

运行：`npm run build`

预期：生产构建成功，静态工具页仍包含对应路由的输出。
