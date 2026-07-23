<script setup lang="ts">
import { homeIdeas, categoryLabels, statusText } from '@/constants/ideas';
</script>

<template>
  <main class="page">
    <div class="container">
      <h1 class="page-title">侠小然的灵感工坊</h1>
      <div class="page-subtitle">思路与创意的设计空间</div>

      <div class="ideas-grid">
        <router-link
          v-for="idea in homeIdeas"
          :key="idea.id"
          :to="`/${idea.category}/${idea.id}`"
          class="idea-card"
        >
          <div class="idea-card-header">
            <div class="idea-name">
              【{{ categoryLabels[idea.category] || idea.category }}】{{ idea.name }}
            </div>
            <div
              class="idea-status"
              :class="`status-${idea.status}`"
            >
              {{ statusText[idea.status] || idea.status }}
            </div>
          </div>
          <p class="idea-description">{{ idea.description }}</p>
        </router-link>
      </div>
    </div>
  </main>
</template>

<style scoped lang="scss">
.page {
  min-height: 100vh;
  max-width: 720px;
  margin: 0 auto;
  padding: 48px var(--page-padding-horizontal) 60px;
  display: flex;
  justify-content: center;
}

.container {
  width: 100%;
}

.page-title {
  text-align: center;
  font-size: 42px;
  font-weight: 700;
  color: var(--color-heading);
  margin-bottom: 12px;
}

.page-subtitle {
  text-align: center;
  font-size: 18px;
  color: var(--color-text);
  margin-bottom: 48px;
  opacity: 0.7;
}

.ideas-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.idea-card {
  display: flex;
  flex-direction: column;
  padding: 18px 24px;
  border-radius: 12px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  text-decoration: none;
  position: relative;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    border-color: var(--color-border-active);
  }
}

.idea-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
}

.idea-name {
  font-size: 20px;
  font-weight: 600;
  color: var(--color-heading);
}

.idea-description {
  font-size: 14px;
  color: var(--color-text);
  line-height: 1.6;
  opacity: 0.8;
}

.idea-status {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  line-height: 1;
  flex-shrink: 0;
  margin-left: 8px;
  background-color: var(--color-status-bg);
  color: var(--color-status-text);
  border: 1px solid var(--color-status-text);
  opacity: 0.8;

  &.status-drafting {
    --color-status-bg: oklch(36% 0.02 320);
    --color-status-text: oklch(90% 0.02 320);
  }

  &.status-designing {
    --color-status-bg: oklch(36% 0.12 150);
    --color-status-text: oklch(90% 0.12 150);
  }

  &.status-testing {
    --color-status-bg: oklch(36% 0.12 90);
    --color-status-text: oklch(90% 0.12 90);
  }

  &.status-completed {
    --color-status-bg: oklch(36% 0.06 240);
    --color-status-text: oklch(90% 0.06 240);
  }
}
</style>
