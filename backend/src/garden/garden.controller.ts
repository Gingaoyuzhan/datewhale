import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import * as express from 'express';
import { GardenService } from './garden.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiResponse } from '../common/dto/api-response.dto';

// 扩展 Request 类型
interface AuthRequest extends express.Request {
  user: { userId: number; username: string };
}

@Controller('garden')
@UseGuards(JwtAuthGuard)
export class GardenController {
  constructor(private gardenService: GardenService) { }

  @Get()
  async getUserGarden(@Req() req: express.Request) {
    const authReq = req as AuthRequest;
    const garden = await this.gardenService.getUserGarden(authReq.user.userId);
    return ApiResponse.success(garden);
  }

  @Get('plants')
  async getPlants(@Req() req: express.Request) {
    const authReq = req as AuthRequest;
    const garden = await this.gardenService.getUserGarden(authReq.user.userId);
    // 转换为植物列表格式
    const plants = garden.map((g) => ({
      authorId: g.authorId,
      authorName: g.author?.name,
      plantType: g.author?.plantType,
      plantSymbol: g.author?.plantSymbol,
      stage: g.plantStage,
      matchCount: g.matchCount,
      lastMatchAt: g.lastMatchAt,
    }));
    return ApiResponse.success(plants);
  }
}
