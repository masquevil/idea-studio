<script setup lang="ts">
import { ref } from 'vue';
import type { NavTab } from '@/types/nav';

defineProps<{
  tabs: NavTab[];
}>();

const hoveredTabIndex = ref<number | null>(null);
</script>

<template>
  <nav class="menu-desktop">
    <div
      v-for="(tab, index) in tabs"
      :key="tab.label"
      class="menu-item"
      @mouseenter="hoveredTabIndex = index"
      @mouseleave="hoveredTabIndex = null"
    >
      <span class="menu-title">{{ tab.label }}</span>
      <transition name="header-tab-dropdown">
        <div
          v-if="hoveredTabIndex === index"
          class="menu-desktop-dropdown"
        >
          <router-link
            v-for="child in tab.children"
            :key="child.name"
            :to="child.path"
            class="menu-desktop-dropdown-item"
            @click="hoveredTabIndex = null"
          >
            {{ child.name }}
          </router-link>
        </div>
      </transition>
    </div>
  </nav>
</template>

<style scoped lang="scss">
.menu-desktop {
  display: flex;
  gap: 16px;
}

.menu-item {
  position: relative;
  padding: 0 8px;
  height: 100%;
  display: flex;
  align-items: center;
  cursor: pointer;
}

.menu-title {
  font-size: 16px;
  color: var(--color-text);
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.8;
  }
}

.menu-desktop-dropdown {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(12, 8, 12, 0.96);
  backdrop-filter: var(--header-blur);
  border-radius: 0 0 8px 8px;
  min-width: 180px;
  box-shadow: var(--header-shadow);
  overflow: hidden;
}

.menu-desktop-dropdown-item {
  display: block;
  padding: 8px 16px;
  font-size: 14px;
  color: var(--color-text);
  text-decoration: none;
  transition: background-color 0.2s;

  &:hover {
    background-color: var(--color-action-active);
  }
}

// 下拉菜单过渡动画
.header-tab-dropdown-enter-active,
.header-tab-dropdown-leave-active {
  transition: all 0.2s ease;
}

.header-tab-dropdown-enter-from,
.header-tab-dropdown-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-8px);
}
</style>
