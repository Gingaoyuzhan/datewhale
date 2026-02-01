import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Entry } from './entities/entry.entity';
import { Match } from './entities/match.entity';
import { CreateEntryDto } from './dto/create-entry.dto';
import { AiService, EmotionAnalysisResult } from '../ai/ai.service';
import { LiteratureService } from '../literature/literature.service';
import { GardenService } from '../garden/garden.service';
import { Passage } from '../literature/entities/passage.entity';

interface MatchResult {
  passage: Passage;
  score: number;
  emotionSimilarity: number;
  keywordOverlap: number;
  imageryMatch: number;
}

@Injectable()
export class EntryService {
  private readonly logger = new Logger(EntryService.name);

  constructor(
    @InjectRepository(Entry)
    private entryRepository: Repository<Entry>,
    @InjectRepository(Match)
    private matchRepository: Repository<Match>,
    private aiService: AiService,
    private literatureService: LiteratureService,
    private gardenService: GardenService,
  ) {}

  // 创建日记并获取匹配结果
  async createEntry(userId: number, createEntryDto: CreateEntryDto) {
    const { content, emotionPrimary, emotionSecondary, images } = createEntryDto;

    // 1. AI情感分析（包含图片分析）
    this.logger.log('开始情感分析...');
    const analysis = await this.aiService.analyzeEmotion(content, images);

    // 2. 创建日记记录
    const entry = this.entryRepository.create({
      userId,
      content,
      emotionPrimary: emotionPrimary || analysis.primaryEmotion,
      emotionSecondary: emotionSecondary || analysis.emotions.map((e) => e.name),
      emotionIntensity: analysis.emotionIntensity,
      keywords: analysis.keywords,
      imagery: analysis.imagery,
      scenes: analysis.scenes,
      themes: analysis.themes,
      weatherType: analysis.weatherType,
      psychologicalInsight: analysis.psychologicalInsight,
    });
    const savedEntry = await this.entryRepository.save(entry);

    // 3. 匹配文学段落
    this.logger.log('开始匹配文学段落...');
    const matchResults = await this.matchPassages(analysis);

    // 4. 保存匹配结果并生成匹配原因
    const matches = await this.saveMatches(savedEntry, matchResults, content);

    // 5. 更新花园（植物成长）
    const gardenUpdates = await this.updateGarden(userId, matchResults);

    return {
      entry: savedEntry,
      analysis: {
        emotions: analysis.emotions,
        keywords: analysis.keywords,
        imagery: analysis.imagery,
        scenes: analysis.scenes,
        psychologicalInsight: analysis.psychologicalInsight,
      },
      matches,
      gardenUpdates,
    };
  }

  // 匹配文学段落
  private async matchPassages(
    analysis: EmotionAnalysisResult,
  ): Promise<MatchResult[]> {
    // 获取所有段落
    const passages = await this.literatureService.getAllPassages();
    if (!passages.length) {
      this.logger.warn('文学库为空，无法匹配');
      return [];
    }

    // 计算每个段落的匹配分数
    const scoredPassages = passages.map((passage) => {
      const emotionSimilarity = this.calculateEmotionSimilarity(
        analysis.emotions.map((e) => e.name),
        passage.emotionTags || [],
      );
      const keywordOverlap = this.calculateOverlap(
        analysis.keywords,
        [...(passage.emotionTags || []), ...(passage.themeTags || [])],
      );
      const imageryMatch = this.calculateOverlap(
        analysis.imagery,
        passage.imageryTags || [],
      );
      const sceneMatch = this.calculateOverlap(
        analysis.scenes,
        passage.sceneTags || [],
      );

      // 综合得分
      const score =
        emotionSimilarity * 0.4 +
        keywordOverlap * 0.3 +
        imageryMatch * 0.2 +
        sceneMatch * 0.1;

      return {
        passage,
        score,
        emotionSimilarity,
        keywordOverlap,
        imageryMatch,
      };
    });

    // 排序并返回Top 3
    return scoredPassages
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  }

  // 计算情感相似度
  private calculateEmotionSimilarity(
    userEmotions: string[],
    passageEmotions: string[],
  ): number {
    if (!userEmotions.length || !passageEmotions.length) return 0;
    const intersection = userEmotions.filter((e) =>
      passageEmotions.includes(e),
    );
    return intersection.length / Math.max(userEmotions.length, 1);
  }

  // 计算重合度
  private calculateOverlap(arr1: string[], arr2: string[]): number {
    if (!arr1?.length || !arr2?.length) return 0;
    const set2 = new Set(arr2.map((s) => s.toLowerCase()));
    const intersection = arr1.filter((item) =>
      set2.has(item.toLowerCase()),
    );
    return intersection.length / Math.max(arr1.length, 1);
  }

  // 保存匹配结果
  private async saveMatches(
    entry: Entry,
    matchResults: MatchResult[],
    userContent: string,
  ): Promise<any[]> {
    const matches: any[] = [];

    for (let i = 0; i < matchResults.length; i++) {
      const result = matchResults[i];
      const passage = result.passage;

      // 生成匹配原因
      const matchReason = await this.aiService.generateMatchReason(
        userContent,
        passage.content,
        passage.author?.name || '佚名',
        passage.work?.title || '未知作品',
      );

      const match = this.matchRepository.create({
        entryId: entry.id,
        passageId: passage.id,
        matchScore: result.score,
        matchReason,
        emotionSimilarity: result.emotionSimilarity,
        keywordOverlap: result.keywordOverlap,
        imageryMatch: result.imageryMatch,
        rank: i + 1,
      });
      const savedMatch = await this.matchRepository.save(match);

      matches.push({
        rank: i + 1,
        passage: {
          id: passage.id,
          content: passage.content,
          author: passage.author
            ? {
                id: passage.author.id,
                name: passage.author.name,
                avatar: passage.author.avatar,
                plantType: passage.author.plantType,
              }
            : null,
          work: passage.work
            ? {
                id: passage.work.id,
                title: passage.work.title,
              }
            : null,
        },
        matchScore: result.score,
        matchReason,
      });
    }

    return matches;
  }

  // 更新花园
  private async updateGarden(userId: number, matchResults: MatchResult[]): Promise<any[]> {
    const updates: any[] = [];

    for (const result of matchResults) {
      if (result.passage.author) {
        const update = await this.gardenService.updatePlant(
          userId,
          result.passage.author.id,
        );
        if (update) {
          updates.push({
            authorId: result.passage.author.id,
            authorName: result.passage.author.name,
            plantType: result.passage.author.plantType,
            previousStage: update.previousStage,
            currentStage: update.currentStage,
            isNewPlant: update.isNewPlant,
          });
        }
      }
    }

    return updates;
  }

  // 获取用户日记列表
  async getUserEntries(userId: number, page = 1, limit = 20) {
    const [entries, total] = await this.entryRepository.findAndCount({
      where: { userId },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
      relations: ['matches', 'matches.passage', 'matches.passage.author'],
    });

    return {
      entries,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // 获取日记详情
  async getEntryById(id: number, userId: number) {
    return this.entryRepository.findOne({
      where: { id, userId },
      relations: [
        'matches',
        'matches.passage',
        'matches.passage.author',
        'matches.passage.work',
      ],
    });
  }

  // 删除日记
  async deleteEntry(id: number, userId: number): Promise<boolean> {
    const result = await this.entryRepository.delete({ id, userId });
    return (result.affected ?? 0) > 0;
  }
}
