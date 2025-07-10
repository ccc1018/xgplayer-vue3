import request from '@/utils/request';
import type { GenerateChapterResponse } from './type';
// 生成章节
export const generateChapter = () => {
  return request.get<GenerateChapterResponse>('/Chapters');
};
