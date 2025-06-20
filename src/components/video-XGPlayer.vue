<template>
  <div id="player" ref="player" />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import XGPlayer from 'xgplayer';
import 'xgplayer/dist/index.min.css';
import 'xgplayer/es/plugins/track/index.css';
import TextTrack from 'xgplayer/es/plugins/track';
import ChapterPlugin from '@/plugin/ChapterPlugin';

interface Chapter {
  start: number;
  title: string;
  duration: string | number;
}
const chapters = ref<Chapter[]>(JSON.parse(localStorage.getItem('chapters') || 'null'));
const player = ref<XGPlayer | null>(null);

const props = defineProps({
  options: {
    type: Object,
    required: true,
  },
});
const initPlayer = async () => {
  if (!props.options) return;
  player.value = new XGPlayer({
    id: 'player',
    url: props.options.url,
    width: props.options.width,
    height: props.options.height,
    //封面图地址
    poster: props.options.poster,
    //是否启用流式布局
    fluid: true,
    //设置/返回当前视频播放倍速
    playbackRate: [0.5, 0.75, 1, 1.5, 2],
    //默认起播倍速
    defaultPlaybackRate: 1,
    volume: 0.6,
    pip: true,
    muted: true, // 静音播放，避免自动播放限制
    plugins: [TextTrack, ChapterPlugin],
    chapterPlugin: {
      // 配置项键名需与 pluginName 一致
      chapters: chapters.value,
    },
    //播放器进度条故事点信息
    progressDot: [
      {
        id: 0, // 唯一标识，用于删除的时候索引
        time: 10, // 展示的时间点，例子为在播放到10s钟的时候展示
        text: '第一部 双手插顶利三焦', // hover的时候展示文案，可以为空
        duration: 5, // 展示时间跨度，单位为s
        style: {
          backgroundColor: 'blue',
        },
      },
      {
        time: 110,
        text: '第二部 手足前后固肾腰',
      },
      {
        time: 257,
        text: '第三部 调理脾肤需单举',
      },
      {
        time: 353,
        text: '第四部 左肝右肺如射雕',
      },
    ],
    thumbnail: {
      urls: ['/videos//23263DFDB9C3EC6A505A5F9E35A77191.jpg'], // 雪碧图url列表
      pic_num: 682, // 预览图总帧数
      row: 26, // 每张雪碧图包含的预览图行数
      col: 27, // 每张雪碧图包含的预览图列数
      height: 150, // 预览图每一帧的高度（单位：px）
      width: 200, // 预览图每一帧的宽度（单位：px）
    },
    lang: 'zh-cn',
    controls: {
      autoHide: true,
    },
    texttrack: {
      ...props.options.texttrack,
    },
  });
};

// 在组件挂载后初始化播放器
onMounted(() => {
  initPlayer(); // 确保在 DOM 渲染完成后调用播放器初始化
});
</script>

<style></style>
