import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Author } from '../../literature/entities/author.entity';

@Entity('gardens')
@Unique(['userId', 'authorId'])
export class Garden {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @ManyToOne(() => User, (user) => user.gardens)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'author_id' })
  authorId: number;

  @ManyToOne(() => Author, (author) => author.gardens)
  @JoinColumn({ name: 'author_id' })
  author: Author;

  @Column({ name: 'plant_stage', default: 1 })
  plantStage: number; // 成长阶段 1-4

  @Column({ name: 'match_count', default: 1 })
  matchCount: number;

  @Column({ name: 'last_match_at', type: 'datetime', nullable: true })
  lastMatchAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
