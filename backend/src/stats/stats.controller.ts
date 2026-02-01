import { Controller, Get, Query, UseGuards, Req } from '@nestjs/common';
import * as express from 'express';
import { StatsService } from './stats.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiResponse } from '../common/dto/api-response.dto';

// 认证请求接口
interface AuthRequest extends express.Request {
  user: { userId: number; username: string };
}

@Controller('stats')
@UseGuards(JwtAuthGuard)
export class StatsController {
  constructor(private statsService: StatsService) { }

  @Get('overview')
  async getOverview(@Req() req: express.Request) {
    const authReq = req as AuthRequest;
    const overview = await this.statsService.getOverview(authReq.user.userId);
    return ApiResponse.success(overview);
  }

  @Get('emotion-curve')
  async getEmotionCurve(
    @Req() req: express.Request,
    @Query('days') days = 30,
  ) {
    const authReq = req as AuthRequest;
    const curve = await this.statsService.getEmotionCurve(
      authReq.user.userId,
      +days,
    );
    return ApiResponse.success(curve);
  }

  @Get('timeline')
  async getTimeline(
    @Req() req: express.Request,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    const authReq = req as AuthRequest;
    const timeline = await this.statsService.getTimeline(
      authReq.user.userId,
      +page,
      +limit,
    );
    return ApiResponse.success(timeline);
  }
}
