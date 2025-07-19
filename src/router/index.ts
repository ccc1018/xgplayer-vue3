import { createRouter, createWebHashHistory } from 'vue-router';

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', component: () => import('@/views/HomePage.vue') },
    { path: '/xgPlayer', component: () => import('@/views/xgPlayer.vue') },
  ],
});

export default router;
