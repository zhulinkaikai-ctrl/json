# Google Search Console 监控表

English version: [gsc-monitoring-table.md](./gsc-monitoring-table.md)

SEO Phase 2 部署后每周使用这张表。部署 7 天后记录第一组数据，之后每周更新。目标是根据 Search Console 证据决定下一步 SEO 动作，而不是靠猜。

## 每周页面跟踪

| 周次 | URL | 主关键词 | 索引状态 | 展示次数 | 点击 | CTR | 平均排名 | 动作 |
| --- | --- | --- | --- | ---: | ---: | ---: | ---: | --- |
| 第 1 周 | `/guides/json-parse-unexpected-token-o/` | JSON.parse unexpected token o | 待确认 | 0 | 0 | 0% | - | 部署后请求收录。 |
| 第 1 周 | `/guides/json-parse-unexpected-token-u/` | JSON.parse unexpected token u | 待确认 | 0 | 0 | 0% | - | 部署后请求收录。 |
| 第 1 周 | `/guides/unexpected-token-less-than-in-json/` | unexpected token < in JSON | 待确认 | 0 | 0 | 0% | - | 出现展示后观察 CTR。 |
| 第 1 周 | `/json-error-finder/` | json error finder | 待确认 | 0 | 0 | 0% | - | 从新指南增加链接。 |
| 第 1 周 | `/fix-invalid-json/` | fix invalid json | 待确认 | 0 | 0 | 0% | - | 从修复类指南增加链接。 |

## 决策规则

| 信号 | 含义 | 下一步动作 |
| --- | --- | --- |
| 已索引但 14 天后展示为 0 | 关键词可能太弱，或页面发现信号不足。 | 增加内部链接和 1 个外部发现链接。 |
| 有展示但 CTR 低于 1% | 标题或描述不够吸引点击。 | 不改 URL，重写 title 和 meta description。 |
| 平均排名 20-50 | Google 理解页面，但排名较弱。 | 扩展示例、加入相关问题、增强内部链接。 |
| 已抓取但未索引 | Google 可能认为独特性或需求不足。 | 增加原创排查价值，并从更强页面链接过去。 |
| 未发现 | Google 还没有稳定发现页面。 | 检查 sitemap 部署、内部链接和外部链接。 |

## 查询跟踪

| 查询 | 目标 URL | 展示次数 | 点击 | 平均排名 | 备注 |
| --- | --- | ---: | ---: | ---: | --- |
| `JSON.parse unexpected token o` | `/guides/json-parse-unexpected-token-o/` | 0 | 0 | - | Phase 2 目标。 |
| `JSON.parse unexpected token u` | `/guides/json-parse-unexpected-token-u/` | 0 | 0 | - | Phase 2 目标。 |
| `unexpected token < in JSON` | `/guides/unexpected-token-less-than-in-json/` | 0 | 0 | - | 现有高价值页面。 |
| `invalid escape character in JSON` | `/guides/invalid-escape-character-in-json/` | 0 | 0 | - | Phase 2 目标。 |
| `empty response JSON parse error` | `/guides/empty-response-json-parse-error/` | 0 | 0 | - | Phase 2 目标。 |

## 每周流程

1. 打开 Search Console Performance。
2. 按页面组 `/guides/` 过滤。
3. 导出最近 7 天的查询和页面数据。
4. 更新上面的表格。
5. 每周只选择 3 个页面优化。
6. 只有在内容或标题有实质更新后，才通过 URL Inspection 重新提交页面。
