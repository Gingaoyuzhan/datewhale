import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { UserModule } from '../user/user.module';

// 生产环境的 JWT_SECRET（硬编码确保一致性）
const PRODUCTION_JWT_SECRET = 'xinling_diary_jwt_secret_2026';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        // 优先使用环境变量，否则使用硬编码的值
        const secret = configService.get('JWT_SECRET') || PRODUCTION_JWT_SECRET;
        console.log('[JwtModule] 签名用 JWT_SECRET:', secret.substring(0, 15) + '...');
        return {
          secret,
          signOptions: {
            expiresIn: configService.get('JWT_EXPIRES_IN', '7d'),
          },
        };
      },
    }),
  ],
  providers: [AuthService, JwtStrategy, LocalStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
