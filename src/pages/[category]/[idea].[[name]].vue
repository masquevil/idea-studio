<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';

import MarkdownRenderer from '@/components/MarkdownRenderer.vue';
import PageAside from '@/components/PageAside.vue';
import { getDocByName } from '@/utils';
import doc404 from '@/ideas/404.md';

const route = useRoute<'/[category]/[idea].[[name]]'>();

const inited = ref(false);
const doc = ref<string | null>(null);

watch(
  () => [route.params.category, route.params.idea, route.params.name],
  async ([category, idea, name]) => {
    if (!category || !idea) return;
    const docName = name || 'index';
    doc.value = await getDocByName(category, idea, docName);
    inited.value = true;
  },
  { immediate: true },
);
</script>

<template>
  <main class="page">
    <div class="container">
      <div
        v-if="!inited"
        class="loading"
      >
        <div class="loading-spinner">正在加载...</div>
      </div>

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

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
}

.loading-spinner {
  font-size: 20px;
  background: repeating-linear-gradient(
    135deg,
    hsl(240, 100%, 90%) 0%,
    hsl(240, 50%, 70%) 15%,
    hsl(240, 60%, 60%) 65%,
    hsl(240, 100%, 90%) 80%,
    hsl(240, 100%, 90%) 100%
  );
  color: transparent;
  background-clip: text;
  background-repeat: repeat;
  background-size: 200% 100%;
  animation: gradient-flow 1.5s linear infinite;
}

@keyframes gradient-flow {
  0% {
    background-position: 200% 0%;
  }
  100% {
    background-position: 0% 0%;
  }
}
</style>
