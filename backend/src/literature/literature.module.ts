import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Author } from './entities/author.entity';
import { Work } from './entities/work.entity';
import { Passage } from './entities/passage.entity';
import { LiteratureService } from './literature.service';
import { LiteratureController } from './literature.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Author, Work, Passage])],
  providers: [LiteratureService],
  controllers: [LiteratureController],
  exports: [LiteratureService],
})
export class LiteratureModule {}
