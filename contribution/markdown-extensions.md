# 自定义 Markdown 语法速查 · idea-studio

> 实现：`src/hooks/useMdParser/*` ｜ 样式：`src/components/MarkdownRenderer.vue`（第二个 `<style>` 块，非 scoped）
> 这些语法是给**写内容的人**用的，改动需同时改扩展与样式。

## 1. alert 提示块（block）

```markdown
!!! 标题文字
正文内容，支持 **Markdown**，会递归渲染。
!!!
```

- 可带变体：`!!! warning: 标题文字`
- 输出：`<div class="md-alert md-alert-default|md-alert-{variant}"><div class="md-alert-title">…</div><div class="md-alert-content">…</div></div>`
- 实现：`alert-extension.ts`（正则：首行 `!!!` + 可选 `变体: 标题`，以单独一行 `!!!` 收尾）
- ⚠️ 现状：CSS 只定义了 `.md-alert-default` 的背景色；使用自定义变体时**没有背景样式**（只有标题/内容排版）。当前 `src/ideas/` 中还没有实际用例。

## 2. class-view 自定义样式区块（block）

```markdown
~~~class-view:类名
区块内容，会递归渲染为 Markdown
~~~
```

- 输出：`<div class="类名">…</div>`
- 实现：`class-view-extension.ts`
- ✅ 真实用例：`src/ideas/trip/2026新疆攻略/index.md` 使用 `~~~class-view:sox-info-view` 包裹日程表。
- ⚠️ 注意：`sox-info-view` 这个类名**在当前仓库里没有对应样式定义**（外部/历史约定）。如果你要新建样式区块，务必在使用处对应添加样式，放在 `MarkdownRenderer.vue` 的全局 style 块或 `main.scss` 中。

## 3. validity-tag 时效性标签（inline）

```markdown
!:2026:7:!
```

- 输出：`<span class="md-validity-tag">时效性：本文撰写于2026年7月</span>`
- 实现：`validity-tag-extension.ts`；月份 `1-2` 位数字，渲染时 `parseInt` 去前导零。
- ✅ 真实用例：`src/ideas/trip/2026新疆攻略/index.md` 第 3 行（紧跟标题，形成副标题下方的标签居中效果）。
- 样式变量：`--color-md-validity-tag`。

## 4. meta 文档元数据（frontmatter，block）

```markdown
---
category: boardgame
tags: [boardgame, 2026]
copyright: Copyright (c) 2026 侠小然
license: CC BY-NC-ND 4.0 (https://creativecommons.org/licenses/by-nc-nd/4.0/)
---
```

- 只识别**文档最开头**的 `---…---`；每行必须匹配 `key: value`（否则整体不匹配，按普通文本/bypass 处理）。
- 数组写法 `[a, b]` 会被压成逗号串 `a,b`；值里的 `"` 会转义。
- 输出：`<div class="md-meta" data-category="…" data-tags="…" hidden></div>`
- 实现：`meta-extension.ts`
- 用途：① `parseDocTitle`（`src/utils/index.ts`）会优先读取 `title:` 作为子文档列表标题；② 其余 `data-*` 目前**没有任何 JS 消费**，纯占位/未来扩展。
- ✅ 真实用例：`src/ideas/boardgame/罪恶都市/index.md`、`draft-5-A/*.md`、`test/测试1/index.md` 等。

## 5. 基础渲染约定（写内容时需要知道的副作用）

| 语法 | 行为 |
| - | - |
| 标题 | 自动生成 `id`（文本去标签、空格转 `-`），用于目录锚点 |
| 单独成段的图片 | 包成 `<figure>`；图片 `title` 会变成图注 `<figcaption>` |
| 链接 | `http(s)://` 自动新窗口打开；其他（站内路径）走前端路由跳转（Ctrl/Cmd 点击仍可新标签） |
| 表格 | 自动包横向滚动容器，对齐方式按 Markdown 对齐语法内联实现 |
| 换行 | `breaks: true`：单个换行即换行（写文档时注意不要随手折行破坏排版） |
| 列表 | 支持嵌套；`<li>` 内可用完整 Markdown |
| 删除线 `~~text~~` | marked 删除线的 tokenizer 被显式禁用（兼容性修复），**不要依赖删除线** |

## 6. 新增语法扩展的步骤（如需）

1. 在 `src/hooks/useMdParser/types.ts` 的 `declare module 'marked'` → `namespace Tokens` 中加 token 接口。
2. 新建 `xxx-extension.ts`，导出 `createXxxExtension()`，实现 `{ name, level, start, tokenizer, renderer }`；需要递归渲染时接收 `marked` 实例（参照 `class-view` / `alert`）。
3. 在 `src/hooks/useMdParser/index.ts` 里 `marked.use(createXxxExtension())`。
4. 在 `MarkdownRenderer.vue` 第二个（非 scoped）`<style>` 块添加样式，颜色取 `theme-dark.scss` token（建议新建 `--color-md-xxx` 临时分组变量）。
5. 在本文件补一段语法说明与真实用例。
