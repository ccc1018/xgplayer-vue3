import request from '@/utils/request';
import type {
  GenerateChapterResponse,
  GenerateSubtitleResponse,
  GenerateProgressDotResponse,
  GenerateSpriteResponse,
} from './type';
// 生成章节
export const generateChapter = () => {
  return request.get<GenerateChapterResponse>('/Chapter');
};
//生成字幕
export const generateSubtitle = () => {
  return request.get<GenerateSubtitleResponse>('/subtitle');
};
//生成雪碧图
export const generateSprite = () => {
  return request.get<GenerateSpriteResponse>('/preview');
};
//生成故事点
export const generateProgressDot = () => {
  return request.get<GenerateProgressDotResponse[]>('/point');
};
