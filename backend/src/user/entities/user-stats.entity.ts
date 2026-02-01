import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('user_stats')
export class UserStats {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @OneToOne(() => User, (user) => user.stats)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'total_entries', default: 0 })
  totalEntries: number;

  @Column({ name: 'total_words', default: 0 })
  totalWords: number;

  @Column({ name: 'streak_days', default: 0 })
  streakDays: number;

  @Column({ name: 'max_streak_days', default: 0 })
  maxStreakDays: number;

  @Column({ name: 'last_entry_date', type: 'text', nullable: true })
  lastEntryDate: string;

  @Column({ name: 'authors_collected', default: 0 })
  authorsCollected: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
