import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { UserStats } from './entities/user-stats.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(UserStats)
    private userStatsRepository: Repository<UserStats>,
  ) {}

  async findByUsername(username: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { username } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findById(id: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { id } });
  }

  async create(userData: Partial<User>): Promise<User> {
    const user = this.userRepository.create(userData);
    const savedUser = await this.userRepository.save(user);

    // 创建用户统计记录
    const stats = this.userStatsRepository.create({ userId: savedUser.id });
    await this.userStatsRepository.save(stats);

    return savedUser;
  }

  async getUserStats(userId: number): Promise<UserStats | null> {
    return this.userStatsRepository.findOne({ where: { userId } });
  }

  async updateStats(
    userId: number,
    updates: Partial<UserStats>,
  ): Promise<UserStats | null> {
    await this.userStatsRepository.update({ userId }, updates);
    return this.userStatsRepository.findOne({ where: { userId } });
  }
}
