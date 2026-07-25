<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import useMdParser from '@/hooks/useMdParser';
import animateScrollTo from 'animated-scroll-to';

interface HeadingItem {
  depth: number;
  text: string;
  id: string;
}

interface HeadingTreeItem extends HeadingItem {
  parentId?: string;
}

const props = defineProps<{ content: string }>();

const isMobile = ref(false);
const isExpanded = ref(false);
const currentHeadingId = ref<string>('');
const currentHeadingText = ref<string>('');
const currentH2Id = ref<string>('');

function getScrollMarginTop(element: HTMLElement): number {
  const scrollMarginTop = getComputedStyle(element).getPropertyValue('scroll-margin-top');
  return scrollMarginTop.endsWith('px') ? parseInt(scrollMarginTop) : 0;
}

const { extractHeadings } = useMdParser();
const headings = computed<HeadingItem[]>(() => extractHeadings(props.content));
const headingTree = computed<HeadingTreeItem[]>(() => {
  let currentH2Id = '';
  return headings.value.map((heading: HeadingItem) => {
    if (heading.depth === 2) {
      currentH2Id = heading.id;
    }
    return {
      ...heading,
      parentId: heading.depth === 3 ? currentH2Id : undefined,
    };
  });
});
const visibleDesktopHeadings = computed<HeadingTreeItem[]>(() => {
  return headingTree.value.filter((heading: HeadingTreeItem) => {
    if (heading.depth <= 2) return true;
    return heading.depth === 3 && heading.parentId === currentH2Id.value;
  });
});

const mobileButtonHeadingText = computed(() => {
  const text = currentHeadingText.value;
  return text ? `正在浏览：${text}` : '';
});

const handleResize = () => {
  isMobile.value = window.innerWidth < 1040;
};

const toggleExpanded = () => {
  isExpanded.value = !isExpanded.value;
};

const scrollToHeading = (headingId: string) => {
  const headingAnchor = document.getElementById(headingId);
  if (!headingAnchor) return;
  animateScrollTo(headingAnchor, {
    verticalOffset: -getScrollMarginTop(headingAnchor),
    maxDuration: 800,
  });
};

const handleHeadingClick = (event: MouseEvent, headingId: string) => {
  event.preventDefault();
  scrollToHeading(headingId);

  if (isMobile.value) {
    isExpanded.value = false;
  }
};

const updateCurrentHeading = () => {
  if (!headings.value.length) {
    currentHeadingId.value = '';
    currentHeadingText.value = '';
    currentH2Id.value = '';
    return;
  }

  let activeHeadingIndex = -1;

  for (let i = headings.value.length - 1; i >= 0; i--) {
    const heading = document.getElementById(headings.value[i].id);
    if (!heading) continue;
    const headingTop = heading.offsetTop - getScrollMarginTop(heading);
    const scrollTop = Math.ceil(window.scrollY);
    if (headingTop <= scrollTop) {
      activeHeadingIndex = i;
      break;
    }
  }

  if (activeHeadingIndex === -1) {
    currentHeadingId.value = '';
    currentHeadingText.value = '';
    currentH2Id.value = '';
    return;
  }

  const activeHeading = headings.value[activeHeadingIndex];
  currentHeadingId.value = activeHeading.id;
  currentHeadingText.value = activeHeading.text;

  let activeH2Id = '';
  for (let i = activeHeadingIndex; i >= 0; i--) {
    if (headings.value[i].depth === 2) {
      activeH2Id = headings.value[i].id;
      break;
    }
  }
  currentH2Id.value = activeH2Id;
};

watch(headings, () => updateCurrentHeading(), { immediate: true });

onMounted(() => {
  handleResize();
  updateCurrentHeading();
  window.addEventListener('resize', handleResize);
  window.addEventListener('scroll', updateCurrentHeading);

  return () => {
    window.removeEventListener('resize', handleResize);
    window.removeEventListener('scroll', updateCurrentHeading);
  };
});
</script>

<template>
  <div
    v-if="headings.length"
    :class="['container', { 'is-mobile': isMobile, 'is-mobile-expanded': isExpanded }]"
  >
    <!-- 桌面版 -->
    <div
      v-if="!isMobile"
      class="aside-desktop"
    >
      <div class="menu-title">目录</div>
      <ul class="aside-menu">
        <li
          v-for="heading in visibleDesktopHeadings"
          :key="heading.id"
          :class="['menu-item', `menu-item--level-${heading.depth}`]"
        >
          <a
            class="aside-link"
            :class="{ 'aside-link--active': currentHeadingId === heading.id }"
            :href="`#${heading.id}`"
            @click="(event) => handleHeadingClick(event, heading.id)"
          >
            {{ heading.text }}
          </a>
        </li>
      </ul>
    </div>

    <!-- 手机版 -->
    <div
      v-else
      class="aside-mobile"
    >
      <button
        class="mobile-trigger"
        @click="toggleExpanded"
      >
        <span class="mobile-trigger-label">
          {{ isExpanded ? '关闭' : '目录' }}
        </span>
        <span
          v-if="!isExpanded && mobileButtonHeadingText"
          class="mobile-trigger-text"
        >
          {{ mobileButtonHeadingText }}
        </span>
      </button>

      <div class="aside-mobile-menu-container">
        <div class="menu-title">目录</div>
        <ul class="aside-menu">
          <li
            v-for="heading in headings"
            :key="heading.id"
            :class="['menu-item', `menu-item--level-${heading.depth}`]"
          >
            <a
              class="aside-link"
              :href="`#${heading.id}`"
              @click="(event) => handleHeadingClick(event, heading.id)"
            >
              {{ heading.text }}
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.container {
  padding: 20px 0;
  max-height: calc(100vh - 120px);
  overflow: auto;
  font-size: 12px;

  &.is-mobile {
    padding: 0;
    max-height: none;
    font-size: 14px;
  }
}

.menu-title {
  margin-bottom: 4px;
  color: var(--color-text);
  font-size: 12px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.aside-menu {
  list-style: none;
  margin: 0;
  padding: 0;
}

.menu-item--level-2 {
  margin-top: 8px;
}

.aside-link {
  display: block;
  padding-top: 4px;
  padding-bottom: 4px;
  line-height: 1.6;
  color: var(--color-text);

  &:hover {
    color: var(--color-link-hover);
  }

  .menu-item--level-2 & {
    color: var(--color-nav-text);
  }

  .menu-item--level-3 & {
    padding-left: 8px;
  }
}
.aside-link--active {
  color: var(--color-heading);
  font-weight: 600;
}

.mobile-trigger {
  width: 100%;
  padding: 12px 24px;
  display: flex;
  justify-content: space-between;
  background: var(--color-nav-bg);
  color: var(--color-text);
  font-size: 14px;
  font-weight: 500;
  text-align: left;
  cursor: pointer;
}
.mobile-trigger-text {
  color: var(--color-nav-text);
}

.aside-mobile-menu-container {
  display: none;
  max-height: 50vh;
  overflow-y: auto;
  border-top: 1px solid var(--color-border);
  padding: 16px 24px;
}

.is-mobile.is-mobile-expanded .aside-mobile-menu-container {
  display: block;
}
</style>
