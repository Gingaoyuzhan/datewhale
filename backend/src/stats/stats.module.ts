import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Entry } from '../entry/entities/entry.entity';
import { StatsService } from './stats.service';
import { StatsController } from './stats.controller';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Entry]), UserModule],
  providers: [StatsService],
  controllers: [StatsController],
  exports: [StatsService],
})
export class StatsModule {}
