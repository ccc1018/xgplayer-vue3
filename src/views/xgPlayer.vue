<template>
  <div>
    <div
      class="min-h-screen bg-gradient-to-br from-white via-sky-50 to-sky-100 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900"
    >
      <div class="container mx-auto px-4 py-8">
        <div class="flex flex-col lg:flex-row gap-8">
          <!-- 视频播放器区域 -->
          <div class="lg:w-3/4">
            <div
              class="player-wrapper rounded-2xl shadow-2xl border border-sky-100 dark:border-gray-800 bg-black/90"
            >
              <XGPlayer
                ref="xgPlayerRef"
                player-id="demo-player"
                :options="options"
                :key="options.chapters.length"
                class="w-full aspect-video"
              />
            </div>
            <!-- 视频信息区域 -->
            <div
              class="video-info mt-6 rounded-2xl shadow-lg border border-sky-100 dark:border-gray-800 bg-white/90 dark:bg-gray-900/80"
            >
              <h1 class="text-3xl font-extrabold mb-4 text-gray-900 dark:text-white tracking-tight">
                {{ uploadData?.title || '视频标题' }}
              </h1>
              <div class="flex items-center gap-6 text-gray-500 dark:text-gray-400 text-lg">
                <span class="flex items-center gap-2">
                  <i class="fas fa-eye text-sky-500"></i>
                  <span>1.2k 次观看</span>
                </span>
                <span class="flex items-center gap-2">
                  <i class="fas fa-clock text-sky-500"></i>
                  <span>上传于 {{ new Date().toLocaleDateString() }}</span>
                </span>
              </div>
            </div>
          </div>
          <!-- 右侧信息面板 -->
          <div class="lg:w-1/4">
            <div
              class="side-panel rounded-2xl shadow-xl border border-sky-100 dark:border-gray-800 bg-white/95 dark:bg-gray-900/90"
            >
              <a-tabs
                default-active-key="1"
                lazy-load
                class="custom-tabs"
                :animation="true"
                type="card"
                size="large"
                tabBarGutter="16"
              >
                <a-tab-pane key="1" title="AI字幕&章节">
                  <div class="p-4 relative">
                    <div class="flex justify-between items-center mb-4">
                      <!-- <h2 class="text-xl font-bold text-gray-800 dark:text-gray-100 tracking-wide">视频章节</h2> -->
                    </div>
                    <div class="space-y-2 max-h-[600px] overflow-y-auto custom-scrollbar">
                      <a-tabs
                        default-active-key="chapter"
                        class="w-full"
                        type="card"
                        size="large"
                        tabBarGutter="12"
                        @change="onTabChange"
                      >
                        <a-tab-pane key="subtitle" title="字幕时间轴">
                          <a-timeline class="!pl-0">
                            <a-timeline-item
                              v-for="(item, index) in subtitleList"
                              :key="index"
                              :dotColor="'#0ea5e9'"
                              :dot-type="'hollow'"
                            >
                              <div
                                class="flex items-center justify-between rounded-xl border bg-white/95 dark:bg-gray-900/80 py-2 px-4 shadow-sm"
                              >
                                <div class="flex-1 min-w-0">
                                  <div
                                    class="font-semibold text-gray-800 dark:text-gray-100 truncate text-base"
                                  >
                                    {{ item.text }}
                                  </div>
                                </div>
                                <div
                                  class="ml-4 text-right min-w-[70px] font-mono text-base text-sky-500 dark:text-sky-400"
                                >
                                  <span>{{ formatTime(item.start) }}</span>
                                  <span class="mx-1">-</span>
                                  <span>{{ formatTime(item.end) }}</span>
                                </div>
                              </div>
                            </a-timeline-item>
                          </a-timeline>
                        </a-tab-pane>
                        <a-tab-pane key="chapter" title="章节列表">
                          <a-timeline class="!pl-0">
                            <a-timeline-item
                              v-for="(item, index) in chapterStore.chapters"
                              :key="index"
                              :dotColor="currentChapterIndex === index ? '#0ea5e9' : '#cbd5e1'"
                              :dot-type="currentChapterIndex === index ? 'solid' : 'hollow'"
                              :class="[
                                'group transition-all',
                                currentChapterIndex === index
                                  ? 'before:!bg-sky-500'
                                  : 'before:!bg-gray-300 dark:before:!bg-gray-700',
                              ]"
                            >
                              <div
                                @click="seekTo(item.start)"
                                :class="[
                                  'flex items-center justify-between rounded-xl cursor-pointer border transition-all select-none',
                                  'bg-white/95 dark:bg-gray-900/80',
                                  'py-2 px-4',
                                  'hover:bg-sky-50 dark:hover:bg-sky-800/60',
                                  'hover:border-sky-400',
                                  currentChapterIndex === index
                                    ? 'border-2 border-sky-500 bg-sky-50 dark:bg-sky-900/40 shadow-lg'
                                    : 'border-gray-200 dark:border-gray-700 shadow-sm',
                                ]"
                              >
                                <div class="flex-1 min-w-0">
                                  <div
                                    class="font-semibold text-gray-800 dark:text-gray-100 truncate text-base"
                                  >
                                    {{ item.title }}
                                  </div>
                                </div>
                                <div
                                  class="ml-4 text-right min-w-[70px] font-mono text-base text-sky-500 dark:text-sky-400"
                                >
                                  <span>{{ formatTime(item.start) }}</span>
                                  <span class="mx-1">-</span>
                                  <span>{{
                                    formatTime(
                                      item.start +
                                        (typeof item.duration === 'number'
                                          ? item.duration
                                          : parseFloat(item.duration)),
                                    )
                                  }}</span>
                                </div>
                              </div>
                            </a-timeline-item>
                          </a-timeline>
                        </a-tab-pane>
                      </a-tabs>
                    </div>
                  </div>
                </a-tab-pane>
                <a-tab-pane key="2" title="AI课程大纲">
                  <div class="p-4">
                    <div class="text-center py-8 text-gray-500">
                      <i class="fas fa-book-open text-4xl mb-3 text-orange-500"></i>
                      <p>AI课程大纲生成功能即将上线</p>
                    </div>
                  </div>
                </a-tab-pane>
                <a-tab-pane key="3" title="AI内容总结">
                  <div class="p-4">
                    <div class="text-center py-8 text-gray-500">
                      <i class="fas fa-brain text-4xl mb-3 text-orange-500"></i>
                      <p>AI视频内容总结功能即将上线</p>
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
import { generateChapter } from '@/api/video';
import { onMounted, onUnmounted, ref, reactive } from 'vue';
import XGPlayer from '@/components/video-XGPlayer.vue';
const uploadData = JSON.parse(localStorage.getItem('upload') || 'null');
import { useChapterStore } from '@/store/chapters';
import { Modal } from '@arco-design/web-vue';
const chapterStore = useChapterStore();
interface Chapter {
  title: string;
  start: number;
  duration: number;
}
const options = reactive({
  url: uploadData.videoUrl,
  poster: uploadData.coverPicture,
  width: '1196px',
  height: '673',
  progressDot: [],
  thumbnail: {},
  texttrack: {
    list: [
      {
        id: 'vtt1',
        url: '',
        language: 'zh-cn',
        text: '中文',
        default: false,
      },
      {
        id: 'vtt2',
        url: 'https://x-short-prod.s3.ap-northeast-1.amazonaws.com/prod/videos/2-25126641776734208/0022dcd8467e60231f783e29ceff4d4d/srt.vtt',
        language: 'en',
        text: '英文',
        default: false,
      },
    ],
    domRender: true,
    defaultOpen: false, // 是否默认开启字幕
    mode: 'bg',
    line: 'double',
    updateMode: 'vod',
    renderMode: 'normal',
    debugger: 'false',
    style: {
      follow: true, // 是否跟随控制栏调整位置
      mode: 'stroke', // 字体显示模式 stroke/bg（文字描边/文字背景），默认为stroke
      followBottom: 50, // 跟随底部控制栏的高度
      fitVideo: true, // 是否跟随视频自动调整字号
      offsetBottom: 2, // 字幕距离画面底部百分比，默认2%
      baseSizeX: 49, // 横屏视频适配基准字号
      baseSizeY: 28, // 竖屏视频适配基准字号
      minSize: 16, // pc端最小字号
      minMobileSize: 13, // 移动端最小字号
      line: 'double', // 最大显示行数 single/double/three
      fontColor: '#fff', // 字体颜色
    },
  },
  chapters: [] as Chapter[],
});

const xgPlayerRef = ref<typeof XGPlayer | null>(null);
const currentChapterIndex = ref(-1);

// 自动高亮当前播放章节
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
  timer = window.setInterval(updateCurrentChapter, 500);
});
onUnmounted(() => {
  if (timer) window.clearInterval(timer);
});

const addCustomChapter = async () => {
  if (chapterStore.chapters.length > 0) {
    return;
  }
  try {
    const res = await generateChapter();
    Modal.success({
      title: '章节生成成功',
      content: '章节已生成，点击确认将章节数据放入视频中。',
      okText: '确认',
      onOk: () => {
        options.chapters = res.data.chapters;
        chapterStore.setChapters(res.data.chapters);
      },
    });
  } catch (error) {
    console.error('Error fetching chapters:', error);
  } finally {
    console.log(options.chapters);
  }
};

// 跳转到指定时间点
function seekTo(time: number) {
  console.log(time);

  // 通过ref获取XGPlayer实例并调用其seek方法
  const playerComponent = xgPlayerRef.value;
  if (
    playerComponent &&
    playerComponent.player &&
    typeof playerComponent.player.seek === 'function'
  ) {
    playerComponent.player.seek(time);
  }
}

// 格式化时间
function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// 字幕数据结构和生成方法（模拟）
// 定义类型
interface SubtitleItem {
  text: string;
  start: number;
  end: number;
}

// 使用具体类型
const subtitleList = ref<SubtitleItem[]>([]);
function generateSubtitle() {
  // 这里应调用实际API，以下为模拟数据
  subtitleList.value = [
    { text: '字幕片段一', start: 0, end: 10 },
    { text: '字幕片段二', start: 10, end: 25 },
    { text: '字幕片段三', start: 25, end: 40 },
  ];
}

// tab切换时自动生成字幕或章节
function onTabChange(key: string) {
  if (key === 'subtitle') {
    generateSubtitle();
  } else if (key === 'chapter') {
    addCustomChapter();
  }
}
</script>

<style>
/* 自定义滚动条样式 */
.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #e0e7ef;
  border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #bae6fd;
  border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #7dd3fc;
}

/* 自定义标签页样式 */
.custom-tabs .arco-tabs-nav-tab {
  background-color: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
}

.custom-tabs .arco-tabs-tab {
  color: #6b7280;
  transition: color 0.3s ease;
}

.custom-tabs .arco-tabs-tab:hover {
  color: #f97316;
}

.custom-tabs .arco-tabs-tab-active {
  color: #f97316;
}

.custom-tabs .arco-tabs-tab-active::after {
  background: linear-gradient(to right, #f97316, #fb923c);
}

/* 时间轴样式优化 */
.timeline-item .arco-timeline-item-content {
  background-color: #f9fafb;
  padding: 0.55rem;
  transition: all 0.3s ease;
}

.timeline-item .arco-timeline-item-content:hover {
  background-color: #f3f4f6;
  border-color: #f97316;
}

.timeline-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: linear-gradient(to right, #f97316, #fb923c);
  box-shadow: 0 0 0 4px rgba(249, 115, 22, 0.1);
}

.timeline-item .arco-timeline-item-line {
  background: linear-gradient(to bottom, #f97316, #fb923c);
}

/* 播放器容器样式 */
.player-wrapper {
  position: relative;
  background-color: #000000;
  border-radius: 0.75rem;
  overflow: hidden;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  aspect-ratio: 16/9;
}

/* 按钮样式优化 */
.custom-button {
  background: linear-gradient(to right, #f97316, #fb923c) !important;
  border: none !important;
  box-shadow:
    0 4px 6px -1px rgba(249, 115, 22, 0.1),
    0 2px 4px -1px rgba(249, 115, 22, 0.06) !important;
  transition: all 0.3s ease !important;
}

.custom-button:hover {
  opacity: 0.9;
  transform: scale(1.02);
  box-shadow:
    0 10px 15px -3px rgba(249, 115, 22, 0.1),
    0 4px 6px -2px rgba(249, 115, 22, 0.05) !important;
}

/* 视频信息区域 */
.video-info {
  background-color: #ffffff;
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow:
    0 1px 3px 0 rgba(0, 0, 0, 0.1),
    0 1px 2px 0 rgba(0, 0, 0, 0.06);
  border: 1px solid #e5e7eb;
}

/* 右侧面板 */
.side-panel {
  background-color: #ffffff;
  border-radius: 0.75rem;
  box-shadow:
    0 1px 3px 0 rgba(0, 0, 0, 0.1),
    0 1px 2px 0 rgba(0, 0, 0, 0.06);
  border: 1px solid #e5e7eb;
  overflow: hidden;
}

/* 加载动画优化 */
.loading-overlay {
  background-color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(8px);
}

.loading-spinner {
  border-color: #e5e7eb;
  border-top-color: #f97316;
}

.loading-text {
  color: #6b7280;
}

.fullscreen-loading {
  position: fixed;
  z-index: 9999;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  transition: all 0.3s;
}

.loader {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.circular {
  animation: rotate 2s linear infinite;
  height: 80px;
  width: 80px;
}

.path {
  stroke: #f97316;
  stroke-dasharray: 90, 150;
  stroke-dashoffset: 0;
  stroke-linecap: round;
  animation: dash 1.5s ease-in-out infinite;
}

.loading-text {
  margin-top: 24px;
  font-size: 1.2rem;
  color: #0ea5e9;
  font-weight: bold;
  letter-spacing: 2px;
}

@keyframes rotate {
  100% {
    transform: rotate(360deg);
  }
}

@keyframes dash {
  0% {
    stroke-dasharray: 1, 200;
    stroke-dashoffset: 0;
  }

  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -35;
  }

  100% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -124;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.local-loading {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.85);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 10;
  border-radius: 1rem;
}

.chapter-title.clickable {
  cursor: pointer;
  color: #f97316;
  transition: color 0.2s;
}

.chapter-title.clickable:hover {
  color: #fb923c;
  text-decoration: underline;
}
</style>
