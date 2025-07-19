import { defineStore } from 'pinia';
import type { GenerateSubtitleResponse } from '@/api/video/type';

export const useSubtitleStore = defineStore('subtitle', {
  state: () => ({
    subtitleList: [] as GenerateSubtitleResponse[],
  }),
  actions: {
    getSubtitleList() {
      return this.subtitleList;
    },
    setSubtitleList(subtitleList: GenerateSubtitleResponse[]) {
      console.log(subtitleList);
      this.subtitleList = subtitleList;
    },
    // addSubtitle(subtitle: GenerateSubtitleResponse) {
    //   this.subtitleList.push(subtitle);
    // },
    clearSubtitleList() {
      this.subtitleList = [];
    },
  },
  persist: true, // 一行即可
});
