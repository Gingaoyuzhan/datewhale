import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Entry } from '../../entry/entities/entry.entity';
import { Garden } from '../../garden/entities/garden.entity';
import { UserStats } from './user-stats.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50, unique: true })
  username: string;

  @Column({ length: 100, unique: true })
  email: string;

  @Column({ length: 255 })
  password: string;

  @Column({ length: 500, nullable: true })
  avatar: string;

  @Column({ length: 100, nullable: true })
  nickname: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => Entry, (entry) => entry.user)
  entries: Entry[];

  @OneToMany(() => Garden, (garden) => garden.user)
  gardens: Garden[];

  @OneToOne(() => UserStats, (stats) => stats.user)
  stats: UserStats;
}
