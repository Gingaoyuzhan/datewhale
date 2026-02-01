import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Entry } from './entities/entry.entity';
import { Match } from './entities/match.entity';
import { EntryService } from './entry.service';
import { EntryController } from './entry.controller';
import { AiModule } from '../ai/ai.module';
import { LiteratureModule } from '../literature/literature.module';
import { GardenModule } from '../garden/garden.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Entry, Match]),
    AiModule,
    LiteratureModule,
    GardenModule,
  ],
  providers: [EntryService],
  controllers: [EntryController],
  exports: [EntryService],
})
export class EntryModule {}
