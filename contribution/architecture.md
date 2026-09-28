# 架构速查 · idea-studio

> 事实来源：`src/**`、`vite.config.ts`、`.github/workflows/deploy.yml`。
> **本文件可能过期：改动前先读源码，以代码为准。**

## 整体架构

```
index.html → src/main.ts → App.vue
                              ├── FixedHeader（桌面 nav / 移动汉堡菜单）
                              └── RouterView
                                    ├── (home)/index.vue                 首页卡片
                                    ├── [category]/[idea]/index.vue      创意主页
                                    ├── [category]/[idea]/[...path].vue  子文档
                                    └── (home)/[...path].vue             404 兜底
内容层：src/ideas/{category}/{idea}/**.md   ← 构建期以 ?raw 字符串内联
渲染层：MarkdownRenderer（marked + 自研扩展）→ v-html
导航层：MarkdownAside（提取 h1—h3 → 目录树）
```

**没有服务端**：所有内容在构建时打包进 JS，运行时只做字符串解析与渲染。

## 关键路由（vue-router 约定式）

| 文件 | 路径 | 说明 |
| - | - | - |
| `src/pages/(home)/index.vue` | `/` | `(home)` 是路由分组，不出现在 URL |
| `src/pages/[category]/[idea]/index.vue` | `/:category/:idea` | 加载 `index.md` + 子文档树 |
| `src/pages/[category]/[idea]/[...path].vue` | `/:category/:idea/:path(.*)` | 子文档，兼容带/不带 `.md` |
| `src/pages/(home)/[...path].vue` | `/:path(.*)` | 单段未知路径兜底，渲染 `404.md` |

> 多段未知路径（如 `/foo/bar`）会先命中 `/:category/:idea`：`getIndexDoc` 找不到 `index.md` 时返回 `null`，页面同样渲染 `404.md`（只是右侧目录为空）。**两条路径视觉一致，不要误以为兜底页失效。**

路由实例在 `src/router/index.ts`：`vue-router/auto-routes` 提供 `routes`，dev 下 `handleHotUpdate` 支持路由热更新；hash/history 由 `VITE_TARGET_ENV` 决定；`scrollBehavior` 返回顶部、后退时用 `animateScrollTo` 平滑回位。

## 内容加载（`src/utils/index.ts`）

统一用 `import.meta.glob(..., { query: 'raw', import: 'default', eager: false })` 做**惰性**加载：

- `getIndexDoc(category, idea)`：glob `@/ideas/*/*/index.md`，按路径后缀匹配。
- `getSubDoc(category, idea, subPath)`：glob `@/ideas/*/*/**/*.md`，按后缀匹配（不带 `.md` 的 subPath 由调用方规范化）。
- `getDocsTree(category, idea)`：扫描该创意全部子文档，读内容后解析标题 → `DocTreeItem{ name, title, link, children }`；排序为"文件夹在前，文件按名排序"。
- `parseDocTitle`：优先 frontmatter `title:` → 第一个 `# 标题` → 文件名。
- `renderDocsTreeToMarkdown`：把树渲染成 `## 相关子文档` 片段再交给渲染器，保持"内容即 Markdown"的一致性。

## Markdown 渲染管线（`src/hooks/useMdParser/`）

- `index.ts` 创建**模块级单例** `Marked`（`breaks: true`、`gfm: true`），注册 4 个自研扩展 + 一组基础 renderer 覆盖。
- 扩展（各自 `tokenizer` + `renderer`，类型在 `types.ts` 用 `declare module 'marked'` 增强）：
  `validity-tag`（inline）、`class-view`（block，需传入 marked 递归渲染）、`alert`（block，需传入 marked）、`meta`（文档头 frontmatter → `div.md-meta[data-*] hidden`）。
- 基础 renderer 覆盖要点：
  - heading → `<hN id="..." class="md-heading md-hN"><span class="md-heading-text">`，id 由文本去标签后空格转 `-` 生成（`extractHeadings` 用同一算法，保证与目录锚点一致）。
  - 单独成段的图片 → `<figure class="md-img-container">` + `<figcaption>`（图片 `title` 作图注）。
  - link：`http(s)://` 外链加 `target="_blank" rel="noopener noreferrer"`；其余加 `data-router-link`。
  - table 包一层 `div.md-table-wrapper` 支持横向滚动，对齐用内联 `style="text-align"`。
  - `tokenizer.del()` 返回 `false` 是修复 marked 已知 issue 的兼容处理（注释里有链接）。

## 数据流范式（各页面统一写法）

`inited = ref(false)` + `watch(() => [route.params...], async () => {...}, { immediate: true })`：先重置加载态 → 异步取内容 → 设置 `document.title` → 置 `inited = true`。404 时用 `doc404` 渲染 404 主题。

## Vite 层自定义

- `markdownRawPlugin`：`transform` 中拦截 `.md`，直接 `fs.readFileSync` 返回 `export default <字符串>`，因此 `.md` 可被 `import` 与 `?raw` 双通道使用。
- `build.rolldownOptions.output.codeSplitting.groups`：按 `/ideas/{category}/{idea}/` 正则命名分包（`${category}-${idea}`），优先级 100 —— **重命名创意目录会改变 chunk 名**。

## 环境变量与部署

- `VITE_TARGET_ENV`（`vite.config.ts#getBase` 与 `src/router/index.ts` 共同使用）：
  - `pages`：GitHub Pages。`base = /idea-studio/`，hash 模式路由。
  - `hash`：不支持 SPA 回退的服务器。`base = /`，hash 模式路由。
  - 缺省（未设置）：history 模式，`base = /`。
- CI：`.github/workflows/deploy.yml`，push 到 `deploy` 分支 → `VITE_TARGET_ENV=pages pnpm build` → 发布 `dist` 到 gh-pages。
- 手动发布：`pnpm deploy`（`shell/deploy.sh` 把本地 `master` 强推到 `deploy` 触发流水线）。

## 工具链注意事项

- TypeScript `~6.0`、Vite `^8`（rolldown 变体，配置项为 `rolldownOptions`）、ESLint `^10`（flat config）都是较激进的版本：**升级依赖时容易碰 API 变化**。
- `typed-router.d.ts` 由插件生成、已提交仓库，**不要手改**。
- 可用 Skill（本仓库/环境）：`boardgame-design`（桌游设计流程，仓库内副本 `.cline/skills/boardgame-design/`）、`doc-writing`、`dev-code-review` / `dev-cs-vue` / `dev-flow` / `dev-setup-project`、`skills-mgmt`。
