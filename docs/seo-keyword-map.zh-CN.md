# JSONFmt SEO 关键词地图

更新日期：2026-08-12

这份地图让每个可收录页面围绕一个主关键词展开，帮助 JSONFmt 建立主题权威，同时避免多个页面争夺同一个搜索意图。

English version: [seo-keyword-map.md](./seo-keyword-map.md)

## 核心工具页面

| URL | 主关键词 | 次级意图 | 搜索意图 | 页面角色 |
| --- | --- | --- | --- | --- |
| `/` | 主关键词：json formatter and validator（JSON 格式化与验证） | online JSON formatter、validate JSON、minify JSON | 混合工具意图 | 面向希望快速完成 JSON 处理的用户，作为网站的主要入口。 |
| `/tools/` | 主关键词：JSON tools（JSON 工具） | JSON formatter tools、JSON validator tools、JSON minifier | 工具集合页 | 连接所有任务型页面的内部链接中心。 |
| `/json-formatter/` | 主关键词：json formatter（JSON 格式化器） | format JSON online、JSON formatter online、beautify JSON | 工具操作 | 覆盖广泛的 JSON 格式化需求。 |
| `/json-validator/` | 主关键词：json validator（JSON 验证器） | validate JSON online、check JSON syntax、JSON syntax checker | 工具操作 | 覆盖严格 JSON 语法验证需求。 |
| `/json-minifier/` | 主关键词：json minifier（JSON 压缩器） | minify JSON online、compress JSON、compact JSON | 工具操作 | 覆盖压缩输出和移除空白字符的需求。 |
| `/json-beautifier/` | 主关键词：json beautifier（JSON 美化器） | beautify JSON online、pretty JSON、readable JSON | 工具操作 | 覆盖使用 “beautifier” 关键词进行搜索的用户。 |
| `/json-pretty-print/` | 主关键词：json pretty print（JSON 美化打印） | pretty print JSON online、JSON pretty printer | 工具操作 | 覆盖 “pretty print” 表达，同时避免与 formatter 页面互相争夺。 |
| `/json-error-finder/` | 主关键词：json error finder（JSON 错误查找器） | find JSON error、JSON syntax error finder、JSON parse error tool | 错误诊断工具 | 覆盖定位 JSON 错误行号和列号的需求。 |
| `/fix-invalid-json/` | 主关键词：fix invalid json（修复无效 JSON） | repair JSON syntax、invalid JSON checker、JSON fix guide | 错误诊断工具 | 覆盖需要修复指导的无效 JSON 用户。 |
| `/json-viewer/` | 主关键词：json viewer（JSON 查看器） | view JSON online、JSON reader、readable JSON viewer | 工具操作 | 覆盖在线查看、读取和检查 JSON 的需求。 |

## 现有指南集群

| URL | 主关键词 | 搜索意图 |
| --- | --- | --- |
| `/guides/trailing-comma-in-json/` | 主关键词：trailing comma in JSON（JSON 末尾逗号） | 错误修复 |
| `/guides/unexpected-token-in-json/` | 主关键词：unexpected token in JSON（JSON 中出现意外 token） | 错误修复 |
| `/guides/single-quotes-in-json/` | 主关键词：single quotes in JSON（JSON 使用单引号） | 错误修复 |
| `/guides/unquoted-property-name-in-json/` | 主关键词：unquoted property name in JSON（JSON 属性名未加引号） | 错误修复 |
| `/guides/unclosed-string-in-json/` | 主关键词：unclosed string in JSON（JSON 字符串未闭合） | 错误修复 |
| `/guides/comments-in-json/` | 主关键词：comments in JSON（JSON 中的注释） | 错误修复 |
| `/guides/how-to-format-json/` | 主关键词：how to format JSON（如何格式化 JSON） | 操作教程 |
| `/guides/how-to-validate-json/` | 主关键词：how to validate JSON（如何验证 JSON） | 操作教程 |
| `/guides/how-to-minify-json/` | 主关键词：how to minify JSON（如何压缩 JSON） | 操作教程 |
| `/guides/json-formatter-vs-validator/` | 主关键词：json formatter vs validator（JSON 格式化器与验证器对比） | 对比 |

## 长尾指南集群

| URL | 主关键词 | 次级意图 | 搜索意图 | 链接到 |
| --- | --- | --- | --- | --- |
| `/guides/unexpected-end-of-json-input/` | 主关键词：unexpected end of JSON input（JSON 输入意外结束） | JSON.parse unexpected end、end of JSON input error | 错误修复 | `/json-error-finder/`、`/json-validator/` |
| `/guides/bad-control-character-in-json/` | 主关键词：bad control character in JSON（JSON 中存在非法控制字符） | bad control character in string literal、invalid control character JSON | 错误修复 | `/json-error-finder/`、`/json-validator/` |
| `/guides/missing-comma-in-json/` | 主关键词：missing comma in JSON（JSON 缺少逗号） | expected comma JSON、JSON comma error、missing comma after property | 错误修复 | `/json-error-finder/`、`/json-formatter/` |
| `/guides/expected-double-quoted-property-name/` | 主关键词：expected double-quoted property name（属性名必须使用双引号） | object keys must be quoted、property name JSON error | 错误修复 | `/json-error-finder/`、`/json-validator/` |
| `/guides/json-parse-error/` | 主关键词：JSON parse error（JSON 解析错误） | JSON.parse error、parse invalid JSON、JSON syntax error | 错误修复 | `/json-error-finder/`、`/json-validator/` |
| `/guides/unexpected-token-less-than-in-json/` | 主关键词：unexpected token < in JSON（JSON 中出现意外的 `<` token） | response returned HTML、fetch response.json error | 错误修复 | `/json-error-finder/`、`/json-validator/` |
| `/guides/strict-json-vs-json5/` | 主关键词：strict JSON vs JSON5（严格 JSON 与 JSON5 对比） | JSON5 comments、strict JSON syntax、JSON5 vs JSON | 格式选择 | `/json-validator/`、`/guides/comments-in-json/` |
| `/guides/is-online-json-formatter-safe/` | 主关键词：is online JSON formatter safe（在线 JSON 格式化器是否安全） | private JSON formatter、browser-local JSON tool、safe JSON validation | 信任与安全 | `/json-formatter/`、`/privacy/` |

## 内容规则

- 一个页面只围绕一个主关键词展开。
- 工具页面应快速满足操作意图，并让可工作的 JSON 编辑器尽量靠近页面顶部。
- 指南页面应在前 100 个单词内直接回答对应错误，展示错误 JSON 和修复后的 JSON，并链接到最相关的工具。
- 相关链接应连接 formatter、validator、minifier、error finder 和指南页面，避免新页面成为孤立页面。
- 在对应工具真正可用之前，不要发布单薄的转换类页面。
