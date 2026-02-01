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
import { Work } from './work.entity';
import { Match } from '../../entry/entities/match.entity';

@Entity('passages')
export class Passage {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'work_id', nullable: true })
  workId: number;

  @ManyToOne(() => Work, (work) => work.passages)
  @JoinColumn({ name: 'work_id' })
  work: Work;

  @Column({ name: 'author_id' })
  authorId: number;

  @ManyToOne(() => Author, (author) => author.passages)
  @JoinColumn({ name: 'author_id' })
  author: Author;

  @Column({ type: 'text' })
  content: string;

  @Column({ name: 'content_length', nullable: true })
  contentLength: number;

  @Column({ name: 'emotion_tags', type: 'simple-json', nullable: true })
  emotionTags: string[];

  @Column({ name: 'imagery_tags', type: 'simple-json', nullable: true })
  imageryTags: string[];

  @Column({ name: 'scene_tags', type: 'simple-json', nullable: true })
  sceneTags: string[];

  @Column({ name: 'theme_tags', type: 'simple-json', nullable: true })
  themeTags: string[];

  // 向量嵌入 - 使用text类型存储，查询时转换
  @Column({ type: 'text', nullable: true })
  embedding: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => Match, (match) => match.passage)
  matches: Match[];
}
