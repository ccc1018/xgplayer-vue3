import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: () => import('@/views/Home.vue') },
    { path: '/xgPlayer', component: () => import('@/views/xgPlayer.vue') },
  ],
});

export default router;
