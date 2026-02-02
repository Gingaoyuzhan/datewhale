import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

// 生产环境的 JWT_SECRET（硬编码确保一致性）
const PRODUCTION_JWT_SECRET = 'xinling_diary_jwt_secret_2026';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    // 打印所有可能的 JWT_SECRET 来源
    const envSecret = process.env.JWT_SECRET;
    const configSecret = configService.get('JWT_SECRET');
    const finalSecret = configSecret || envSecret || PRODUCTION_JWT_SECRET;

    console.log('[JwtStrategy] ========== JWT 配置调试 ==========');
    console.log('[JwtStrategy] process.env.JWT_SECRET:', envSecret ? `${envSecret.substring(0, 15)}...` : 'undefined');
    console.log('[JwtStrategy] configService.get:', configSecret ? `${configSecret.substring(0, 15)}...` : 'undefined');
    console.log('[JwtStrategy] 最终使用的 secret:', finalSecret.substring(0, 15) + '...');
    console.log('[JwtStrategy] =====================================');

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: finalSecret,
    });
  }

  async validate(payload: any) {
    console.log('[JwtStrategy] Token 验证成功, userId:', payload.sub);
    return { userId: payload.sub, username: payload.username };
  }
}
