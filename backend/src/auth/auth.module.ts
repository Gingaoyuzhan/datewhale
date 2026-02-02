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
        // 打印所有可能的 JWT_SECRET 来源
        const envSecret = process.env.JWT_SECRET;
        const configSecret = configService.get('JWT_SECRET');
        const finalSecret = configSecret || envSecret || PRODUCTION_JWT_SECRET;

        console.log('[JwtModule] ========== JWT 签名配置调试 ==========');
        console.log('[JwtModule] process.env.JWT_SECRET:', envSecret ? `${envSecret.substring(0, 15)}...` : 'undefined');
        console.log('[JwtModule] configService.get:', configSecret ? `${configSecret.substring(0, 15)}...` : 'undefined');
        console.log('[JwtModule] 最终使用的 secret:', finalSecret.substring(0, 15) + '...');
        console.log('[JwtModule] =====================================');

        return {
          secret: finalSecret,
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
