# Search Console 收录检查清单

English version: [search-console-indexing-checklist.md](./search-console-indexing-checklist.md)

部署 `https://jsonfmt.org/` 后使用这份清单。

## 1. 验证资源

推荐方式：在 Google Search Console 中添加 Domain 属性，并通过 DNS 完成验证。

备选方式：使用 HTML 标签验证。只复制 Google 提供的 token 值，并在构建时设置：

```bash
GOOGLE_SITE_VERIFICATION=your-token npm run build
```

构建过程会在首页和生成的静态页面中加入验证标签：

```html
<meta name="google-site-verification" content="your-token">
```

## 2. 提交 Sitemap

在 Search Console 中提交以下 sitemap：

```text
https://jsonfmt.org/sitemap.xml
```

部署后确认以下 URL 返回 `200`：

```text
https://jsonfmt.org/
https://jsonfmt.org/robots.txt
https://jsonfmt.org/sitemap.xml
```

## 3. 请求核心 URL 收录

使用 URL 检查工具，为以下页面请求收录：

```text
https://jsonfmt.org/
https://jsonfmt.org/json-formatter/
https://jsonfmt.org/json-validator/
https://jsonfmt.org/json-minifier/
https://jsonfmt.org/json-error-finder/
https://jsonfmt.org/tools/
https://jsonfmt.org/guides/
```

## 4. 观察初期信号

24 到 72 小时后再次检查 Search Console：

- 页面收录：已提交的 URL 应逐步离开“已发现”或“已抓取”状态。
- Sitemap：已提交的 sitemap 应显示已发现的 URL 数量。
- 效果：展示次数可能早于点击出现。

新网站的抓取或收录可能较慢，因此应以 Search Console 状态为准，不要只依赖 `site:jsonfmt.org` 搜索。
