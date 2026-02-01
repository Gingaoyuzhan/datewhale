import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Author } from './author.entity';
import { Passage } from './passage.entity';

@Entity('works')
export class Work {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'author_id' })
  authorId: number;

  @ManyToOne(() => Author, (author) => author.works)
  @JoinColumn({ name: 'author_id' })
  author: Author;

  @Column({ length: 200 })
  title: string;

  @Column({ length: 50, nullable: true })
  type: string; // 诗词/散文/小说/戏剧

  @Column({ length: 50, nullable: true })
  era: string; // 创作年代

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => Passage, (passage) => passage.work)
  passages: Passage[];
}
