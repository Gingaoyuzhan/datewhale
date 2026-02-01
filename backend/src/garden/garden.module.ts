import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Garden } from './entities/garden.entity';
import { GardenService } from './garden.service';
import { GardenController } from './garden.controller';
import { LiteratureModule } from '../literature/literature.module';

@Module({
  imports: [TypeOrmModule.forFeature([Garden]), forwardRef(() => LiteratureModule)],
  providers: [GardenService],
  controllers: [GardenController],
  exports: [GardenService],
})
export class GardenModule {}
