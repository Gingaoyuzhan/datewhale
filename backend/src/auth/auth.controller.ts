import { Controller, Post, Body, Get, UseGuards, Req, HttpException, HttpStatus } from '@nestjs/common';
import * as express from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ApiResponse } from '../common/dto/api-response.dto';

// 扩展 Request 类型
interface AuthRequest extends express.Request {
  user: { userId: number; username: string };
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    try {
      const result = await this.authService.register(registerDto);
      return ApiResponse.success(result, '注册成功');
    } catch (error) {
      console.error('Register Error:', error);
      throw new HttpException((error as Error).message || '注册失败', HttpStatus.BAD_REQUEST);
    }
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    try {
      const result = await this.authService.login(loginDto);
      return ApiResponse.success(result, '登录成功');
    } catch (error) {
      console.error('Login Error:', error);
      throw new HttpException((error as Error).message || '登录失败', HttpStatus.BAD_REQUEST);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Req() req: express.Request) {
    try {
      const authReq = req as AuthRequest;
      const user = await this.authService.getProfile(authReq.user.userId);
      return ApiResponse.success(user);
    } catch (error) {
      throw new HttpException((error as Error).message || '获取个人信息失败', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
