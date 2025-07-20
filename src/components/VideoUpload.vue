<template>
  <div class="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 lg:p-8">
    <div class="w-full max-w-4xl">
      <div
        class="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 sm:p-10 transition-all duration-500 hover:shadow-blue-100/50 border border-gray-100"
      >
        <h2
          class="text-4xl sm:text-5xl font-extrabold text-center mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient"
        >
          智能生成教学大纲
        </h2>
        <p
          class="text-gray-600 text-center mb-10 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed"
        >
          自动划分章节，生成教学大纲及视频时间轴概览！
        </p>
        <div class="mb-6">
          <input
            v-model="courseName"
            type="text"
            placeholder="请输入自选计算机学科类名称"
            class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 outline-none text-gray-700 placeholder-gray-400"
          />
        </div>
        <div
          class="upload-area relative border-3 border-dashed rounded-2xl p-8 sm:p-12 transition-all duration-500 group"
          :class="[
            isDragging
              ? 'border-blue-500 bg-blue-50/50 shadow-inner'
              : 'border-gray-200 hover:border-blue-400 hover:bg-blue-50/30 hover:shadow-lg',
          ]"
          @dragover.prevent="isDragging = true"
          @dragleave.prevent="isDragging = false"
          @drop.prevent="handleDrop"
          @click="selectFile"
        >
          <input
            type="file"
            accept="video/*,.mp4"
            class="hidden"
            @change="handleFileChange"
            ref="fileInput"
          />

          <!-- Uploading State -->
          <div v-if="uploading" class="flex flex-col items-center space-y-6">
            <div class="relative w-full max-w-md h-3 bg-gray-100 rounded-full overflow-hidden">
              <div
                class="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full transition-all duration-300 ease-out"
                :style="{ width: `${progress}%` }"
              ></div>
            </div>
            <div class="flex items-center space-x-3">
              <svg
                class="animate-spin h-6 w-6 text-blue-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span class="text-gray-700 font-medium text-lg">正在上传 {{ progress }}%</span>
            </div>
          </div>

          <!-- Default State -->
          <div v-else class="flex flex-col items-center space-y-6">
            <div
              class="upload-icon-wrapper p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-3"
            >
              <svg
                class="h-16 w-16 text-blue-500 transform transition-transform duration-500 group-hover:scale-110"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
            </div>
            <div class="text-center space-y-3">
              <p
                class="text-xl sm:text-2xl font-semibold text-gray-800 group-hover:text-blue-600 transition-colors duration-300"
              >
                点击或拖拽上传视频
              </p>
              <p
                class="text-base text-gray-500 group-hover:text-gray-600 transition-colors duration-300"
              >
                支持 MP4 格式
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import message from '@arco-design/web-vue/es/message';
import axios from 'axios';
import { ref } from 'vue';

interface UploadResponse {
  code: number;
  message: string;
  data: string;
}

const courseName = ref<string>('');
const uploading = ref<boolean>(false);
const progress = ref(0);
const isDragging = ref(false);
const emit = defineEmits<{
  (e: 'upload-success', data: UploadResponse): void;
}>();
const fileInput = ref<HTMLInputElement | null>(null);

const selectFile = () => {
  if (fileInput.value) {
    fileInput.value.click();
  }
};

const handleDrop = (event: DragEvent) => {
  isDragging.value = false;
  const files = event.dataTransfer?.files;
  if (files && files.length > 0) {
    handleFile(files[0]);
  }
};

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    handleFile(target.files[0]);
  }
};

const handleFile = async (file: File) => {
  if (!courseName.value.trim()) {
    message.error({
      content: '请输入课程名称',
      duration: 2000,
      closable: true,
    });
    if (fileInput.value) fileInput.value.value = '';
    return;
  }

  if (!file) {
    message.error({
      content: '请选择要上传的视频文件',
      duration: 2000,
      closable: true,
    });
    if (fileInput.value) fileInput.value.value = '';
    return;
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('courseName', courseName.value.trim());
  localStorage.setItem('courseName', courseName.value);
  try {
    uploading.value = true;
    progress.value = 0;

    const { data } = await axios.post(import.meta.env.VITE_APP_URL + '/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          progress.value = Math.round((progressEvent.loaded / progressEvent.total) * 100);
        }
      },
    });

    message.success({
      content: '视频上传成功',
      duration: 2000,
      closable: true,
    });

    emit('upload-success', data);
  } catch (error) {
    const axiosError = error as { response?: { data?: { message?: string } } };
    const fallbackMessage = error instanceof Error ? error.message : '未知错误';
    message.error({
      content: '上传失败: ' + (axiosError.response?.data?.message || fallbackMessage),
      duration: 3000,
      closable: true,
    });
  } finally {
    uploading.value = false;
  }
};
</script>

<style scoped>
.upload-area {
  min-height: 400px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }

  50% {
    background-position: 100% 50%;
  }

  100% {
    background-position: 0% 50%;
  }
}

.animate-gradient {
  background-size: 200% auto;
  animation: gradient 8s linear infinite;
}

/* Remove unnecessary styles as they're now handled by Tailwind */
</style>
