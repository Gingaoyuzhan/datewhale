import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
  ParseIntPipe,
} from '@nestjs/common';
import * as express from 'express';
import { EntryService } from './entry.service';
import { CreateEntryDto } from './dto/create-entry.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiResponse } from '../common/dto/api-response.dto';

// 扩展 Request 类型
interface AuthRequest extends express.Request {
  user: { userId: number; username: string };
}

@Controller('entries')
@UseGuards(JwtAuthGuard)
export class EntryController {
  constructor(private entryService: EntryService) { }

  @Post()
  async createEntry(@Req() req: express.Request, @Body() createEntryDto: CreateEntryDto) {
    const authReq = req as AuthRequest;
    const result = await this.entryService.createEntry(
      authReq.user.userId,
      createEntryDto,
    );
    return ApiResponse.success(result, '记录成功');
  }

  @Get()
  async getUserEntries(
    @Req() req: express.Request,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    const authReq = req as AuthRequest;
    const result = await this.entryService.getUserEntries(
      authReq.user.userId,
      +page,
      +limit,
    );
    return ApiResponse.success(result);
  }

  @Get(':id')
  async getEntryById(
    @Req() req: express.Request,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const authReq = req as AuthRequest;
    const entry = await this.entryService.getEntryById(id, authReq.user.userId);
    if (!entry) {
      return ApiResponse.notFound('日记不存在');
    }
    return ApiResponse.success(entry);
  }

  @Delete(':id')
  async deleteEntry(
    @Req() req: express.Request,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const authReq = req as AuthRequest;
    const success = await this.entryService.deleteEntry(id, authReq.user.userId);
    if (!success) {
      return ApiResponse.notFound('日记不存在');
    }
    return ApiResponse.success(null, '删除成功');
  }
}
