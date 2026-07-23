<script setup lang="ts">
import MarkdownRenderer from '@/components/MarkdownRenderer.vue';
import doc404 from '@/ideas/404.md';
</script>

<template>
  <main class="page">
    <div class="container">
      <MarkdownRenderer
        :content="doc404"
        theme="404"
      />
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
