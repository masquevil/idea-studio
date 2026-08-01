<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';

import LoadingSpinner from '@/components/LoadingSpinner.vue';
import MarkdownRenderer from '@/components/MarkdownRenderer.vue';
import PageAside from '@/components/PageAside.vue';
import { getIndexDoc, getDocsTree, renderDocsTreeToMarkdown } from '@/utils';
import doc404 from '@/ideas/404.md';

const route = useRoute<'/[category]/[idea]/'>();

const inited = ref(false);
const indexDoc = ref<string | null>(null);
const subDocsMd = ref<string>('');
const mergedContent = ref<string>('');

watch(
  () => [route.params.category, route.params.idea],
  async ([category, idea]) => {
    inited.value = true;
    if (!category || !idea) return;
    inited.value = false;

    // 1. 加载 index.md
    indexDoc.value = await getIndexDoc(category, idea);
    document.title = indexDoc.value ? `${idea} - ${category} | Idea Studio` : '404 - Not Found';

    // 2. 扫描子文档，生成"相关子文档" markdown
    const tree = await getDocsTree(category, idea);
    subDocsMd.value = renderDocsTreeToMarkdown(tree);

    // 3. 合并内容（仅用于 PageAside）
    const parts: string[] = [];
    if (indexDoc.value) parts.push(indexDoc.value);
    if (subDocsMd.value) parts.push(subDocsMd.value);
    mergedContent.value = parts.join('\n\n');

    inited.value = true;
  },
  { immediate: true },
);
</script>

<template>
  <main class="page">
    <div class="container">
      <LoadingSpinner v-if="!inited" />

      <template v-else>
        <!-- index.md 内容 -->
        <MarkdownRenderer
          v-if="indexDoc"
          :content="indexDoc"
        />
        <MarkdownRenderer
          v-else
          :content="doc404"
          theme="404"
        />

        <!-- 相关子文档列表 -->
        <MarkdownRenderer
          v-if="subDocsMd"
          :content="subDocsMd"
        />
      </template>
    </div>

    <div
      v-if="mergedContent && inited"
      class="aside-wrapper"
    >
      <PageAside :content="mergedContent" />
    </div>
  </main>
</template>

<style scoped lang="scss">
.container {
  max-width: 720px;
  margin: 0 auto;
  padding: 48px var(--page-padding-horizontal) 60px;
}
</style>
