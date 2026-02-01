import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Entry } from '../entry/entities/entry.entity';
import { UserService } from '../user/user.service';

@Injectable()
export class StatsService {
  private readonly logger = new Logger(StatsService.name);

  constructor(
    @InjectRepository(Entry)
    private entryRepository: Repository<Entry>,
    private userService: UserService,
  ) {}

  // 获取用户统计概览
  async getOverview(userId: number) {
    const stats = await this.userService.getUserStats(userId);
    const totalEntries = await this.entryRepository.count({
      where: { userId },
    });

    return {
      totalEntries,
      totalWords: stats?.totalWords || 0,
      streakDays: stats?.streakDays || 0,
      maxStreakDays: stats?.maxStreakDays || 0,
      authorsCollected: stats?.authorsCollected || 0,
    };
  }

  // 获取情绪曲线数据（近30天）
  async getEmotionCurve(userId: number, days = 30) {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const entries = await this.entryRepository.find({
      where: {
        userId,
        createdAt: Between(startDate, endDate),
      },
      order: { createdAt: 'ASC' },
      select: [
        'id',
        'emotionPrimary',
        'emotionIntensity',
        'weatherType',
        'createdAt',
      ],
    });

    // 按日期分组
    const dailyData = new Map<string, any[]>();
    entries.forEach((entry) => {
      const dateKey = entry.createdAt.toISOString().split('T')[0];
      if (!dailyData.has(dateKey)) {
        dailyData.set(dateKey, []);
      }
      dailyData.get(dateKey)!.push({
        emotion: entry.emotionPrimary,
        intensity: entry.emotionIntensity,
        weather: entry.weatherType,
      });
    });

    // 转换为数组格式
    const curve = Array.from(dailyData.entries()).map(([date, data]) => {
      // 计算当天平均情绪强度
      const avgIntensity =
        data.reduce((sum, d) => sum + (d.intensity || 0), 0) / data.length;
      // 取最常见的情绪
      const emotionCounts = data.reduce((acc, d) => {
        acc[d.emotion] = (acc[d.emotion] || 0) + 1;
        return acc;
      }, {});
      const primaryEmotion = Object.entries(emotionCounts).sort(
        (a: any, b: any) => b[1] - a[1],
      )[0]?.[0];

      return {
        date,
        emotion: primaryEmotion,
        intensity: avgIntensity,
        entryCount: data.length,
      };
    });

    return curve;
  }

  // 获取时光轴数据
  async getTimeline(userId: number, page = 1, limit = 20) {
    const [entries, total] = await this.entryRepository.findAndCount({
      where: { userId },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
      select: [
        'id',
        'content',
        'emotionPrimary',
        'weatherType',
        'keywords',
        'createdAt',
      ],
    });

    const timeline = entries.map((entry) => ({
      id: entry.id,
      date: entry.createdAt,
      emotion: entry.emotionPrimary,
      weather: entry.weatherType,
      keywords: entry.keywords?.slice(0, 3) || [],
      preview: entry.content.substring(0, 100) + (entry.content.length > 100 ? '...' : ''),
    }));

    return {
      timeline,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
