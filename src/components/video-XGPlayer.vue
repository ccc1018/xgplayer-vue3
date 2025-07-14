<template>
  <div id="player" ref="player" />
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';
import XGPlayer from 'xgplayer';
import 'xgplayer/dist/index.min.css';
import 'xgplayer/es/plugins/track/index.css';
import TextTrack from 'xgplayer/es/plugins/track';
import ChapterPlugin from '@/plugin/ChapterPlugin';
import { useChapterStore, useSubtitleStore } from '@/store';
const subtitleStore = useSubtitleStore();
const chapterStore = useChapterStore();
const player = ref<XGPlayer | null>(null);
import { watch } from 'vue';
import { defineExpose } from 'vue';
const props = defineProps({
  options: {
    type: Object,
    required: true,
  },
});

console.log(props.options.progressDot);
defineExpose({ player });
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
      chapters:
        props.options?.chapters.length > 0 ? props.options?.chapters : chapterStore.chapters,
    },
    //播放器进度条故事点信息
    // progressDot: props.options.progressDot.length > 0 ? props.options.progressDot : JSON.parse(localStorage.getItem('progressDot') || '[]'),
    progressDot: props.options.progressDot,
    thumbnail: props.options.thumbnail,
    lang: 'zh-cn',
    controls: {
      autoHide: true,
    },
    texttrack: {
      list:
        props.options.texttrack.list.length > 0
          ? props.options.texttrack.list
          : subtitleStore.getSubtitleList(),
      domRender: true,
      defaultOpen: false,
      mode: 'bg',
      line: 'double',
      updateMode: 'vod',
      renderMode: 'normal',
      debugger: 'false',
      style: {
        follow: true,
        mode: 'stroke',
        followBottom: 50,
        fitVideo: true,
        offsetBottom: 2,
        baseSizeX: 49,
        baseSizeY: 28,
        minSize: 16,
        minMobileSize: 13,
        line: 'double',
        fontColor: '#fff',
      },
    },
  });
  console.log(props.options);
};
onMounted(() => {
  initPlayer(); // 确保在 DOM 渲染完成后调用播放器初始化
});
watch(
  () => props.options,
  () => {
    // 销毁并重建播放器
    if (player.value) {
      player.value.destroy();
      player.value = null;
    }
    nextTick(() => {
      initPlayer();
    });
  },
  {
    immediate: true,
  },
);
</script>

<style></style>
