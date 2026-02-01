import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Entry } from './entry.entity';
import { Passage } from '../../literature/entities/passage.entity';

@Entity('matches')
export class Match {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'entry_id' })
  entryId: number;

  @ManyToOne(() => Entry, (entry) => entry.matches)
  @JoinColumn({ name: 'entry_id' })
  entry: Entry;

  @Column({ name: 'passage_id' })
  passageId: number;

  @ManyToOne(() => Passage, (passage) => passage.matches)
  @JoinColumn({ name: 'passage_id' })
  passage: Passage;

  @Column({
    name: 'match_score',
    type: 'real',
    nullable: true,
  })
  matchScore: number;

  @Column({ name: 'match_reason', type: 'text', nullable: true })
  matchReason: string;

  @Column({
    name: 'emotion_similarity',
    type: 'real',
    nullable: true,
  })
  emotionSimilarity: number;

  @Column({
    name: 'keyword_overlap',
    type: 'real',
    nullable: true,
  })
  keywordOverlap: number;

  @Column({
    name: 'imagery_match',
    type: 'real',
    nullable: true,
  })
  imageryMatch: number;

  @Column({ default: 1 })
  rank: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
