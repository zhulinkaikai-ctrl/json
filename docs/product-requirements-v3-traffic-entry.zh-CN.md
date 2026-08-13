# JSONFmt.org V3 产品需求：流量入口扩展

English version: [product-requirements-v3-traffic-entry.md](./product-requirements-v3-traffic-entry.md)

## 1. V3 的原因

JSONFmt 目前有一个实用的核心工具和少量错误指南，但搜索和导航入口太少。用户可以进入首页或几篇语法错误文章，但没有覆盖 formatter、validator、minifier、viewer、转义/反转义或格式转换等常见 JSON 意图的完整工具矩阵。

竞品参考 `https://jsonformatter.org/` 更像一个工具网络，而不只是单一格式化器。它的首页链接到许多相关工具、重复出现的 JSON 任务、转换页面、FAQ、文章内容和页脚分类。V3 应借此将 JSONFmt 发展为一个可抓取、隐私优先的 JSON 工具网站，并提供更多明确的入口页面。

V3 不复制竞品，而是利用竞品带来的启发，解决 JSONFmt 当前的缺口：只有一个强工具并不足够，用户和搜索引擎还需要更多进入网站的路径。

## 2. 产品目标

将 `https://jsonfmt.org/` 从带有辅助指南的 JSON 错误查找器，扩展为多入口 JSON 工具网站。

V3 的主要结果：

- 搜索 `json formatter`、`json validator`、`json minifier`、`fix invalid json` 或常见 JSON 解析错误的访问者，应进入与具体意图匹配的页面。
- 每个重要页面都应将用户引导回浏览器本地运行的 JSON 工具。
- 每个工具页或指南页都应可独立抓取、可索引、有内部链接，并且无需客户端路由即可提供价值。

## 3. 定位

### 当前定位

JSONFmt 当前定位为：

- JSON Error Finder
- Fix invalid JSON
- Strict JSON validator

这个定位有差异化，但覆盖范围较窄。

### V3 定位

JSONFmt 应定位为：

**面向开发者的隐私优先 JSON 格式化器、验证器和错误查找器。**

支持性描述：

- 在浏览器本地格式化、验证、压缩和调试 JSON。
- 不上传、不存储、不需要账户。
- 不只显示原始解析器错误，而是清楚解释无效 JSON 的原因。

## 4. 目标搜索意图

V3 应将一个主要意图映射到一个主要页面。不要让一个通用页面试图覆盖所有查询。

### 工具意图

- `json formatter`
- `json formatter online`
- `json beautifier`
- `json pretty print`
- `json validator`
- `json checker`
- `json minifier`
- `json viewer`
- `json error finder`
- `fix invalid json`

### 错误意图

- `trailing comma in json`
- `unexpected token in json`
- `unexpected end of json input`
- `single quotes in json`
- `unquoted property name in json`
- `comments in json`
- `bad control character in json`
- `json parse error`
- `expected double quoted property name`
- `missing comma in json`

### 转换和变换意图

这些页面可以在核心工具页之后分阶段加入：

- `json to string`
- `string to json`
- `json escape`
- `json unescape`
- `json sort keys`
- `json to csv`
- `csv to json`
- `json to xml`
- `xml to json`

## 5. 必需的路由结构

### 核心工具页

每个页面必须拥有自己的 title、H1、meta description、canonical URL、介绍文字、FAQ、相关链接和可工作的本地工具区域。

- `/json-formatter/`
- `/json-validator/`
- `/json-minifier/`
- `/json-beautifier/`
- `/json-pretty-print/`
- `/json-error-finder/`
- `/fix-invalid-json/`
- `/json-viewer/`
- `/tools/`

首页继续作为可工作的工具，但它的元数据应覆盖最宽泛的混合意图：

- Title：`JSON Formatter and Validator - JSONFmt`
- H1：`JSON formatter, validator, and error finder`

### 变换页面

第 2 阶段应增加仍然隐私优先、在浏览器本地运行的页面：

- `/json-escape/`
- `/json-unescape/`
- `/json-to-string/`
- `/string-to-json/`
- `/json-sorter/`

只有功能真正实现后，第 3 阶段才可以增加转换页面：

- `/json-to-csv/`
- `/csv-to-json/`
- `/json-to-xml/`
- `/xml-to-json/`

不要发布只写着“即将推出”的单薄转换页面。

### 指南页

保留 6 个 V2 指南页，并将总数扩展到至少 18 页：

- `/guides/how-to-format-json/`
- `/guides/how-to-validate-json/`
- `/guides/how-to-minify-json/`
- `/guides/json-formatter-vs-validator/`
- `/guides/unexpected-end-of-json-input/`
- `/guides/bad-control-character-in-json/`
- `/guides/missing-comma-in-json/`
- `/guides/expected-double-quoted-property-name/`
- `/guides/json-parse-error/`
- `/guides/json-stringify-vs-json-parse/`
- `/guides/strict-json-vs-json5/`
- `/guides/is-online-json-formatter-safe/`

## 6. 首页需求

首页应在保留当前编辑器优先体验的同时，成为最强的产品和 SEO 入口。

必需区域：

- 顶部导航：`Formatter`、`Validator`、`Minifier`、`Error Finder`、`Guides`、`Tools`。
- 首屏工具：用户可以立即粘贴或编辑 JSON。
- 模式控制：`Format`、`Validate`、`Minify`、`Find errors`。
- 结果面板：有效状态摘要、语法错误诊断、格式化输出或压缩输出。
- 任务入口网格：链接到核心工具页。
- 错误指南网格：链接到高价值语法指南。
- 隐私区域：说明浏览器本地处理。
- FAQ：回答上传/隐私、严格 JSON、格式化、验证、压缩和 JSON5 支持问题。
- 页脚工具矩阵：核心工具、变换、指南和信任页面。

首页不能变成营销页。首屏仍然必须是可用的 JSON 工具。

## 7. 工具页需求

每个工具页应复用共享 JSON 工具引擎，但根据页面意图定制外围内容：

- Formatter 页面默认格式化任务，并强调可读缩进。
- Validator 页面默认验证和错误诊断。
- Minifier 页面默认压缩，并强调输出体积减少。
- Error finder 页面强调行号/列号、解释和修复建议。
- Viewer 页面初期可以复用格式化输出和结构化摘要，后续再增加树形导航。

每个工具页需要：

- 自引用 canonical URL。
- 独特的 title 和 meta description。
- 一个 H1。
- 首段包含主要关键词。
- 首屏或首屏附近的可工作工具。
- 页面中可见 4-6 个 FAQ 项。
- 相关 JSON 工具链接。
- 相关指南链接。
- Breadcrumb JSON-LD。
- 适用时添加 SoftwareApplication JSON-LD。

## 8. 内容需求

指南页应实用并面向开发者。每篇指南都应：

- 在前 100 个单词内回答核心问题。
- 在相关情况下展示错误和修复后的 JSON 示例。
- 解释严格 JSON 为什么接受或拒绝该语法。
- 包含简短的排查清单。
- 链接到最相关的工具页。
- 链接到 2-4 篇相关指南。
- 展示可见 FAQ 内容和 FAQ JSON-LD。
- 保持足够独特，避免入口页或重复内容风险。

目标长度：

- 核心工具页：500-900 个英文单词的辅助可见内容。
- 错误指南：900-1,400 个英文单词。
- 变换指南：700-1,100 个英文单词。

## 9. 内部链接需求

V3 必须通过多条路径让每个重要页面都能被发现。

必需的链接位置：

- 页头导航链接到前 4 个工具和指南中心。
- `/tools/` 中心列出每个工具分类。
- `/guides/` 中心按错误、格式化、验证和安全分组。
- 每个工具页的相关工具模块。
- 每个指南页的相关指南模块。
- 包含核心工具、变换、指南和信任页面的页脚矩阵。
- 所有非首页页面的面包屑链接。
- 首页任务网格链接到所有核心工具页。

核心页面不能成为孤立页面。每个新路由都必须出现在 `sitemap.xml` 中。

## 10. 技术需求

项目继续使用：

- Vite
- React
- TypeScript
- 静态部署
- 浏览器本地 JSON 处理

实现方向：

- 抽取当前 JSON 编辑器和诊断 UI，形成可复用组件。
- 为工具页和指南页引入路由/页面配置。
- 保持构建后的 HTML 页面可独立抓取。
- 避免服务端 JSON 解析。
- 避免账户、数据库、已保存文档或通过 URL 预填充私有 JSON。
- 保持 10 MB 本地处理限制，除非性能测试证明提高限制是安全的。

## 11. 隐私和分析

JSON 内容绝不能上传、记录、存储、发送到分析服务或嵌入 URL。

允许的分析：

- 页面浏览量。
- 来源分类。
- 选择的工具模式。
- 粗粒度输入大小区间。
- 验证状态。
- 错误类别。
- 操作点击。

禁止的分析：

- 原始 JSON 文本。
- 键、值、片段或文件名。
- 剪贴板内容。
- 包含用户 JSON 的 URL 参数。
- 可识别用户身份的调试载荷。

## 12. 非目标

V3 不应包含：

- 复制竞品的品牌或 UI。
- 发布无法工作的虚假工具。
- 用户账户。
- 云端保存。
- 可分享的 JSON 链接。
- 服务端解析。
- 在内容和流量基础更强之前上线实时广告。
- 付费套餐。
- 未经用户明确审核就重写 JSON 的自动修复。

## 13. 分阶段计划

### 阶段 1：修复入口问题

发布核心路由扩展：

- 首页重新定位。
- `/tools/` 中心。
- Formatter、Validator、Minifier、Beautifier、Pretty-print、Error-finder 和 Fix-invalid-json 页面。
- 扩展页脚和内部链接模块。
- 更新 sitemap 和测试。

### 阶段 2：增加变换意图

发布：

- JSON 转义和反转义。
- JSON 转字符串和字符串转 JSON。
- JSON 键排序器。
- 配套指南。

### 阶段 3：增加转换意图

仅在工具真实可用时发布：

- JSON 转 CSV。
- CSV 转 JSON。
- JSON 转 XML。
- XML 转 JSON。
- 有清晰实现路径时增加比较或 diff 工具。

## 14. 验收标准

V3 完成时：

- 网站至少有 25 个可索引、互相链接的页面。
- 首页首屏仍提供可工作的 JSON 工具。
- 构建输出包含所有工具、指南、信任、sitemap 和 robots 路由的静态 HTML。
- 每个可索引页面都有 title、meta description、canonical、Open Graph 标签和相关 JSON-LD。
- 每个核心工具页都有可见且可工作的浏览器本地工具。
- 每个指南页都链接到相关工具页以及至少两个相关页面。
- `sitemap.xml` 包含所有公开路由。
- `robots.txt` 引用 sitemap。
- `npm test`、`npm run lint` 和 `npm run build` 通过。
- 没有任何代码路径上传或存储 JSON 输入。

## 15. 成功指标

上线后跟踪：

- Google Search Console 中核心工具查询的展示次数。
- `/json-formatter/`、`/json-validator/`、`/json-minifier/` 和 `/fix-invalid-json/` 的自然点击。
- 自然搜索访客与编辑器交互的比例。
- 展示诊断后从无效变为有效的会话比例。
- 已索引页面数量。
- 有展示但 CTR 较低的页面，用于迭代标题和元描述。

30 天目标：

- 已索引页面达到 25 个以上。
- Google Search Console 总展示次数达到 500 次以上。
- 自然搜索访问达到 100 次以上。
- 30% 以上的无效会话最终变为有效。
