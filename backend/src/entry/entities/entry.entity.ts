import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Match } from './match.entity';

@Entity('entries')
export class Entry {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @ManyToOne(() => User, (user) => user.entries)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'text' })
  content: string;

  @Column({ name: 'emotion_primary', length: 50, nullable: true })
  emotionPrimary: string;

  @Column({ name: 'emotion_secondary', type: 'simple-json', nullable: true })
  emotionSecondary: string[];

  @Column({
    name: 'emotion_intensity',
    type: 'real',
    nullable: true,
  })
  emotionIntensity: number;

  @Column({ type: 'simple-json', nullable: true })
  keywords: string[];

  @Column({ type: 'simple-json', nullable: true })
  imagery: string[];

  @Column({ type: 'simple-json', nullable: true })
  scenes: string[];

  @Column({ type: 'simple-json', nullable: true })
  themes: string[];

  @Column({ name: 'weather_type', length: 50, nullable: true })
  weatherType: string;

  @Column({ name: 'psychological_insight', type: 'text', nullable: true })
  psychologicalInsight: string;

  // 向量嵌入
  @Column({ type: 'text', nullable: true })
  embedding: string;

  @Column({ name: 'image_url', type: 'text', nullable: true })
  imageUrl: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => Match, (match) => match.entry)
  matches: Match[];
}
