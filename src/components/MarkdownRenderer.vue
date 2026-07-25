<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import useMdParser from '../hooks/useMdParser';

interface Props {
  content: string;
  theme?: '404';
}

const props = withDefaults(defineProps<Props>(), {});
const router = useRouter();
const container = ref<HTMLElement | null>(null);

const { parse } = useMdParser();

const html = computed(() => parse(props.content));

onMounted(() => {
  container.value?.addEventListener('click', (e: MouseEvent) => {
    const target = (e.target as HTMLElement).closest('a');
    if (!target) return;

    if (target.hasAttribute('data-router-link')) {
      e.preventDefault();
      const href = target.getAttribute('href');
      if (href) {
        router.push(href);
      }
    }
    // target="_blank" links are handled natively by the browser
  });
});
</script>

<template>
  <div
    ref="container"
    class="markdown-renderer"
    :class="{ 'theme-404': props.theme === '404' }"
    v-html="html"
  ></div>
</template>

<style lang="scss">
.markdown-renderer {
  --color-title: var(--color-heading);
  --color-title-small: var(--color-text);
  --color-p: var(--color-text);

  color: var(--color-p);
  text-align: justify;
}

// basic styles for markdown elements
.md-heading {
  position: relative;
  scroll-margin-top: calc(var(--root-header-height, 60px) + 12px);
}
.md-h1 {
  margin: 20px 0;
  text-align: center;
  .md-heading-text {
    color: var(--color-title);
    font-size: 36px;
    font-weight: 600;
  }
}
.md-h2 {
  margin: 36px 0 18px;
  .md-heading-text {
    color: var(--color-title);
    font-size: 24px;
    font-weight: 600;
  }
}
.md-h3 {
  margin: 18px 0 12px;
  .md-heading-text {
    color: var(--color-title);
    font-size: 20px;
    font-weight: 600;
  }
}
.md-h4 {
  margin: 12px 0 6px;
  .md-heading-text {
    color: var(--color-title-small);
    font-size: 16px;
    font-weight: 500;
  }
}

.md-p {
  font-size: 16px;
  margin-bottom: 12px;
  line-height: 1.6;
}

.md-hr {
  margin: 24px 0;
  border: none;
  border-top: 1px solid var(--color-border);
}

.md-strong {
  font-weight: 600;
  color: var(--color-title);
}

.md-ul,
.md-ol {
  margin: 12px 0;
  padding-inline-start: 24px;

  & .md-ul,
  & .md-ol {
    margin: 4px 0 8px;
  }
}

.md-img-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  margin-bottom: 18px;

  .md-img-caption {
    letter-spacing: 0.12em;
  }
  .md-img {
    display: block;
    max-width: 100%;
    margin: 0 auto;
  }
}

.md-pre {
  margin: 12px 0;
  padding: 12px;
  border-radius: 8px;
  background-color: var(--color-muted-dark-5);
  overflow-x: auto;
}

// tables
.md-table {
  width: 100%;
  border-collapse: collapse;
  margin: 16px 0;
  font-size: 14px;
  line-height: 1.6;
}
.md-thead {
  background-color: var(--color-muted-dark-5);
}
.md-th {
  padding: 6px 8px;
  font-weight: 600;
  color: var(--color-title);
  border-bottom: 2px solid var(--color-border, #ddd);
  white-space: nowrap;
}
.md-td {
  padding: 4px 6px;
  border-bottom: 1px solid var(--color-border, #ddd);
}
.md-tbody .md-tr {
  &:hover {
    background-color: var(--color-muted-dark-3);
  }
}

.markdown-renderer.theme-404 {
  text-align: center;

  .md-h1 {
    font-size: 120px;
    line-height: 1;
    margin-bottom: 40px;
  }

  & > .md-p {
    line-height: 2;
    margin-bottom: 24px;
    text-indent: 0;
  }
}

@media (max-width: 1040px) {
  .md-heading {
    // scroll-margin-top: calc(var(--root-header-height, 60px) + 12px);
    scroll-margin-top: 12px;
  }
}
</style>

<style lang="scss">
// styles for custom markdown extensions
.md-validity-tag {
  display: block;
  margin: -8px auto;
  padding: 4px 12px;
  width: fit-content;
  color: var(--color-md-validity-tag);
  border: 1px solid currentColor;
  border-radius: 4px;
  font-size: 12px;
  line-height: 1;
  text-indent: 0;
}

.md-alert {
  margin-bottom: 12px;
  border-radius: 8px;
  overflow: hidden;

  &-default {
    background-color: var(--color-md-alert-bg);
    & .md-alert-title {
      background-color: var(--color-md-alert-title-bg);
    }
  }

  & .md-alert-title {
    padding: 12px 16px;
    font-weight: 600;
    font-size: 1.12em;
  }

  & .md-alert-content {
    padding: 12px;
  }

  & .md-p {
    text-indent: 1em;
    &:last-child {
      margin-bottom: 0;
    }
  }
}
</style>
