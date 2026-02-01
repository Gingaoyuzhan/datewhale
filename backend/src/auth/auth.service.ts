import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.userService.findByUsername(username);
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }

  async register(registerDto: RegisterDto) {
    const { username, email, password, nickname } = registerDto;

    // 检查用户名是否已存在
    const existingUsername = await this.userService.findByUsername(username);
    if (existingUsername) {
      throw new UnauthorizedException('用户名已存在');
    }

    // 检查邮箱是否已存在
    const existingEmail = await this.userService.findByEmail(email);
    if (existingEmail) {
      throw new UnauthorizedException('邮箱已被注册');
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10);

    // 创建用户
    const user = await this.userService.create({
      username,
      email,
      password: hashedPassword,
      nickname: nickname || username,
    });

    // 生成token
    const token = this.generateToken(user);

    return {
      user: this.sanitizeUser(user),
      token,
    };
  }

  async login(loginDto: LoginDto) {
    const { username, password } = loginDto;

    const user = await this.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException('用户名或密码错误');
    }

    const token = this.generateToken(user);

    return {
      user: this.sanitizeUser(user),
      token,
    };
  }

  async getProfile(userId: number) {
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('用户不存在');
    }
    return this.sanitizeUser(user);
  }

  private generateToken(user: User): string {
    const payload = { sub: user.id, username: user.username };
    return this.jwtService.sign(payload);
  }

  private sanitizeUser(user: User) {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      nickname: user.nickname,
      avatar: user.avatar,
      createdAt: user.createdAt,
    };
  }
}
