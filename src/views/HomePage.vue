<template>
  <div class="mx-auto container py-8">
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
  if (data.code === 200) {
    localStorage.setItem('upload', JSON.stringify(data.data));
    router.push('/xgPlayer');
  }
};
</script>
<style scoped></style>
