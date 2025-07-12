import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import ArcoVue from '@arco-design/web-vue';
import '@arco-design/web-vue/dist/arco.css';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';
import { createPinia } from 'pinia';
import router from './router';
if (import.meta.env.MODE === 'development') {
  import('./mock');
}
const app = createApp(App);
const pinia = createPinia();
app.use(ArcoVue);
app.use(router);
app.use(pinia);
pinia.use(piniaPluginPersistedstate);
app.mount('#app');
