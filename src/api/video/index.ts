import request from '@/utils/request';
import type {
  ApiResponse,
  GenerateChapterResponse,
  GenerateSubtitleResponse,
  GenerateProgressDotResponse,
  GenerateSpriteResponse,
} from './type';
// 生成章节
export const generateChapter = (): Promise<ApiResponse<GenerateChapterResponse[]>> => {
  return request.get('/Chapter');
};
//生成字幕
export const generateSubtitle = (): Promise<ApiResponse<GenerateSubtitleResponse>> => {
  return request.get('/subtitle');
};
//生成雪碧图
export const generateSprite = (): Promise<ApiResponse<GenerateSpriteResponse>> => {
  return request.get('/preview');
};
//生成故事点
export const generateProgressDot = (): Promise<ApiResponse<GenerateProgressDotResponse>> => {
  return request.get('/point');
};
//课程大纲
export const generateCourseOutline = () => {
  return request.get('/Outline');
};
// 内容总结
export const generateContentSummary = () => {
  return request.get('/Summary');
};
