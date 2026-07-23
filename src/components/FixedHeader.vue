<script setup lang="ts">
import { ref, computed } from 'vue';
import { homeIdeas, categoryLabels } from '@/constants/ideas';
import type { NavTab } from '@/types/nav';
import DesktopNav from './DesktopNav.vue';
import MobileNav from './MobileNav.vue';

const tabsInfo = computed<NavTab[]>(() => {
  const groups: Record<string, { id: string; name: string }[]> = {};
  for (const idea of homeIdeas) {
    const category = idea.category;
    if (!groups[category]) groups[category] = [];
    groups[category].push({ id: idea.id, name: idea.name });
  }
  return Object.entries(groups).map(([category, children]) => ({
    label: categoryLabels[category] || category,
    children: children.map((child) => ({
      name: child.name,
      path: `/${category}/${child.id}`,
    })),
  }));
});

// 移动端菜单状态
const isMobileMenuOpen = ref(false);
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};
const closeMobileMenu = () => {
  isMobileMenuOpen.value = false;
};
</script>

<template>
  <header class="header">
    <div class="header-container header-container-wide">
      <div class="header-content">
        <router-link
          to="/"
          class="header-banner"
        >
          <span class="banner-text">灵感工坊</span>
        </router-link>

        <DesktopNav :tabs="tabsInfo" />
      </div>
    </div>

    <MobileNav
      :tabs="tabsInfo"
      :is-open="isMobileMenuOpen"
      @toggle="toggleMobileMenu"
      @close="closeMobileMenu"
    />
  </header>
</template>

<style scoped lang="scss">
.header {
  --header-height: var(--root-header-height, 60px);
  --header-blur: blur(8px);
  --header-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  --header-transition-speed: 0.3s;
  --color-bg: var(--root-header-color-bg, rgba(0, 0, 0, 0.9));
  --color-action-active: rgba(255, 255, 255, 0.05);
}

// frame layout
.header-container {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  background-color: var(--color-bg);
  backdrop-filter: var(--header-blur);
}
.header-container-wide {
  height: var(--header-height);
  width: 100%;
}
.header-content {
  margin: 0 auto;
  padding: 0 var(--page-padding-horizontal);
  height: 100%;
  width: 100%;
  max-width: 720px;
  display: flex;
  align-items: stretch;
  gap: 48px;
}

// banner
.header-banner {
  text-decoration: none;
  cursor: pointer;
  transition: opacity 0.2s;
  height: 100%;
  display: flex;
  align-items: center;
}

.header-banner:hover {
  opacity: 0.8;
}
.banner-text {
  font-weight: 600;
  font-size: 18px;
  color: var(--color-heading);
}

// 移动端响应式样式
@media (max-width: 768px) {
  .header-container-wide {
    display: none;
  }
}

// 打印样式，隐藏
@media print {
  .header {
    display: none;
  }
}
</style>
