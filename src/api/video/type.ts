// 生成章节
export interface GenerateChapterResponse {
  start: number;
  title: string;
  duration: string | number;
}
// 生成字幕
export interface GenerateSubtitleResponse {
  id: string;
  url: string;
  language: string;
  text: string;
  default: boolean;
}
//雪碧图接口
export interface GenerateSpriteResponse {
  pic_num: number;
  url: string;
}
// 故事点接口
export interface GenerateProgressDotResponse {
  time: string;
  text: string;
}
