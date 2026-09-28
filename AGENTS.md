# AGENTS.md

## 命令与验证

- `pnpm dev`：本地开发（绑 `0.0.0.0`，便于手机/局域网访问）
- `pnpm build`：`run-p type-check build-only` —— **构建通过就等于类型检查通过**
- 改站点代码（`src/` 的组件、工具、样式）后：必须 `pnpm build`（或 `pnpm type-check`）通过
- 改 `src/ideas/**` 里的 Markdown 文案后：**不要跑构建来"验证"** —— 构建只把 `.md` 当字符串内联、**不解析正文**；验证只能靠回读原文、核对引用与计算
- **本仓库没有测试框架**（`package.json` 里没有 `test` 脚本）：不要新增测试脚本，也不要声称"测试通过"；命令一律以 `package.json` 的 scripts 为准
- 改完代码跑 `pnpm lint` 与 `pnpm format`

## 内容改动（`src/ideas/**`）

- **内容是产品**：`src/ideas/**` 是受版权保护的内容资产（CC BY-NC-ND 4.0，见 `src/ideas/LICENSE`），不是示例数据 —— **不要重构、重命名、批量格式化**创意内容
- 不要改 `archived/**`，也不要"修复"其中不可点的相对链接：档案保留历史语义，**不保证作为当前站点导航可点，这是刻意设计**（见该目录的 `README.md`）
- 新增创意：建 `src/ideas/{category}/{idea}/index.md`，并在 `src/constants/ideas.ts` **注册一条**；创意必须位于**第二层**目录（glob 只扫 `@/ideas/*/*/**/*.md`）
- 出现"改了没效果"时，先按顺序查：**没注册 / 目录层级不对 / 没重新构建** —— 再怀疑代码

## 代码改动（`src/` 其余部分）

- 不要手改 `typed-router.d.ts`（插件生成物，但已提交仓库）
- 新增 Markdown 语法必须**同时**改扩展与样式；Markdown 相关样式要加在 `MarkdownRenderer.vue` 的**第二个（非 scoped）**`<style>` 块里，否则 `v-html` 出来的内容命中不到（完整语法清单与新增步骤见 `contribution/markdown-extensions.md`）
- 只有暗色主题：颜色一律取 `src/assets/theme-dark.scss` 的 token，**不写死颜色值**（命名与用法见 `contribution/design-tokens.md`）
- 布局事实：正文列宽固定 720px；断点只有 **1040px**（右侧目录 → 底部抽屉）与 **768px**（桌面导航 → 汉堡菜单）
- 不要改 `index.html` 的 `user-scalable=no`（移动端禁缩放），除非做过真机确认
- 架构、路由、内容加载、渲染管线与部署细节见 `contribution/architecture.md`；**它可能过期，以代码为准**

## 不要复活

- 包管理用 **pnpm**（`3f9ea84` 起由 yarn 迁入）：不要引入 npm / yarn，也不要加 `yarn.lock`
- 不要引入后端、登录、权限、在线编辑：这是纯静态内容站，所有能力只能靠前端实现

## 协作与环境

- `.gitignore` 忽略了 `.clinerules/` 等本机目录：**换机器、换协作者都不存在**，不要把被忽略目录里的内容当作唯一依据
- 未经明确要求：不要 `git commit` / `git push`，也不要回滚未提交的改动
- plan 模式只讨论、不写文件
