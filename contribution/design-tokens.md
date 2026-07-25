# idea-studio 设计规范（Dark Theme）

## 色彩 Token 分类

| 分类 | 格式 | 说明 |
| - | - | - |
| Base Colors | `hex` | `--color-white`、`--color-black` 基础色 |
| Backgrounds & Surfaces | `hex` | 背景层级：`--color-bg` → `--color-surface` → `--color-surface-elevated` |
| Text | `hex` | 文字层级：`--color-heading` → `--color-text` → `--color-text-secondary` → `--color-text-tertiary` → `--color-text-disabled` |
| Border | `hex` + `oklch` | `--color-border`（基础边框 hex）；`--color-border-active`（焦点/活跃边框 oklch） |
| Placeholder | `hex` | 占位符文本 |
| Link | `oklch` | 引用 Primary 色阶：`--color-link` → `--color-link-hover` → `--color-link-active`，依次对应 `--color-primary-light-1/3/5` |
| Brand / Primary | `oklch` | 品牌色，提供 5 级亮色阶（`-light-1` ~ `-light-5`）和 5 级暗色阶（`-dark-1` ~ `-dark-5`） |
| Semantic | `oklch` | 语义色（success / warning / danger / info / muted），每色同步提供 5 级亮暗色阶 |
| MD Components | `hex` + `oklch` | Markdown 渲染专用（`--color-md-*`），临时分组，后续稳定后重新归类 |
| Nav Components | `oklch` + `rgba` | 导航/目录专用（`--color-nav-*`），临时分组，后续稳定后重新归类 |

## 色阶层级说明

每个状态色（Brand / Semantic）均包含 5 级亮色阶（`-light-1` ~ `-light-5`）和 5 级暗色阶（`-dark-1` ~ `-dark-5`），色相 `H` 和饱和度 `C` 保持不变，仅明度 `L` 递增（亮色阶）或递减（暗色阶）。

各层级用途如下：

| 层级 | 用途 |
| - | - |
| `--color-{name}`（无后缀） | **主色**。作为该颜色的品牌/语义基准值 |
| `--color-{name}-light-1` | **纯文本默认色**。如果该颜色用于纯文本（非按钮、非背景），默认使用此色值 |
| `--color-{name}-light-3` | **文本 hover 态**。纯文本在悬停状态下的颜色 |
| `--color-{name}-light-5` | **文本 focus 态**。纯文本在聚焦状态下的颜色 |
| `--color-{name}-light-4`（文本）<br>`--color-{name}-dark-5`（背景） | **Tag / 标签组合**。当该颜色用于标签组件时，`light-4` 作为文本色，`dark-5` 作为背景色 |
| 其他色阶 | 暂未使用，预留扩展 |

## 命名规范

- `--color-{name}` — 主色（hex / oklch）
- `--color-{name}-light-{1~5}` — 亮色阶（oklch，明度 `L` 递增）
- `--color-{name}-dark-{1~5}` — 暗色阶（oklch，明度 `L` 递减）
- `--color-{name}-{usage}` — 特定用途引用，如 `--color-link-hover`、`--color-link-active`
- 同色系亮/暗色阶保持色相 `H` 和饱和度 `C` 不变，仅调整明度 `L`
- 组件级临时 token 使用 `--color-{组件缩写}-{用途}` 命名，如 `--color-md-alert-bg`、`--color-nav-text`

## 使用示例

```scss
// 按钮组件：使用无后缀主色作为背景
.button-primary {
  background: var(--color-primary);
  color: var(--color-white);

  &:hover { background: var(--color-primary-dark-1); }
  &:active { background: var(--color-primary-dark-2); }
}

// 纯文本链接：使用 -light-1 作为默认，-light-3 hover，-light-5 focus
.link-primary {
  color: var(--color-primary-light-1);

  &:hover { color: var(--color-primary-light-3); }
  &:focus-visible { color: var(--color-primary-light-5); }
}

// 标签/Tag：light-4 作为文本，dark-5 作为背景
.tag-primary {
  color: var(--color-primary-light-4);
  background: var(--color-primary-dark-5);
  border-radius: 4px;
  padding: 2px 8px;
}

// 卡片表面
.card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  color: var(--color-text);
}

// 导航菜单二级菜单项
.menu-item--level-2 {
  color: var(--color-nav-text);
}

// Markdown alert 块
.md-alert-default {
  background: var(--color-md-alert-bg);
}
```

## 文件结构

```shell
src/assets/
├── theme-dark.scss    ← 所有 CSS 变量（:root）
├── base.scss          ← @use 'theme-dark'; + 全局重置
└── main.scss          ← @use 'base'; + 应用层样式
```
