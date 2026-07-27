import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router';
import { routes, handleHotUpdate } from 'vue-router/auto-routes';
import animateScrollTo from 'animated-scroll-to';

const { VITE_TARGET_ENV = '' } = import.meta.env;
const isHashMode = ['pages', 'hash'].includes(VITE_TARGET_ENV);

const router = createRouter({
  history: !isHashMode
    ? createWebHistory(import.meta.env.BASE_URL)
    : createWebHashHistory(import.meta.env.BASE_URL),
  routes: routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      setTimeout(() => {
        animateScrollTo(savedPosition.top, {
          maxDuration: 800,
        });
      }, 200);
    }
    return { top: 0, left: 0 };
  },
});

if (import.meta.hot) {
  handleHotUpdate(router);
}

export default router;
