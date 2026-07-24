<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';

import LoadingSpinner from '@/components/LoadingSpinner.vue';
import MarkdownRenderer from '@/components/MarkdownRenderer.vue';
import PageAside from '@/components/PageAside.vue';
import { getSubDoc } from '@/utils';
import doc404 from '@/ideas/404.md';

const route = useRoute<'/[category]/[idea]/[...path]'>();

const inited = ref(false);
const doc = ref<string | null>(null);

watch(
  () => [route.params.category, route.params.idea, route.params.path],
  async ([category, idea, path]) => {
    if (!category || !idea || !path) return;
    const content = await getSubDoc(category, idea, path);
    doc.value = content;
    inited.value = true;
  },
  { immediate: true },
);
</script>

<template>
  <main class="page">
    <div class="container">
      <LoadingSpinner v-if="!inited" />

      <div v-else>
        <MarkdownRenderer
          v-if="doc"
          :content="doc"
        />
        <MarkdownRenderer
          v-else
          :content="doc404"
          theme="404"
        />
      </div>
    </div>

    <div
      v-if="doc"
      class="aside-wrapper"
    >
      <PageAside :content="doc" />
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
