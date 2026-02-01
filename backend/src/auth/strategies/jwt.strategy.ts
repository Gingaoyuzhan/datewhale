import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    const secret = configService.get('JWT_SECRET', 'default_secret');
    // 调试日志：输出 JWT_SECRET 的前 15 个字符
    console.log('[JwtStrategy] JWT_SECRET:', secret ? secret.substring(0, 15) + '...' : 'NOT SET');

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(payload: any) {
    console.log('[JwtStrategy] Token 验证成功, userId:', payload.sub);
    return { userId: payload.sub, username: payload.username };
  }
}
