<script setup lang="ts">
import type { NavTab } from '@/types/nav';
import HamburgerButton from './HamburgerButton.vue';

defineProps<{
  tabs: NavTab[];
  isOpen: boolean;
}>();

const emit = defineEmits<{
  toggle: [];
  close: [];
}>();
</script>

<template>
  <div>
    <div class="hamburger-button-wrapper">
      <HamburgerButton
        :is-open="isOpen"
        @toggle="emit('toggle')"
      />
    </div>

    <!-- Backdrop -->
    <div
      v-if="isOpen"
      class="menu-backdrop"
      @click="emit('close')"
    ></div>

    <div
      class="mobile-container"
      :class="{ 'is-showing': isOpen }"
    >
      <div class="mobile-inner">
        <router-link
          to="/"
          class="mobile-banner"
          @click="emit('close')"
        >
          <span class="mobile-banner-text">灵感工坊</span>
        </router-link>
        <nav class="menu-mobile">
          <div
            v-for="tab in tabs"
            :key="tab.label"
            class="menu-mobile-section"
          >
            <div class="menu-mobile-section-title">{{ tab.label }}</div>
            <router-link
              v-for="child in tab.children"
              :key="child.name"
              :to="child.path"
              class="menu-mobile-section-item"
              @click="emit('close')"
            >
              {{ child.name }}
            </router-link>
          </div>
        </nav>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.hamburger-button-wrapper {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1001;
  line-height: 0;

  & > .hamburger-button {
    background-color: var(--color-bg);
    border-radius: 0 50% 50% 50%;
    opacity: 0.8;
    backdrop-filter: blur(10px);
  }
}

.menu-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(12, 8, 12, 0.5);
  z-index: 999;
}

.mobile-container {
  position: fixed;
  top: 0;
  left: -100%;
  z-index: 1000;
  width: fit-content;
  max-width: 300px;
  height: 100vh;
  padding: 60px 0 24px;
  background-color: var(--color-bg);
  backdrop-filter: var(--header-blur);
  transition: left var(--header-transition-speed) ease;
  overflow-y: auto;

  &.is-showing {
    left: 0;
  }
}

.mobile-inner {
  padding: 0 20px;
}

.mobile-banner {
  display: block;
  padding-right: 20px;
  margin-bottom: 0;
  text-decoration: none;
  cursor: pointer;
  font-size: 24px;
  font-weight: 600;
  color: var(--color-heading);
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.8;
  }
}

.mobile-banner-text {
  font-weight: 600;
  font-size: 24px;
  color: var(--color-heading);
}

// mobile tab list
.menu-mobile {
  display: flex;
  flex-direction: column;
  gap: 40px;
  margin-top: 24px;
}

.menu-mobile-section-title {
  margin-bottom: 12px;
  padding: 0 6px;
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-secondary);
}

.menu-mobile-section-item {
  display: block;
  padding: 8px 16px;
  font-size: 16px;
  color: var(--color-text);
  text-decoration: none;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.menu-mobile-section-item:hover {
  background-color: var(--color-action-active);
}

// 移动端响应式样式
@media (max-width: 768px) {
  .hamburger-button-wrapper {
    display: block;
  }
}
</style>
