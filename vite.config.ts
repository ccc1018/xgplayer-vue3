import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    // proxy: {
    //   '/api': {
    //     target: 'http://localhost:8080',
    //     // target: 'https://efcb7fd82bfe.ngrok-free.app',
    //     changeOrigin: true,
    //     rewrite: (path) => path.replace(/^\/api/, ''),
    //   },
    // },
    port: 8000,
    host: '0.0.0.0',
    open: true,
    // allowedHosts: ['4vr0730sy707.vicp.fun'],
  },
});
