import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { EntryModule } from './entry/entry.module';
import { LiteratureModule } from './literature/literature.module';
import { GardenModule } from './garden/garden.module';
import { AiModule } from './ai/ai.module';
import { StatsModule } from './stats/stats.module';

@Module({
  imports: [
    // 配置模块
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    // 数据库配置 - 支持 PostgreSQL 和 SQLite
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const dbType = configService.get('DB_TYPE', 'postgres');

        // SQLite 配置（用于 ModelScope 部署）- 使用 sql.js
        if (dbType === 'sqlite') {
          return {
            type: 'sqljs',
            location: configService.get('DB_PATH', '/home/node/app/data/xinling_diary.db'),
            autoSave: true,
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize: true,
            logging: configService.get('NODE_ENV') === 'development',
          };
        }

        // PostgreSQL 配置（本地开发）
        return {
          type: 'postgres',
          host: configService.get('DB_HOST', 'localhost'),
          port: configService.get('DB_PORT', 5432),
          username: configService.get('DB_USERNAME', 'postgres'),
          password: configService.get('DB_PASSWORD', ''),
          database: configService.get('DB_DATABASE', 'xinling_diary'),
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: true,
          logging: configService.get('NODE_ENV') === 'development',
        };
      },
    }),
    // 业务模块
    AuthModule,
    UserModule,
    EntryModule,
    LiteratureModule,
    GardenModule,
    AiModule,
    StatsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
