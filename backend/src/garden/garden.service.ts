import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Garden } from './entities/garden.entity';

interface PlantUpdateResult {
  previousStage: number;
  currentStage: number;
  isNewPlant: boolean;
}

@Injectable()
export class GardenService {
  private readonly logger = new Logger(GardenService.name);

  // 植物成长阶段规则
  private readonly stageThresholds = [1, 2, 5, 10]; // 匹配次数阈值

  constructor(
    @InjectRepository(Garden)
    private gardenRepository: Repository<Garden>,
  ) {}

  // 获取用户花园
  async getUserGarden(userId: number): Promise<Garden[]> {
    return this.gardenRepository.find({
      where: { userId },
      relations: ['author'],
      order: { matchCount: 'DESC' },
    });
  }

  // 更新植物（匹配后调用）
  async updatePlant(
    userId: number,
    authorId: number,
  ): Promise<PlantUpdateResult | null> {
    // 查找现有记录
    let garden = await this.gardenRepository.findOne({
      where: { userId, authorId },
    });

    const isNewPlant = !garden;
    let previousStage = 1;

    if (garden) {
      previousStage = garden.plantStage;
      garden.matchCount += 1;
      garden.lastMatchAt = new Date();
      garden.plantStage = this.calculateStage(garden.matchCount);
    } else {
      // 创建新植物
      garden = this.gardenRepository.create({
        userId,
        authorId,
        matchCount: 1,
        plantStage: 1,
        lastMatchAt: new Date(),
      });
    }

    await this.gardenRepository.save(garden);

    return {
      previousStage,
      currentStage: garden.plantStage,
      isNewPlant,
    };
  }

  // 计算成长阶段
  private calculateStage(matchCount: number): number {
    for (let i = this.stageThresholds.length - 1; i >= 0; i--) {
      if (matchCount >= this.stageThresholds[i]) {
        return i + 1;
      }
    }
    return 1;
  }

  // 获取用户收集的作家数量
  async getCollectedAuthorsCount(userId: number): Promise<number> {
    return this.gardenRepository.count({ where: { userId } });
  }
}
