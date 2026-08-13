# 双面板 JSON 工作区设计

English version: [2026-08-09-homepage-two-panel-design.md](./2026-08-09-homepage-two-panel-design.md)

## 目标

让 JSONFmt 首页和 JSON 工具页首先体现格式化器的定位：用户在左侧粘贴源 JSON，选择操作，然后在右侧获得只读结果。

## 已确认的决定

- 首页和每个 JSON 工具页都有两个同等重要的面板：`JSON Input` 和 `Output`。
- 点击 `Format`、`Validate` 和 `Minify` 后，左侧输入内容保持不变。
- 右侧面板只读。
- 只有用户点击操作后才显示结果；输入时不自动预览格式化结果。
- `Format` 和 `Minify` 将结果写入右侧面板。
- 操作失败时，清除旧结果并替换为当前错误诊断。
- 用户在执行操作后修改左侧输入时，右侧结果仍然显示，但要展示结果已过期的提示，直到用户重新执行相关操作。
- 只有右侧面板包含格式化或压缩后的 JSON 时，才显示 `Copy Output` 和 `Use output as input`。
- 视觉风格采用纯白、干净的设计，以青绿色作为主强调色。
- 避免黑色或接近黑色的页面背景，使用浅灰色边框和轻微阴影。

## 布局

首屏包含紧凑标题、单行命令栏和双列工作区。

- 命令栏：`Format JSON`、`Validate`、`Minify`、`Upload` 和 `Clear`。
- 输入面板：可编辑的 Monaco 编辑器，支持上传和拖放。
- 输出面板：只读代码结果或诊断状态。
- 输出面板标题栏：结果状态、`Copy Output` 和 `Use output as input`。

现有隐私区域、工具链接、指南、FAQ 和页脚保留在工作区下方。静态指南、条款、隐私和联系页面不渲染编辑器工作区。

## 输出状态

| 状态 | 右侧面板内容 |
| --- | --- |
| Empty | 简短提示，指导用户粘贴 JSON 并执行操作。 |
| Formatted 或 minified | 带有结果标签的只读 JSON 文本。 |
| Validation success | 包含根类型和项目数量的有效 JSON 摘要。 |
| Invalid action | 错误位置、解释、建议和附近上下文。 |
| Stale result | 保留已有结果，同时提示输入已变化，需要重新执行操作。 |
