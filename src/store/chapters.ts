// src/store/chapters.ts
import { defineStore } from 'pinia';

export interface Chapter {
  start: number;
  title: string;
  duration: string | number;
}

export const useChapterStore = defineStore('chapter', {
  state: () => ({
    chapters: [] as Chapter[],
  }),
  actions: {
    setChapters(chapters: Chapter[]) {
      this.chapters = chapters;
    },
    addChapter(chapter: Chapter) {
      this.chapters.push(chapter);
    },
    // 你可以添加更多方法
  },
  persist: {
    key: 'chapters', // localStorage 的 key
    storage: localStorage,
  },
});
