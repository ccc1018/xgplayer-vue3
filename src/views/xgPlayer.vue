<template>
  <div>
    <a-config-provider>
      <div class="min-h-screen">
        <!-- 标题栏 -->
        <div
          class="sticky top-0 z-30 flex items-center h-16 px-4 bg-white shadow-sm border-b border-gray-200"
        >
          <a-button type="text" shape="circle" @click="goHome" class="mr-2">
            <icon-arrow-left />
          </a-button>
          <span class="text-xl font-bold text-gray-900 flex-1 text-center select-none">
            基于AI大模型的教学视频多模态解析与知识重构系统
          </span>
        </div>
        <div class="app-container p-10">
          <div class="flex flex-col lg:flex-row gap-8">
            <!-- 左侧视频区域 -->
            <div class="flex-1">
              <div class="player-container">
                <XGPlayer
                  ref="xgPlayerRef"
                  player-id="demo-player"
                  :options="options"
                  :key="options.chapters.length"
                  class="w-full aspect-video"
                />
              </div>
            </div>
            <!-- 右侧面板 -->
            <div class="w-full lg:w-[440px]">
              <div class="side-panel h-[620px]">
                <a-tabs
                  default-active-key="1"
                  lazy-load
                  class="custom-tabs"
                  :animation="true"
                  type="rounded"
                  @change="handleTabChange"
                >
                  <a-tab-pane key="1" title="AI字幕 & 章节">
                    <div class="p-4">
                      <div class="mb-4">
                        <a-tabs
                          default-active-key="null"
                          class="w-full"
                          type="rounded"
                          size="medium"
                          tabBarGutter="6"
                          @change="onTabChange"
                        >
                          <a-tab-pane key="subtitle" title="字幕生成" />
                          <a-tab-pane key="chapter" title="章节生成" />
                        </a-tabs>
                      </div>
                      <!-- 字幕区域 -->
                      <div v-if="activeSubTab === 'subtitle'">
                        <div v-if="subtitleLoading" class="flex justify-center items-center h-60">
                          <a-spin size="large" tip="字幕加载中..." />
                        </div>
                        <div v-else class="max-h-[500px] overflow-y-auto custom-scrollbar py-1">
                          <div class="timeline">
                            <div
                              v-for="(item, index) in subtitleList"
                              :key="index"
                              class="timeline-item"
                            >
                              <div class="timeline-dot"></div>
                              <div class="ml-6">
                                <div class="font-medium text-gray-800 text-sm">
                                  {{ item.text }}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <!-- 章节区域 -->
                      <div v-if="activeSubTab === 'chapter'">
                        <div v-if="chapterLoading" class="flex justify-center items-center h-60">
                          <a-spin size="large" tip="章节加载中..." />
                        </div>
                        <div v-else class="max-h-[500px] overflow-y-auto custom-scrollbar py-1">
                          <div class="timeline">
                            <div
                              v-for="(item, index) in chapterStore.chapters"
                              :key="index"
                              class="timeline-item"
                              :class="{ active: currentChapterIndex === index }"
                              @click="seekTo(item.start)"
                            >
                              <div class="timeline-dot"></div>
                              <div class="ml-6">
                                <div class="font-semibold text-gray-800 flex items-center">
                                  {{ item.title }}
                                  <a-tag
                                    v-if="currentChapterIndex === index"
                                    color="arcoblue"
                                    class="ml-2"
                                  >
                                    播放中
                                  </a-tag>
                                </div>
                                <div class="text-xs text-indigo-500 font-mono mt-1">
                                  {{ formatTime(item.start) }}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </a-tab-pane>
                  <a-tab-pane key="2" title="课程大纲">
                    <div class="p-4">
                      <!-- <div v-if="outlineLoading" class="flex justify-center items-center h-60">
                        <a-spin size="large" tip="课程大纲加载中..." />
                      </div> -->
                      <div class="p-4">
                        <div class="content-card">
                          <div class="content-card-header">
                            <div class="icon-wrapper">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                class="text-xl text-indigo-500"
                                width="24"
                                height="24"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <rect
                                  x="3"
                                  y="4"
                                  width="18"
                                  height="16"
                                  rx="3"
                                  stroke="currentColor"
                                  stroke-width="2"
                                  fill="none"
                                />
                                <path
                                  d="M7 8h10M7 12h10M7 16h6"
                                  stroke="currentColor"
                                  stroke-width="2"
                                  stroke-linecap="round"
                                />
                              </svg>
                            </div>
                            <h3>AI课程大纲</h3>
                          </div>
                          <div class="text-gray-700 leading-relaxed typewriter-container">
                            <div v-html="outlineText"></div>
                            <span v-if="isTypingOutline" class="animate-pulse">|</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </a-tab-pane>
                  <a-tab-pane key="3" title="内容总结">
                    <div class="p-4">
                      <div class="content-card">
                        <div class="content-card-header">
                          <div class="icon-wrapper">
                            <!-- SVG内容总结图标（文档+灯泡） -->
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              class="text-xl text-indigo-500"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                            >
                              <!-- 文档主体 -->
                              <rect
                                x="4"
                                y="3"
                                width="16"
                                height="18"
                                rx="3"
                                fill="#EEF2FF"
                                stroke="#6366F1"
                                stroke-width="1.5"
                              />
                              <!-- 文档折角 -->
                              <polyline
                                points="16,3 16,8 21,8"
                                fill="#C7D2FE"
                                stroke="#6366F1"
                                stroke-width="1.5"
                              />
                              <!-- 灯泡底座 -->
                              <rect x="9.5" y="16.5" width="5" height="2.5" rx="1" fill="#6366F1" />
                              <!-- 灯泡圆球 -->
                              <circle
                                cx="12"
                                cy="14"
                                r="3"
                                fill="#A5B4FC"
                                stroke="#6366F1"
                                stroke-width="1.2"
                              />
                              <!-- 灯泡高光 -->
                              <ellipse
                                cx="13"
                                cy="13"
                                rx="0.7"
                                ry="1.1"
                                fill="#fff"
                                fill-opacity="0.7"
                              />
                              <!-- 灯泡底部线 -->
                              <line
                                x1="11"
                                y1="19"
                                x2="13"
                                y2="19"
                                stroke="#6366F1"
                                stroke-width="1.2"
                                stroke-linecap="round"
                              />
                            </svg>
                          </div>
                          <h3>AI内容总结</h3>
                        </div>
                        <!-- <div class="typewriter-container"> -->
                        <div class="text-gray-700 leading-relaxed typewriter-container">
                          <div v-html="summaryText"></div>
                          <span v-if="isTypingSummary" class="animate-pulse">|</span>
                        </div>
                        <!-- </div> -->
                      </div>
                    </div>
                  </a-tab-pane>
                </a-tabs>
              </div>
            </div>
          </div>
        </div>
      </div>
    </a-config-provider>
  </div>
</template>

<script setup lang="ts">
import { generateChapter, generateSubtitle, generateSprite } from '@/api/video';
import { onMounted, onUnmounted, ref, reactive, type Ref } from 'vue';
import XGPlayer from '@/components/video-XGPlayer.vue';
const uploadData = JSON.parse(localStorage.getItem('upload') || 'null');
import { Modal } from '@arco-design/web-vue';
import { useChapterStore, useSubtitleStore } from '@/store';
import type { GenerateChapterResponse, GenerateProgressDotResponse } from '@/api/video/type';
import { useRouter } from 'vue-router';
import { IconArrowLeft } from '@arco-design/web-vue/es/icon';

const router = useRouter();
function goHome() {
  router.push('/');
}
const chapterStore = useChapterStore();
const subtitleStore = useSubtitleStore();
const xgPlayerRef = ref<typeof XGPlayer | null>(null);
const currentChapterIndex = ref(-1);
const activeSubTab = ref('null'); // 新增状态管理当前激活的子标签
const options = reactive({
  url: uploadData.videoUrl,
  poster: uploadData.coverPicture,
  width: '1196px',
  height: '673px',
  progressDot: [] as GenerateProgressDotResponse[],
  thumbnail: {},
  texttrack: {
    list: [],
  },
  chapters: [] as GenerateChapterResponse[],
});
//生成故事点
// async function progressDotList() {
//   if (localStorage.getItem('progressDot')) {
//     return;
//   }
//   const res = await generateProgressDot();
//   if (res.code === 200) {
//     Modal.success({
//       title: '故事点生成成功',
//       content: '故事点已生成，点击确认将故事点数据放入视频中。',
//       okText: '确认',
//       onOk: () => {
//         Object.assign(options, { progressDot: res.data });
//         localStorage.setItem('progressDot', JSON.stringify(res.data));
//       },
//     });
//   }
// }
//生成雪碧图
async function generateSpriteList() {
  const res = await generateSprite();
  if (res.code === 200) {
    options.thumbnail = res.data;
    localStorage.setItem('thumbnail', JSON.stringify(res.data));
  }
}
function updateCurrentChapter() {
  const playerComponent = xgPlayerRef.value;
  if (!playerComponent || !playerComponent.player) return;
  const currentTime = playerComponent.player.currentTime;
  let found = -1;
  for (let i = 0; i < chapterStore.chapters.length; i++) {
    const start = chapterStore.chapters[i].start;
    const end =
      i < chapterStore.chapters.length - 1 ? chapterStore.chapters[i + 1].start : Infinity;
    if (currentTime >= start && currentTime < end) {
      found = i;
      break;
    }
  }
  currentChapterIndex.value = found;
}

let timer: number | null = null;
onMounted(() => {
  // progressDotList();
  generateSpriteList();
  timer = window.setInterval(updateCurrentChapter, 500);
});
onUnmounted(() => {
  if (timer) window.clearInterval(timer);
});

const subtitleLoading = ref(false);
const chapterLoading = ref(false);
//字幕生成成功后,允许点击大纲和内容总结
// const flag = ref<boolean>(false)
// const outlineLoading = ref(false); // 课程大纲
// const summaryLoading = ref(false); // 内容总结

// 打字机效果相关状态
const outlineText = ref('');
const summaryText = ref('');
const isTypingOutline = ref(false);
const isTypingSummary = ref(false);

const addCustomChapter = async () => {
  if (chapterStore.chapters.length > 0) {
    return;
  }
  chapterLoading.value = true; // 在开始请求前设置loading为true
  try {
    const res = await generateChapter();
    if (res.code === 200) {
      Modal.success({
        title: '章节&故事点生成成功',
        content: '点击确认将章节和故事点自动放入视频',
        okText: '确认',
        alignCenter: true,
        onOk: () => {
          const chapters = res.data as unknown as GenerateChapterResponse[];
          Object.assign(options, { chapters });
          chapterStore.setChapters(chapters);
          //故事点
          const progressDot: { time: number; text: string }[] = [];
          chapters.forEach((item: GenerateChapterResponse) => {
            progressDot.push({
              time: item.start,
              text: item.title,
            });
          });
          Object.assign(options, { progressDot });
          localStorage.setItem('progressDot', JSON.stringify(progressDot));
          // 用户确认后才设置loading为false
          chapterLoading.value = false;
        },
      });
    } else {
      chapterLoading.value = false; // 如果请求失败，立即设置loading为false
    }
  } catch (error) {
    console.error('Error fetching chapters:', error);
    chapterLoading.value = false; // 出错时设置loading为false
  }
};

function seekTo(time: number) {
  const playerComponent = xgPlayerRef.value;
  if (
    playerComponent &&
    playerComponent.player &&
    typeof playerComponent.player.seek === 'function'
  ) {
    playerComponent.player.seek(time);
  }
}

function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// 解析 SSE 数据格式
// function parseSSEData(rawData: string) {
//   console.log('rawData:', JSON.stringify(rawData));
//   const lines = rawData.split(/\r?\n/);
//   const result: { id?: string; data?: string; event?: string } = {};

//   for (const line of lines) {
//     const trimmed = line.trim();
//     if (!trimmed) continue; // 跳过空行
//     // 只处理包含冒号的行
//     const colonIdx = trimmed.indexOf(":");
//     if (colonIdx === -1) continue;
//     const key = trimmed.slice(0, colonIdx).trim();
//     const value = trimmed.slice(colonIdx + 1).trim();
//     if (key === "id") {
//       result.id = value;
//     } else if (key === "data") {
//       result.data = value;
//     } else if (key === "event") {
//       result.event = value;
//     }
//   }
//   console.log('parseSSEData result:', result); // 调试输出
//   return result;
// }

// 处理 SSE 流数据
function handleSSEStream(
  eventSource: EventSource,
  targetRef: Ref<string>,
  isTypingRef: Ref<boolean>,
) {
  eventSource.onmessage = (event) => {
    // event.data 只包含 data 字段内容
    console.log('onmessage event.data:', event.data);
    // 直接用，不需要 parseSSEData
    targetRef.value += event.data;
  };

  eventSource.onerror = (error) => {
    console.error('SSE Error:', error);
    isTypingRef.value = false;
    eventSource.close();
  };

  // 监听自定义事件
  eventSource.addEventListener('summary-chunk', (event) => {
    // event.data 只包含 data 字段内容
    console.log('summary-chunk event.data:', event.data);
    targetRef.value += event.data;
  });

  // 监听结束事件
  eventSource.addEventListener('summary-end', () => {
    isTypingRef.value = false;
    eventSource.close();
  });
}
interface Subtitle {
  text: string;
}
const subtitleList = ref<Subtitle[]>([]);
async function generateSubtitleFile() {
  if (subtitleStore.subtitleList.length > 0) {
    return;
  }
  subtitleLoading.value = true; // 在开始请求前设置loading为true
  try {
    const res = await generateSubtitle();
    if (res.code == 200) {
      Object.assign(options, { texttrack: { list: [...options.texttrack.list, res.data] } });
      subtitleStore.setSubtitleList([res.data]);
      // 字幕数据获取成功后，解析字幕内容
      parseSubtitle();
    } else {
      subtitleLoading.value = false; // 如果请求失败，立即设置loading为false
    }
  } catch (error) {
    console.error('Error fetching subtitle:', error);
    subtitleLoading.value = false; // 出错时设置loading为false
  }
}
//解析字幕
function parseSubtitle() {
  if (subtitleStore.subtitleList.length === 0) {
    subtitleLoading.value = false; // 如果没有字幕数据，设置loading为false
    return;
  }
  const url = subtitleStore.subtitleList[0].url;
  fetch(url)
    .then((res) => res.text())
    .then((text) => {
      text.split('\n').forEach((item: string) => {
        // 提取所有中文（含标点）
        const match = item.match(/[\u4e00-\u9fa5，。！？、""''（）《》【】]+/g);
        if (match) {
          subtitleList.value.push({ text: match.join('') });
        }
      });
      subtitleLoading.value = false; // 字幕解析完成后设置loading为false
    })
    .catch((error) => {
      console.error('Error parsing subtitle:', error);
      subtitleLoading.value = false; // 解析出错时设置loading为false
    });
}
//切换标签页
function onTabChange(key: string) {
  activeSubTab.value = key;
  if (key === 'subtitle') {
    generateSubtitleFile();
    parseSubtitle();
  } else if (key === 'chapter') {
    addCustomChapter();
  }
  // 课程大纲、内容总结同理
}
//切换标签页
function handleTabChange(key: string) {
  if (key === '2') {
    // if (flag.value) {
    //   Modal.warning({
    //     title: '提示',
    //     content: '请先生成字幕，再查看课程大纲',
    //     alignCenter: true,
    //   });
    //   return;
    // }
    fetchOutline();
  } else if (key === '3') {
    fetchSummary();
  }
}
async function fetchOutline() {
  outlineText.value = ''; // 清空之前的内容
  isTypingOutline.value = true;
  try {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
    const eventSource = new EventSource(apiUrl + '/Outline');
    handleSSEStream(eventSource, outlineText, isTypingOutline);
  } catch (error) {
    console.error('Error fetching outline:', error);
    isTypingOutline.value = false;
  }
}
async function fetchSummary() {
  summaryText.value = ''; // 清空之前的内容
  isTypingSummary.value = true;

  try {
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080';
    const eventSource = new EventSource(apiUrl + '/Summary');
    handleSSEStream(eventSource, summaryText, isTypingSummary);
  } catch (error) {
    console.error('Error fetching summary:', error);
    isTypingSummary.value = false;
  }
}
</script>

<style>
:root {
  --primary: #6366f1;
  --primary-light: #e0e7ff;
  --dark-bg: #0f172a;
  --card-dark: #1e293b;
  --text-light: #1e293b;
  --text-dark: #f1f5f9;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Inter', 'PingFang SC', 'Microsoft YaHei', sans-serif;
}

body {
  background-color: #f8fafc;
  color: var(--text-light);
  transition: background-color 0.3s;
}

body.dark {
  background-color: var(--dark-bg);
  color: var(--text-dark);
}

.app-container {
  max-width: 1600px;
  margin: 0 auto;
  padding: 1rem;
}

.player-container {
  border-radius: 16px;
  overflow: hidden;
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 8px 10px -6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  background: #000;
}

.player-container:hover {
  box-shadow: 0 25px 50px -12px rgba(99, 102, 241, 0.25);
}

.side-panel {
  background: #fff;
  border-radius: 16px;
  box-shadow:
    0 10px 25px -5px rgba(0, 0, 0, 0.05),
    0 8px 10px -6px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  overflow: hidden;
}

.dark .side-panel {
  background: var(--card-dark);
  box-shadow:
    0 10px 25px -5px rgba(0, 0, 0, 0.3),
    0 8px 10px -6px rgba(0, 0, 0, 0.3);
}

.side-panel:hover {
  transform: translateY(-5px);
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.custom-tabs .arco-tabs-nav-tab {
  padding-left: 1rem;
  padding-right: 1rem;
  border-bottom: 1px solid #e5e7eb;
  background: transparent;
}

.dark .custom-tabs .arco-tabs-nav-tab {
  border-bottom: 1px solid #334155;
}

.custom-tabs .arco-tabs-tab {
  color: #64748b;
  font-weight: 500;
  padding: 0.75rem 1.25rem;
  margin: 0 0.25rem;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.2s;
}

.dark .custom-tabs .arco-tabs-tab {
  color: #94a3b8;
}

.custom-tabs .arco-tabs-tab:hover {
  color: #1e293b;
  background: #f1f5f9;
}

.dark .custom-tabs .arco-tabs-tab:hover {
  color: #f1f5f9;
  background: #334155;
}

.custom-tabs .arco-tabs-tab-active {
  color: var(--primary);
  background: var(--primary-light);
  font-weight: 600;
  position: relative;
}

.dark .custom-tabs .arco-tabs-tab-active {
  background: rgba(99, 102, 241, 0.15);
}

.custom-tabs .arco-tabs-tab-active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 70%;
  height: 3px;
  background: var(--primary);
  border-radius: 9999px;
}

.timeline {
  position: relative;
  padding-left: 1.5rem;
}

.timeline::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0.5rem;
  height: 100%;
  width: 2px;
  background: linear-gradient(to bottom, var(--primary) 0%, rgba(99, 102, 241, 0.2) 100%);
}

.timeline-item {
  position: relative;
  padding: 0.75rem;
  margin-bottom: 0.5rem;
  border-radius: 12px;
  transition: all 0.2s ease;
  background: #f8fafc;
  cursor: pointer;
}

.dark .timeline-item {
  background: #1a2435;
}

.timeline-item:hover {
  background: var(--primary-light);
  transform: translateX(5px);
}

.dark .timeline-item:hover {
  background: rgba(99, 102, 241, 0.15);
}

.timeline-item.active {
  background: var(--primary-light);
  border-left: 3px solid var(--primary);
}

.dark .timeline-item.active {
  background: rgba(99, 102, 241, 0.2);
}

.timeline-dot {
  position: absolute;
  left: -0.25rem;
  top: 50%;
  transform: translateY(-50%);
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  background: var(--primary);
  border: 3px solid #fff;
  z-index: 10;
}

.dark .timeline-dot {
  border-color: var(--card-dark);
}

.content-card {
  border-radius: 16px;
  padding: 1.5rem;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.dark .content-card {
  background: linear-gradient(135deg, #1a2b3f 0%, #0f1a2c 100%);
}

.content-card-header {
  display: flex;
  align-items: center;
  margin-bottom: 1.25rem;
}

.icon-wrapper {
  width: 3rem;
  height: 3rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  background: rgba(255, 255, 255, 0.7);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.dark .icon-wrapper {
  background: rgba(255, 255, 255, 0.1);
}

.content-card h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--primary);
  margin: 0;
}

.content-card p {
  line-height: 1.7;
  color: #475569;
}

.dark .content-card p {
  color: #cbd5e1;
}

.typewriter-container {
  font-family: 'JetBrains Mono', monospace;
  line-height: 1.7;
  min-height: 200px;
  overflow-y: auto;
  max-height: 400px;
  padding-right: 0.5rem;
}

.typewriter-container::-webkit-scrollbar {
  width: 6px;
}

.typewriter-container::-webkit-scrollbar-thumb {
  background: var(--primary);
  border-radius: 3px;
}

.cursor {
  display: inline-block;
  width: 8px;
  height: 1.2em;
  background: var(--primary);
  margin-left: 2px;
  animation: blink 1s infinite;
  vertical-align: middle;
}

@keyframes blink {
  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0;
  }
}
</style>
