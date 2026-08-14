# SEO 外部提交清单

English version: [seo-external-submission-checklist.md](./seo-external-submission-checklist.md)

SEO Phase 2 部署后使用这份清单。目标不是做垃圾外链，而是给 Google 和开发者用户更多合法路径发现 `https://jsonfmt.org/`。

## 优先级 1：自有开发者资料页

| 渠道 | 目标链接 | 操作 | 状态 | 备注 |
| --- | --- | --- | --- | --- |
| GitHub profile README | `https://jsonfmt.org/` | 将 JSONFmt 作为浏览器本地 JSON formatter 和 error finder 加入资料页。 | 未开始 | 使用自然品牌锚文本。 |
| GitHub 项目 README | `/json-error-finder/` 或 `/guides/` | 创建或更新一个小型 JSON examples 仓库，并链接到相关指南中心。 | 未开始 | 示例要有实际价值，不要只宣传。 |
| 个人网站或作品集 | `https://jsonfmt.org/` | 在 developer tools 或 side projects 中加入 JSONFmt。 | 未开始 | 从可索引页面链接。 |
| CNB / 代码托管资料页 | `https://jsonfmt.org/tools/` | 将 JSONFmt 作为公开 JSON 工具加入。 | 未开始 | 遵守平台资料页规则。 |

## 优先级 2：开发者社区

| 渠道 | 目标链接 | 操作 | 状态 | 备注 |
| --- | --- | --- | --- | --- |
| DEV.to | `/guides/unexpected-token-less-than-in-json/` | 发布一篇关于 API 返回 HTML 而不是 JSON 的短文。 | 未开始 | 加入真实排查清单。 |
| Hashnode | `/guides/json-parse-unexpected-token-u/` | 发布一篇关于 undefined 和 JSON.parse 的文章。 | 未开始 | 使用原创示例。 |
| Medium | `/guides/is-online-json-formatter-safe/` | 发布一篇隐私优先 JSON 格式化文章。 | 未开始 | 不要整篇复制站内内容。 |
| Reddit 或 Stack Overflow 资料页 | `https://jsonfmt.org/` | 只在允许的资料页中加入链接。 | 未开始 | 不发布推广型回答。 |

## 优先级 3：工具目录

| 目录类型 | 目标链接 | 操作 | 状态 | 备注 |
| --- | --- | --- | --- | --- |
| 开发者工具目录 | `https://jsonfmt.org/` | 提交 JSONFmt，定位为免费的浏览器本地 JSON formatter。 | 未开始 | 每个目录使用不同描述。 |
| Startup / tool listing 网站 | `https://jsonfmt.org/tools/` | 分类匹配时提交。 | 未开始 | 跳过低质量目录。 |
| 隐私工具列表 | `/privacy/` 和首页 | 主打浏览器本地处理角度。 | 未开始 | 不夸大安全能力。 |
| 开源资源列表 | `/guides/` | 将 JSON 错误指南库作为学习资源推荐。 | 未开始 | 只提交到真正有用的位置。 |

## 优先级 4：Search Console 跟进

- 部署后提交 `https://jsonfmt.org/sitemap.xml`。
- 为首页、`/tools/`、核心工具页和 20 篇 Phase 2 指南页请求收录。
- 24-72 小时后重新检查索引状态。
- 每周在 `gsc-monitoring-table.md` 中记录 impressions、clicks、CTR 和 average position。
- 如果页面有展示但 CTR 低，优先改 title 和 description。
- 如果页面已抓取但未收录，增强内容独特性、内部链接和外部发现入口。

## 规则

- Do not buy links。
- 不使用 PBN 私有博客网络。
- 不批量提交低质量目录。
- 不在每个平台复制同一篇文章。
- 不把私有 JSON payload 粘贴到公开示例中。
- 优先发布实用排查文章和有价值资源链接，而不是推广帖。
