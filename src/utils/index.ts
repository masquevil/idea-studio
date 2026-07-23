export function getDocs(category: string, ideaName: string) {
  // 动态导入指定 category/idea 目录下的所有 .md 文件
  const docs = import.meta.glob<false, 'raw', string>(`@/ideas/*/*/*.md`, {
    query: '?raw',
    import: 'default',
    eager: false,
  });

  // 从文件路径中提取模块名称，并过滤属于指定 category/idea 的文件
  return Object.entries(docs)
    .filter(([filePath]) => filePath.includes(`/ideas/${category}/${ideaName}/`))
    .map(([filePath, fileContent]) => {
      // 从路径中提取文件名，例如: ./ideas/boardgame/国家宝藏/v1-设计思考.md -> v1-设计思考
      const docName = filePath.split('/').slice(-1)[0].slice(0, -3);
      return {
        name: docName,
        content: fileContent,
      };
    });
}

export async function getDocByName(category: string, ideaName: string, docName: string) {
  const docs = getDocs(category, ideaName);
  const doc = docs.find((doc) => doc.name === docName);
  if (!doc) return null;
  const content = await doc.content();
  return typeof content === 'string' ? content : null;
}
