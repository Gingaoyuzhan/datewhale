import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

// 情感分析结果接口
export interface EmotionAnalysisResult {
  emotions: { name: string; score: number }[];
  primaryEmotion: string;
  emotionIntensity: number;
  keywords: string[];
  imagery: string[];
  scenes: string[];
  themes: string[];
  weatherType: string;
  psychologicalInsight: string;
  imageAnalysis?: string; // 图片分析结果
}

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private readonly apiKey: string;
  private readonly baseUrl = 'https://dashscope.aliyuncs.com/api/v1';

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get('DASHSCOPE_API_KEY', '');
  }

  // 情感分析（支持图片）
  async analyzeEmotion(content: string, images?: string[]): Promise<EmotionAnalysisResult> {
    // 如果有图片，先分析图片内容
    let imageDescription = '';
    if (images && images.length > 0) {
      this.logger.log(`开始分析 ${images.length} 张图片...`);
      imageDescription = await this.analyzeImages(images);
      this.logger.log(`图片分析结果: ${imageDescription}`);
    }

    const prompt = `你是一个专业的文本情感分析专家。请分析以下日记内容，返回JSON格式的分析结果。

日记内容：
"""
${content}
"""
${imageDescription ? `\n用户上传的图片内容描述：\n"""\n${imageDescription}\n"""` : ''}

请结合文字和图片内容（如有），返回以下JSON格式（不要包含任何其他文字，只返回JSON）：
{
  "emotions": [
    {"name": "情绪名称", "score": 0.0到1.0的强度}
  ],
  "primaryEmotion": "主要情绪",
  "emotionIntensity": 0.0到1.0,
  "keywords": ["关键词1", "关键词2"],
  "imagery": ["意象1", "意象2"],
  "scenes": ["场景1", "场景2"],
  "themes": ["主题1", "主题2"],
  "weatherType": "晴天/雨天/多云/雷暴/雾天/彩虹",
  "psychologicalInsight": "一段温暖的心理学洞察，100字以内"${imageDescription ? ',\n  "imageAnalysis": "对图片内容的简短分析，50字以内"' : ''}
}

情绪类型包括：快乐、悲伤、愤怒、恐惧、惊讶、平静、孤独、感动、困惑、期待、疲惫、充实、矛盾、释然
意象示例：月亮、雨、窗、路、海、山、花、树、风、云
场景示例：校园、咖啡馆、深夜、清晨、车站、家中、办公室`;

    try {
      const response = await this.callQwen(prompt);
      // 解析JSON响应
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw new Error('无法解析AI响应');
    } catch (error) {
      this.logger.error('情感分析失败', error);
      // 返回默认值
      return this.getDefaultAnalysis();
    }
  }

  // 分析图片内容（使用通义千问VL多模态模型）
  private async analyzeImages(images: string[]): Promise<string> {
    try {
      // 只分析前3张图片，避免请求过大
      const imagesToAnalyze = images.slice(0, 3);

      // 构建多模态消息内容
      const content: any[] = [
        {
          type: 'text',
          text: '请描述这些图片的内容、情感氛围和可能表达的心情。用简洁的中文描述，每张图片50字以内。',
        },
      ];

      // 添加图片
      for (const imageUrl of imagesToAnalyze) {
        // 检查是否是 base64 格式
        if (imageUrl.startsWith('data:image')) {
          content.push({
            type: 'image',
            image: imageUrl,
          });
        }
      }

      const response = await axios.post(
        `${this.baseUrl}/services/aigc/multimodal-generation/generation`,
        {
          model: 'qwen-vl-max',
          input: {
            messages: [
              {
                role: 'user',
                content,
              },
            ],
          },
          parameters: {
            result_format: 'message',
          },
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
          timeout: 60000, // 图片分析可能需要更长时间
        },
      );

      if (response.data?.output?.choices?.[0]?.message?.content) {
        const result = response.data.output.choices[0].message.content;
        // 如果返回的是数组格式，提取文本
        if (Array.isArray(result)) {
          return result.find((item: any) => item.type === 'text')?.text || '';
        }
        return result;
      }
      return '';
    } catch (error) {
      this.logger.error('图片分析失败', error);
      return '';
    }
  }

  // 生成匹配原因
  async generateMatchReason(
    userContent: string,
    passageContent: string,
    authorName: string,
    workTitle: string,
  ): Promise<string> {
    const prompt = `你是一个文学评论专家。请解释为什么以下文学段落与用户的日记产生了共鸣。

用户日记：
"""
${userContent}
"""

匹配的文学段落：
"""
${passageContent}
"""
作者：${authorName}
作品：${workTitle}

请用温暖、富有诗意的语言，写一段50-100字的匹配原因说明，解释两者之间的情感共鸣点。
不要使用"你"开头，使用第三人称或直接描述共鸣点。只返回说明文字，不要有其他内容。`;

    try {
      return await this.callQwen(prompt);
    } catch (error) {
      this.logger.error('生成匹配原因失败', error);
      return '这段文字与你的心情产生了深深的共鸣。';
    }
  }

  // 生成文本向量嵌入
  async generateEmbedding(text: string): Promise<number[]> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/services/embeddings/text-embedding/text-embedding`,
        {
          model: 'text-embedding-v3',
          input: { texts: [text] },
          parameters: { dimension: 1024 },
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (response.data?.output?.embeddings?.[0]?.embedding) {
        return response.data.output.embeddings[0].embedding;
      }
      throw new Error('无法获取向量嵌入');
    } catch (error) {
      this.logger.error('生成向量嵌入失败', error);
      // 返回空向量
      return new Array(1024).fill(0);
    }
  }

  // 调用通义千问（带重试机制）
  private async callQwen(prompt: string, maxRetries = 3): Promise<string> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const response = await axios.post(
          `${this.baseUrl}/services/aigc/text-generation/generation`,
          {
            model: 'qwen-max',
            input: {
              messages: [
                {
                  role: 'user',
                  content: prompt,
                },
              ],
            },
            parameters: {
              result_format: 'message',
              temperature: 0.7,
            },
          },
          {
            headers: {
              Authorization: `Bearer ${this.apiKey}`,
              'Content-Type': 'application/json',
            },
            timeout: 30000, // 30秒超时
          },
        );

        if (response.data?.output?.choices?.[0]?.message?.content) {
          return response.data.output.choices[0].message.content;
        }
        throw new Error('AI响应格式错误');
      } catch (error) {
        lastError = error as Error;
        this.logger.warn(`AI 调用失败 (尝试 ${attempt}/${maxRetries}): ${lastError.message}`);

        if (attempt < maxRetries) {
          // 指数退避：1秒、2秒、4秒...
          const delay = Math.pow(2, attempt - 1) * 1000;
          await this.sleep(delay);
        }
      }
    }

    throw lastError || new Error('AI调用失败');
  }

  // 延迟函数
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // 默认分析结果
  private getDefaultAnalysis(): EmotionAnalysisResult {
    return {
      emotions: [{ name: '平静', score: 0.5 }],
      primaryEmotion: '平静',
      emotionIntensity: 0.5,
      keywords: [],
      imagery: [],
      scenes: [],
      themes: [],
      weatherType: '多云',
      psychologicalInsight: '每一次记录都是与自己对话的机会。',
    };
  }
}
