<template>
  <div>
    <div
      class="sticky top-0 z-30 flex items-center h-16 px-4 bg-white shadow-sm border-b border-gray-200"
    >
      <span class="text-xl font-bold text-gray-900 flex-1 text-center select-none">
        基于AI大模型的教学视频多模态解析与知识重构系统
      </span>
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
<style></style>
