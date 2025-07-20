<template>
  <div>
    <div class="ai-header">
      <div class="ai-header-inner">
        <span class="ai-header-logo">
          <svg width="32" height="32" viewBox="0 0 48 48" fill="none">
            <circle cx="24" cy="24" r="22" fill="#6366f1" fill-opacity="0.12" />
            <path d="M16 32L24 16L32 32" stroke="#6366f1" stroke-width="3" stroke-linecap="round" />
            <circle cx="24" cy="28" r="2.5" fill="#6366f1" />
          </svg>
        </span>
        <div class="ai-header-title-block">
          <div class="ai-header-title">基于AI大模型的教学视频多模态解析与知识重构系统</div>
          <div class="ai-header-underline"></div>
          <div class="ai-header-subtitle">智能 · 高效 · 多模态 · 教学创新</div>
        </div>
      </div>
    </div>
  </div>
  <div class="w-full mx-auto container py-8">
    <upload @upload-success="handleUploadSuccess" />
  </div>
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router';
const router = useRouter();
import upload from '@/components/VideoUpload.vue';

interface Data {
  code: number;
  message: string;
  data: string;
}
const handleUploadSuccess = async (data: Data) => {
  localStorage.clear();
  if (data.code === 200) {
    localStorage.setItem('upload', JSON.stringify(data.data));
    router.push('/xgPlayer');
  }
};
</script>
<style>
.ai-header {
  width: 100%;
  position: sticky;
  top: 0;
  z-index: 40;
  background: linear-gradient(135deg, #f0f4ff 0%, #e0e7ff 100%);
  backdrop-filter: blur(8px);
  border-bottom: none;
  box-shadow: none;
}

.ai-header-inner {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  /* 居中 */
  padding: 0 32px;
  height: 90px;
}

.ai-header-logo {
  margin-right: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 54px;
  height: 54px;
  background: linear-gradient(135deg, #e0e7ff 60%, #f0f4ff 100%);
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(99, 102, 241, 0.08);
}

.ai-header-title-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  /* 居中 */
}

.ai-header-title {
  font-size: 2.2rem;
  font-weight: 900;
  letter-spacing: 3px;
  color: #232946;
  line-height: 1.1;
  text-shadow: 0 2px 16px rgba(99, 102, 241, 0.1);
  background: linear-gradient(90deg, #6366f1 30%, #0ea5e9 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 6px;
  text-align: center;
}

.ai-header-underline {
  width: 80px;
  height: 5px;
  border-radius: 3px;
  background: linear-gradient(90deg, #6366f1 0%, #0ea5e9 100%);
  margin-bottom: 8px;
  box-shadow: 0 2px 8px #6366f133;
}

.ai-header-subtitle {
  font-size: 1.05rem;
  color: #64748b;
  letter-spacing: 2px;
  font-weight: 500;
  margin-left: 2px;
  text-align: center;
}
</style>
