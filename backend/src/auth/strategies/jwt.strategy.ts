import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

// 生产环境的 JWT_SECRET（硬编码确保一致性）
const PRODUCTION_JWT_SECRET = 'xinling_diary_jwt_secret_2026';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    // 优先使用环境变量，否则使用硬编码的值
    const secret = configService.get('JWT_SECRET') || PRODUCTION_JWT_SECRET;
    console.log('[JwtStrategy] JWT_SECRET:', secret.substring(0, 15) + '...');

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
