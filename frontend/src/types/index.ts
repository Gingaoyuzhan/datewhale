// API响应类型
export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T | null;
  timestamp: string;
}

// 用户类型
export interface User {
  id: number;
  username: string;
  email: string;
  nickname: string;
  avatar: string | null;
  createdAt: string;
}

// 作家类型
export interface Author {
  id: number;
  name: string;
  nameEn?: string;
  era?: string;
  nationality?: string;
  styleTags?: string[];
  bio?: string;
  avatar?: string;
  plantType?: string;
  plantSymbol?: string;
}

// 作品类型
export interface Work {
  id: number;
  title: string;
  type?: string;
  era?: string;
}

// 文学段落类型
export interface Passage {
  id: number;
  content: string;
  author: Author | null;
  work: Work | null;
  emotionTags?: string[];
  imageryTags?: string[];
  sceneTags?: string[];
  themeTags?: string[];
}

// 匹配结果类型
export interface MatchResult {
  rank: number;
  passage: Passage;
  matchScore: number;
  matchReason: string;
}

// 情感分析结果
export interface EmotionAnalysis {
  emotions: { name: string; score: number }[];
  keywords: string[];
  imagery: string[];
  scenes: string[];
  psychologicalInsight: string;
}

// 日记类型
export interface Entry {
  id: number;
  content: string;
  emotionPrimary: string;
  emotionSecondary?: string[];
  emotionIntensity: number;
  keywords?: string[];
  imagery?: string[];
  scenes?: string[];
  weatherType: string;
  psychologicalInsight?: string;
  createdAt: string;
  matches?: MatchResult[];
}

// 花园植物类型
export interface GardenPlant {
  authorId: number;
  authorName: string;
  plantType: string;
  plantSymbol?: string;
  stage: number;
  matchCount: number;
  lastMatchAt: string;
}

// 花园更新类型
export interface GardenUpdate {
  authorId: number;
  authorName: string;
  plantType: string;
  previousStage: number;
  currentStage: number;
  isNewPlant: boolean;
}

// 创建日记响应
export interface CreateEntryResponse {
  entry: Entry;
  analysis: EmotionAnalysis;
  matches: MatchResult[];
  gardenUpdates: GardenUpdate[];
}

// 情绪曲线数据
export interface EmotionCurveData {
  date: string;
  emotion: string;
  intensity: number;
  entryCount: number;
}

// 时光轴数据
export interface TimelineItem {
  id: number;
  date: string;
  emotion: string;
  weather: string;
  keywords: string[];
  preview: string;
}

// 情绪类型
export const EMOTIONS = [
  { name: '快乐', emoji: '😊' },
  { name: '悲伤', emoji: '😢' },
  { name: '愤怒', emoji: '😠' },
  { name: '恐惧', emoji: '😨' },
  { name: '惊讶', emoji: '😮' },
  { name: '平静', emoji: '😐' },
  { name: '孤独', emoji: '🌙' },
  { name: '感动', emoji: '🥹' },
  { name: '困惑', emoji: '😕' },
  { name: '期待', emoji: '✨' },
  { name: '疲惫', emoji: '😴' },
  { name: '充实', emoji: '💪' },
] as const;

// 天气类型映射
export const WEATHER_MAP: Record<string, { icon: string; className: string; name: string }> = {
  '晴天': { icon: '☀️', className: 'weather-sunny', name: 'Sunny' },
  '雨天': { icon: '🌧️', className: 'weather-rainy', name: 'Rainy' },
  '多云': { icon: '☁️', className: 'weather-cloudy', name: 'Cloudy' },
  '雷暴': { icon: '⛈️', className: 'weather-storm', name: 'Stormy' },
  '雾天': { icon: '🌫️', className: 'weather-foggy', name: 'Foggy' },
  '彩虹': { icon: '🌈', className: 'weather-rainbow', name: 'Rainbow' },
};
