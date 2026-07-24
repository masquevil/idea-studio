/**
 * 获取 [idea] 目录下 index.md 的内容
 */
export async function getIndexDoc(category: string, ideaName: string): Promise<string | null> {
  const docs = import.meta.glob<false, 'raw', string>(`@/ideas/*/*/index.md`, {
    query: '?raw',
    import: 'default',
    eager: false,
  });

  const targetSuffix = `/ideas/${category}/${ideaName}/index.md`;
  const entry = Object.entries(docs).find(([filePath]) => filePath.endsWith(targetSuffix));
  if (!entry) return null;

  const content = await entry[1]();
  return typeof content === 'string' ? content : null;
}

/**
 * 获取 [idea] 目录下某个子文档的内容（支持嵌套路径，如 draft-1-1/01-原始点子）
 */
export async function getSubDoc(
  category: string,
  ideaName: string,
  subPath: string,
): Promise<string | null> {
  const docs = import.meta.glob<false, 'raw', string>(`@/ideas/*/*/**/*.md`, {
    query: '?raw',
    import: 'default',
    eager: false,
  });

  const targetSuffix = `/ideas/${category}/${ideaName}/${subPath}.md`;
  const entry = Object.entries(docs).find(([filePath]) => filePath.endsWith(targetSuffix));
  if (!entry) return null;

  const content = await entry[1]();
  return typeof content === 'string' ? content : null;
}

interface DocTreeItem {
  name: string;
  title: string;
  link: string;
  children?: DocTreeItem[];
}

/**
 * 解析文档标题：优先取 frontmatter 的 title，否则取第一个 # 标题，否则用文件名
 */
function parseDocTitle(content: string, fileName: string): string {
  // Try frontmatter title first
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (frontmatterMatch) {
    const yaml = frontmatterMatch[1];
    const titleMatch = yaml.match(/^title\s*:\s*(.*)$/m);
    if (titleMatch) return titleMatch[1].trim();
  }

  // Try first h1 heading
  const h1Match = content.match(/^#\s+(.+)$/m);
  if (h1Match) return h1Match[1].trim();

  // Fallback: use file name
  return fileName;
}

/**
 * 扫描 [idea] 目录下所有 .md 文件（除了 index.md），按子目录层级组织
 */
export async function getDocsTree(category: string, ideaName: string): Promise<DocTreeItem[]> {
  const docs = import.meta.glob<false, 'raw', string>(`@/ideas/*/*/**/*.md`, {
    query: '?raw',
    import: 'default',
    eager: false,
  });

  // 过滤属于指定 category/idea 的文件，排除 index.md
  const prefix = `/ideas/${category}/${ideaName}/`;
  const entries = Object.entries(docs)
    .filter(([filePath]) => {
      const idx = filePath.indexOf(prefix);
      return (
        idx !== -1 && !(filePath.endsWith('/index.md') && filePath.slice(idx).endsWith('/index.md'))
      );
    })
    .map(([filePath, contentGetter]) => ({
      filePath,
      contentGetter,
    }));

  // 按路径排序，保证一致性
  entries.sort((a, b) => a.filePath.localeCompare(b.filePath));

  // 构建目录树
  const tree: DocTreeItem[] = [];

  for (const { filePath, contentGetter } of entries) {
    // 从路径提取相对路径
    const idx = filePath.indexOf(prefix);
    const relativePath = filePath.slice(idx + prefix.length).replace(/\.md$/, '');

    const content = await contentGetter();
    const contentStr = typeof content === 'string' ? content : '';

    // 从路径分段
    const parts = relativePath.split('/');
    const fileName = parts.pop()!;
    const title = parseDocTitle(contentStr, fileName);

    if (parts.length === 0) {
      // 在 idea 目录下的文件
      tree.push({
        name: fileName,
        title,
        link: `/${category}/${ideaName}/${fileName}`,
      });
    } else {
      // 在子目录中的文件
      const dirName = parts[0];

      let dirNode = tree.find((n) => n.name === dirName && n.children);
      if (!dirNode) {
        const dirTitle = dirName.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
        dirNode = {
          name: dirName,
          title: dirTitle,
          link: '',
          children: [],
        };
        tree.push(dirNode);
      }

      dirNode.children!.push({
        name: fileName,
        title,
        link: `/${category}/${ideaName}/${relativePath}`,
      });
    }
  }

  // 排序：文件夹在前，文件在后
  tree.sort((a, b) => {
    const aIsDir = a.children ? 1 : 0;
    const bIsDir = b.children ? 1 : 0;
    return bIsDir - aIsDir || a.name.localeCompare(b.name);
  });

  return tree;
}

/**
 * 将 DocTreeItem 渲染为 markdown 字符串（"## 相关子文档" 部分）
 */
export function renderDocsTreeToMarkdown(tree: DocTreeItem[]): string {
  if (tree.length === 0) return '';

  const lines: string[] = [];
  lines.push('## 相关子文档');
  lines.push('');

  for (const item of tree) {
    if (item.children) {
      lines.push(`### ${item.title}`);
      lines.push('');
      for (const child of item.children) {
        lines.push(`- [${child.title}](${child.link})`);
      }
      lines.push('');
    } else {
      lines.push(`- [${item.title}](${item.link})`);
    }
  }

  return lines.join('\n');
}
