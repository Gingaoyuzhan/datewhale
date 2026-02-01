import { Request } from 'express';

// JWT 用户信息接口
export interface JwtPayload {
  sub: number;
  username: string;
  iat?: number;
  exp?: number;
}

// 认证后的请求接口
export interface AuthenticatedRequest extends Request {
  user: {
    userId: number;
    username: string;
  };
}
