import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Work } from './work.entity';
import { Passage } from './passage.entity';
import { Garden } from '../../garden/entities/garden.entity';

@Entity('authors')
export class Author {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ name: 'name_en', length: 100, nullable: true })
  nameEn: string;

  @Column({ length: 50, nullable: true })
  era: string; // 古代/近现代/当代/外国

  @Column({ length: 50, nullable: true })
  nationality: string;

  @Column({ name: 'style_tags', type: 'simple-json', nullable: true })
  styleTags: string[];

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column({ length: 500, nullable: true })
  avatar: string;

  // 植物映射
  @Column({ name: 'plant_type', length: 50, nullable: true })
  plantType: string;

  @Column({ name: 'plant_symbol', length: 200, nullable: true })
  plantSymbol: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => Work, (work) => work.author)
  works: Work[];

  @OneToMany(() => Passage, (passage) => passage.author)
  passages: Passage[];

  @OneToMany(() => Garden, (garden) => garden.author)
  gardens: Garden[];
}
