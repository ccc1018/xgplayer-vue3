<template>
  <div>
    <div class="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div class="container mx-auto px-4 py-6">
        <div class="flex flex-col lg:flex-row gap-6">
          <!-- 视频播放器区域 -->
          <div class="lg:w-3/4">
            <div class="player-wrapper rounded-xl overflow-hidden shadow-lg bg-black">
              <XGPlayer
                ref="xgPlayerRef"
                player-id="demo-player"
                :options="options"
                :key="options.chapters.length"
                class="w-full aspect-video"
              />
            </div>

            <!-- 视频信息区域 -->
            <div class="video-info mt-4 bg-white dark:bg-gray-800 rounded-lg p-4">
              <h1 class="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
                {{ uploadData?.title || '视频标题' }}
              </h1>
              <div class="flex items-center gap-4 text-gray-600 dark:text-gray-300 text-sm">
                <span class="flex items-center gap-1">
                  <i class="fas fa-eye text-pink-500"></i>
                  <span>1.2k 次观看</span>
                </span>
                <span class="flex items-center gap-1">
                  <i class="fas fa-clock text-pink-500"></i>
                  <span>上传于 {{ new Date().toLocaleDateString() }}</span>
                </span>
              </div>
            </div>
          </div>

          <!-- 右侧信息面板 - 优化后 -->
          <div class="lg:w-1/4">
            <div
              class="side-panel bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700"
            >
              <a-tabs
                default-active-key="1"
                lazy-load
                class="custom-tabs"
                :animation="true"
                type="rounded"
                @change="handleTabChange"
              >
                <a-tab-pane key="1" title="AI字幕&章节">
                  <div class="p-3">
                    <!-- 标签页头部美化 -->
                    <div class="mb-4">
                      <a-tabs
                        default-active-key="null"
                        class="w-full"
                        type="capsule"
                        size="medium"
                        tabBarGutter="6"
                        @change="onTabChange"
                      >
                        <a-tab-pane key="subtitle" title="字幕" />
                        <a-tab-pane key="chapter" title="章节" />
                      </a-tabs>
                    </div>
                    <!-- 字幕区域 - 时间轴风格 -->
                    <div v-if="activeSubTab === 'subtitle'">
                      <div v-if="subtitleLoading" class="flex justify-center items-center h-60">
                        <a-spin size="large" tip="字幕加载中..." />
                      </div>
                      <div v-else class="max-h-[600px] overflow-y-auto custom-scrollbar py-1">
                        <div class="timeline relative pl-6">
                          <div
                            v-for="(item, index) in subtitleList"
                            :key="index"
                            :class="[
                              'timeline-item group cursor-pointer flex items-center min-h-[48px] py-2 relative',
                              'hover:bg-blue-50 dark:hover:bg-blue-900/20 transition',
                            ]"
                          >
                            <!-- 竖线 -->
                            <div
                              v-if="index !== subtitleList.length - 1"
                              class="absolute left-2 top-5 w-0.5 h-[calc(100%-1.5rem)] bg-blue-200 dark:bg-blue-700 z-0"
                            ></div>
                            <!-- 圆点 -->
                            <div
                              class="w-3 h-3 rounded-full z-10 bg-blue-500 border-2 border-white"
                              style="margin-left: -0.625rem"
                            ></div>
                            <!-- 内容 -->
                            <div class="ml-4 flex-1 min-w-0">
                              <div
                                class="font-medium text-gray-800 dark:text-gray-100 text-sm mb-1"
                              >
                                {{ item.text }}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- 章节区域 - 时间轴风格 -->
                    <div v-if="activeSubTab === 'chapter'">
                      <div v-if="chapterLoading" class="flex justify-center items-center h-60">
                        <a-spin size="large" tip="章节加载中..." />
                      </div>
                      <div v-else class="max-h-[600px] overflow-y-auto custom-scrollbar py-1">
                        <div class="timeline relative pl-6">
                          <div
                            v-for="(item, index) in chapterStore.chapters"
                            :key="index"
                            @click="seekTo(item.start)"
                            :class="[
                              'timeline-item group cursor-pointer flex items-center min-h-[48px] py-2 relative',
                              currentChapterIndex === index ? 'bg-blue-50 dark:bg-blue-900/20' : '',
                              'hover:bg-blue-50 dark:hover:bg-blue-900/20 transition',
                            ]"
                          >
                            <!-- 竖线 -->
                            <div
                              v-if="index !== chapterStore.chapters.length - 1"
                              class="absolute left-2 top-5 w-0.5 h-[calc(100%-1.5rem)] bg-blue-200 dark:bg-blue-700 z-0"
                            ></div>
                            <!-- 圆点 -->
                            <div
                              :class="[
                                'w-3 h-3 rounded-full z-10',
                                currentChapterIndex === index
                                  ? 'bg-blue-500 border-2 border-white'
                                  : 'bg-blue-200',
                              ]"
                              style="margin-left: -0.625rem"
                            ></div>
                            <!-- 内容 -->
                            <div class="ml-4 flex-1 min-w-0">
                              <div
                                class="font-semibold text-gray-800 dark:text-gray-100 text-sm flex items-center"
                              >
                                {{ item.title }}
                                <span
                                  v-if="currentChapterIndex === index"
                                  class="ml-2 px-2 py-0.5 bg-blue-500 text-white text-xs rounded-full"
                                  >播放中</span
                                >
                              </div>
                              <div class="text-xs text-blue-500 font-mono text-right">
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
                  <div>
                    <div v-if="outlineLoading" class="flex justify-center items-center h-60">
                      <a-spin size="large" tip="课程大纲加载中..." />
                    </div>
                    <div v-else class="p-4 text-center">
                      <div
                        class="inline-flex flex-col items-center justify-center p-6 rounded-2xl bg-gradient-to-br from-pink-50 to-purple-50 dark:from-gray-700 dark:to-gray-800 my-4"
                      >
                        <div
                          class="w-16 h-16 rounded-full bg-pink-500 flex items-center justify-center mb-3"
                        >
                          <i class="fas fa-book-open text-2xl text-white"></i>
                        </div>
                        <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-1">
                          AI课程大纲
                        </h3>
                        <p class="text-gray-600 dark:text-gray-300 text-sm">
                          智能生成课程结构，梳理知识脉络
                        </p>
                        <div
                          class="mt-3 px-4 py-1.5 bg-pink-500 text-white text-xs rounded-full inline-block"
                        >
                          即将上线
                        </div>
                      </div>
                    </div>
                  </div>
                </a-tab-pane>

                <a-tab-pane key="3" title="内容总结">
                  <div>
                    <div v-if="summaryLoading" class="flex justify-center items-center h-60">
                      <a-spin size="large" tip="内容总结加载中..." />
                    </div>
                    <div v-else class="p-4 text-center">
                      <div
                        class="inline-flex flex-col items-center justify-center p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-700 dark:to-gray-800 my-4"
                      >
                        <div
                          class="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center mb-3"
                        >
                          <i class="fas fa-brain text-2xl text-white"></i>
                        </div>
                        <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-1">
                          AI内容总结
                        </h3>
                        <p class="text-gray-600 dark:text-gray-300 text-sm">
                          一键生成视频摘要，快速掌握核心内容
                        </p>
                        <div
                          class="mt-3 px-4 py-1.5 bg-blue-500 text-white text-xs rounded-full inline-block"
                        >
                          即将上线
                        </div>
                      </div>
                    </div>
                  </div>
                </a-tab-pane>
              </a-tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  generateChapter,
  generateSubtitle,
  generateProgressDot,
  generateSprite,
} from '@/api/video';
import { onMounted, onUnmounted, ref, reactive } from 'vue';
import XGPlayer from '@/components/video-XGPlayer.vue';
const uploadData = JSON.parse(localStorage.getItem('upload') || 'null');
import { Modal } from '@arco-design/web-vue';
import { useChapterStore, useSubtitleStore } from '@/store';
import type { GenerateChapterResponse, GenerateProgressDotResponse } from '@/api/video/type';
const chapterStore = useChapterStore();
const subtitleStore = useSubtitleStore();
const xgPlayerRef = ref<typeof XGPlayer | null>(null);
const currentChapterIndex = ref(-1);
const activeSubTab = ref('null'); // 新增状态管理当前激活的子标签
const options = reactive({
  url: uploadData.videoUrl,
  poster: uploadData.coverPicture,
  width: '1196px',
  height: '673',
  progressDot: [] as GenerateProgressDotResponse[],
  thumbnail: {},
  texttrack: {
    list: [],
  },
  chapters: [] as GenerateChapterResponse[],
});
//生成故事点
async function progressDotList() {
  if (localStorage.getItem('progressDot')) {
    return;
  }
  const res = await generateProgressDot();
  Modal.success({
    title: '故事点生成成功',
    content: '故事点已生成，点击确认将故事点数据放入视频中。',
    okText: '确认',
    onOk: () => {
      Object.assign(options, { progressDot: res.data });
      localStorage.setItem('progressDot', JSON.stringify(res.data));
    },
  });
}
//生成雪碧图
async function generateSpriteList() {
  const res = await generateSprite();
  options.thumbnail = res.data;
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
  progressDotList();
  generateSpriteList();
  timer = window.setInterval(updateCurrentChapter, 500);
});
onUnmounted(() => {
  if (timer) window.clearInterval(timer);
});

const subtitleLoading = ref(false);
const chapterLoading = ref(false);
const outlineLoading = ref(false); // 课程大纲
const summaryLoading = ref(false); // 内容总结

const addCustomChapter = async () => {
  if (chapterStore.chapters.length > 0) {
    return;
  }
  chapterLoading.value = true;
  try {
    const res = await generateChapter();
    Modal.success({
      title: '章节生成成功',
      content: '章节已生成，点击确认将章节数据放入视频中。',
      okText: '确认',
      onOk: () => {
        Object.assign(options, { chapters: res.data });
        chapterStore.setChapters(res.data as unknown as GenerateChapterResponse[]);
      },
    });
  } catch (error) {
    console.error('Error fetching chapters:', error);
  } finally {
    chapterLoading.value = false;
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
interface Subtitle {
  text: string;
}
const subtitleList = ref<Subtitle[]>([]);
async function generateSubtitleFile() {
  if (subtitleStore.subtitleList.length > 0) {
    return;
  }
  subtitleLoading.value = true;
  try {
    const res = await generateSubtitle();
    Object.assign(options, { texttrack: { list: [...options.texttrack.list, res.data] } });
    subtitleStore.setSubtitleList([res.data]);
  } catch (error) {
    console.error('Error fetching subtitle:', error);
  } finally {
    subtitleLoading.value = false;
  }
}
//解析字幕
function parseSubtitle() {
  if (subtitleStore.subtitleList.length === 0) {
    return;
  }
  const url = subtitleStore.subtitleList[0].url;
  fetch(url)
    .then((res) => res.text())
    .then((text) => {
      text.split('\n').forEach((item: string) => {
        // 提取所有中文（含标点）
        const match = item.match(/[\u4e00-\u9fa5，。！？、“”‘’（）《》【】]+/g);
        if (match) {
          subtitleList.value.push({ text: match.join('') });
        }
      });
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
  console.log(key);

  if (key === 'outline') {
    fetchOutline();
  } else if (key === 'summary') {
    fetchSummary();
  }
}
async function fetchOutline() {
  outlineLoading.value = true;
  try {
    // await fetchOutlineApi();
  } finally {
    outlineLoading.value = false;
  }
}
async function fetchSummary() {
  summaryLoading.value = true;
  try {
    // await fetchSummaryApi();
  } finally {
    summaryLoading.value = false;
  }
}
</script>

<style>
/* 自定义滚动条 - 更现代化 */
.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.15);
  border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.25);
}

.dark .custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
}

.dark .custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.15);
}

.dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.25);
}

/* 主标签页样式 - 更精致的B站风格 */
.custom-tabs .arco-tabs-nav-tab {
  padding-left: 1rem;
  padding-right: 1rem;
  border-bottom: 1px solid #e5e7eb;
  background: transparent;
}

.custom-tabs .arco-tabs-tab {
  color: #64748b;
  font-weight: 500;
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
  padding-left: 1rem;
  padding-right: 1rem;
  margin-left: 0.25rem;
  margin-right: 0.25rem;
  border-radius: 0.75rem 0.75rem 0 0;
  font-size: 1.1rem;
  transition:
    color 0.2s,
    background 0.2s;
  background: transparent;
  text-align: center;
}

.custom-tabs .arco-tabs-tab:hover {
  color: #1e293b;
}

.custom-tabs .arco-tabs-tab-active {
  color: #00a1d6;
  background: #e6f6fd;
  font-weight: 600;
  position: relative;
}

.custom-tabs .arco-tabs-tab-active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: #00a1d6;
  border-radius: 9999px;
}

.custom-tabs .arco-tabs-content {
  padding-top: 1rem;
}

/* 时间轴样式 - B站风格 */
.arco-timeline-item-dot {
  width: 0.5rem;
  height: 0.5rem;
}

.arco-timeline-item-content {
  padding-left: 0.75rem;
  padding-bottom: 0.75rem;
}

.arco-timeline-item-line {
  background: #e5e7eb;
}

.dark .arco-timeline-item-line {
  background: #334155;
}

/* 胶囊标签样式 - 抖音风格优化 */
.arco-tabs-nav-type-capsule .arco-tabs-tab {
  margin-left: 0.25rem;
  margin-right: 0.25rem;
  border-radius: 9999px;
  padding-left: 1rem;
  padding-right: 1rem;
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.arco-tabs-nav-type-capsule .arco-tabs-tab-active {
  background: linear-gradient(to right, #00a1d6, #3eb6e0);
  color: #fff;
  box-shadow: 0 2px 8px rgba(0, 161, 214, 0.15);
  transform: translateY(-1px);
}

/* 圆角标签样式 - B站风格优化 */
.arco-tabs-nav-type-rounded .arco-tabs-tab {
  border-radius: 0.75rem;
  padding-left: 1rem;
  padding-right: 1rem;
  padding-top: 0.375rem;
  padding-bottom: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.arco-tabs-nav-type-rounded .arco-tabs-tab-active {
  background: linear-gradient(to right, #e0f7ff, #b3e6fa);
  color: #00a1d6;
  box-shadow: 0 2px 8px rgba(0, 161, 214, 0.1);
  transform: translateY(-1px);
}

.dark .arco-tabs-nav-type-rounded .arco-tabs-tab-active {
  background: rgba(0, 161, 214, 0.18);
  color: #00a1d6;
}

/* 面板整体美化 */
.side-panel {
  box-shadow:
    0 10px 25px -5px rgba(0, 0, 0, 0.1),
    0 8px 10px -6px rgba(0, 0, 0, 0.1);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.side-panel:hover {
  transform: translateY(-2px);
  box-shadow:
    0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

/* 章节条目动画 */
.chapter-item {
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.chapter-item:hover {
  transform: translateX(3px);
}

/* 章节/字幕高亮色 */
.chapter-item.active,
.subtitle-item.active {
  background: #e6f6fd;
  border-left: 4px solid #00a1d6;
  color: #00a1d6;
}

/* 章节/字幕时间主色 */
.chapter-item .time,
.subtitle-item .time {
  color: #00a1d6;
}

/* icon主色 */
.text-bilibili-blue,
.icon-bilibili-blue {
  color: #00a1d6 !important;
}

.bg-bilibili-blue {
  background: #00a1d6 !important;
}
</style>
