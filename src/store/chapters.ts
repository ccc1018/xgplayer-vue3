// src/store/chapters.ts
import type { GenerateChapterResponse } from '@/api/video/type';
import { defineStore } from 'pinia';

export const useChapterStore = defineStore('chapter', {
  state: () => ({
    chapters: [] as GenerateChapterResponse[],
  }),
  actions: {
    getChapters() {
      return this.chapters;
    },
    setChapters(chapters: GenerateChapterResponse[]) {
      this.chapters = chapters;
    },
    // addChapter(chapter: Chapter) {
    //   this.chapters.push(chapter);
    // },
    clearChapters() {
      this.chapters = [];
    },
  },
  persist: true, // 一行即可
});
