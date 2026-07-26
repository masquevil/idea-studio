<script setup lang="ts">
import MarkdownAside from './MarkdownAside.vue';

defineProps<{ content: string }>();
</script>

<template>
  <div class="page-aside">
    <MarkdownAside :content="content" />
  </div>
</template>

<style scoped lang="scss">
.page-aside {
  position: fixed;
  top: calc(var(--root-header-height, 60px) + 24px);
  left: calc(50% + 360px + 12px);
  width: auto;
  max-width: calc(50% - 312px);
  z-index: 9;
}

@media (max-width: 1040px) {
  .page-aside {
    position: fixed;
    top: auto;
    right: 0;
    left: 0;
    width: 100%;
    max-width: none;
    bottom: 0;
    background-color: var(--color-aside-bg);
    backdrop-filter: blur(10px);
  }
}
</style>
