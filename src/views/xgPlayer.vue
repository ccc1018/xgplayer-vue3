<template>
  <div class="min-h-screen bg-white">
    <div class="container mx-auto px-4 py-8">
      <div class="flex flex-col lg:flex-row gap-8">
        <!-- 视频播放器区域 -->
        <div class="lg:w-3/4">
          <div class="player-wrapper">
            <XGPlayer player-id="demo-player" :options="options" class="w-full aspect-video" />
          </div>

          <!-- 视频信息区域 -->
          <div class="video-info mt-6">
            <h1 class="text-2xl font-bold mb-4 text-gray-800">
              {{ uploadData?.title || '视频标题' }}
            </h1>
            <div class="flex items-center gap-4 text-gray-500">
              <span class="flex items-center gap-2">
                <i class="fas fa-eye text-orange-500"></i>
                <span>1.2k 次观看</span>
              </span>
              <span class="flex items-center gap-2">
                <i class="fas fa-clock text-orange-500"></i>
                <span>上传于 {{ new Date().toLocaleDateString() }}</span>
              </span>
            </div>
          </div>
        </div>
        <!-- 右侧信息面板 -->
        <div class="lg:w-1/4">
          <div class="side-panel">
            <a-tabs default-active-key="1" class="custom-tabs" :animation="true">
              <a-tab-pane key="1" title="AI字幕&章节">
                <div class="p-4">
                  <div class="flex justify-between items-center mb-4">
                    <h2 class="text-lg font-semibold text-gray-800">视频章节</h2>
                    <a-button type="primary" @click="addCustomChapter" class="custom-button">
                      <template #icon><i class="fas fa-magic"></i></template>
                      生成章节
                    </a-button>
                  </div>

                  <div class="space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar">
                    <a-timeline>
                      <a-timeline-item
                        dotColor="#f97316"
                        dot-type="hollow"
                        do
                        v-for="(item, index) in options.chapters"
                        :key="index"
                        class="timeline-item"
                      >
                        <div class="flex flex-col items-start gap-3">
                          <h2 class="text-gray-700 flex-1">{{ item.title }}</h2>
                          <p class="text-gray-500 font-mono text-sm min-w-[60px]">
                            <span>
                              {{ formatTime(item.start) }}
                            </span>
                            -
                            <span>
                              {{ item.duration }}
                            </span>
                          </p>
                        </div>
                      </a-timeline-item>
                    </a-timeline>
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
</template>

<script setup lang="ts">
import { generateChapter } from '@/api/video';
import { reactive } from 'vue';
import XGPlayer from '@/components/video-XGPlayer.vue';
const uploadData = JSON.parse(localStorage.getItem('upload') || 'null');
console.log(uploadData.videoUrl);
interface Chapter {
  title: string;
  start: number;
  duration: number;
}
const options = reactive({
  url: uploadData.videoUrl,
  // url: "http://localhost/video.mp4",
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

const addCustomChapter = async () => {
  if (localStorage.getItem('chapters') !== null) {
    options.chapters = JSON.parse(localStorage.getItem('chapters') || 'null');
    return;
  }
  try {
    const res = await generateChapter();
    options.chapters = res.data.chapters;
    localStorage.setItem('chapters', JSON.stringify(res.data.chapters));
  } catch (error) {
    console.error('Error fetching chapters:', error);
  }
};

// 格式化时间
function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// 获取字幕数据
// const fetchSubtitles = async () => {
//   try {
//     if (isCacheValid() && cache.subtitles) {
//       options.texttrack.list = cache.subtitles
//       return
//     }

//     const subtitlesRes = await axios.get('http://192.168.1.104:116/subtitle')
//     options.texttrack.list = subtitlesRes.data.data
//     cache.subtitles = subtitlesRes.data.data
//     cache.lastFetchTime = Date.now()
//   } catch (error) {
//     console.error('Error fetching subtitles:', error)
//     if (cache.subtitles) {
//       options.texttrack.list = cache.subtitles
//     }
//   }
// }
</script>

<style>
/* 自定义滚动条样式 */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #f3f4f6;
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e5e7eb;
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #d1d5db;
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
</style>
