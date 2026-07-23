# idea-studio 设计规范（Dark Theme）

## 色彩 Token 分类

| 分类 | 格式 | 说明 |
| - | - | - |
| Base Colors | `hex` | `--color-white`、`--color-black` 基础色 |
| Backgrounds & Surfaces | `hex` | 背景层级：`--color-bg` → `--color-surface` → `--color-surface-elevated` |
| Text | `hex` | 文字层级：`--color-heading` → `--color-text` → `--color-text-secondary` → `--color-text-tertiary` → `--color-text-disabled` |
| Border | `hex` + `oklch` | `--color-border`（基础边框 hex）；`--color-border-active`（焦点/活跃边框 oklch） |
| Placeholder | `hex` | 占位符文本 |
| Link | `oklch` | `--color-link` → `hover` → `active`，交互态亮度递减 |
| Brand / Primary | `oklch` | `--color-primary` → `hover` → `active`，交互态亮度递减 |
| Semantic | `oklch` | `--color-{success/warning/danger/info}` → `hover` → `active`，交互态亮度递减 |
| Status | `oklch` | 项目卡片状态（drafting / designing / testing / completed），仅基础色 |
| MD Components | `hex` + `oklch` | Markdown 渲染专用（`--color-md-*`），临时分组，后续稳定后重新归类 |
| Nav Components | `oklch` + `rgba` | 导航/目录专用（`--color-nav-*`），临时分组，后续稳定后重新归类 |

## 命名规范

- `--color-{name}` — 基础色（hex / oklch）
- `--color-{name}-hover` — 悬停态（oklch，降低亮度 `L`）
- `--color-{name}-active` — 激活态（oklch，进一步降低亮度 `L`）
- 同色系 hover / active 保持色相 `H` 和饱和度 `C` 不变，仅降低明度 `L` 约 10%
- 组件级临时 token 使用 `--color-{组件缩写}-{用途}` 命名，如 `--color-md-alert-bg`、`--color-nav-text`

## 使用示例

```scss
.button-primary {
  background: var(--color-primary);
  color: var(--color-white);

  &:hover { background: var(--color-primary-hover); }
  &:active { background: var(--color-primary-active); }
}

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
