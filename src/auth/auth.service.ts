import {
  Injectable,
  // UnauthorizedException,
  // ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
// import * as bcrypt from 'bcrypt';

export interface LoginDto {
  username: string;
  password: string;
}

export interface RegisterDto {
  username: string;
  password: string;
  avatar?: string;
  bio?: string;
}

export interface AuthResponse {
  access_token: string;
  user: {
    id: number;
    username: string;
    avatar?: string;
    bio?: string;
  };
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  // async validateUser(username: string, password: string): Promise<any> {
  //   const user = await this.usersService.findByUsername(username);
  //   if (user && (await bcrypt.compare(password, user.password))) {
  //     const { password: _, ...result } = user;
  //     return result;
  //   }
  //   return null;
  // }

  // async login(loginDto: LoginDto): Promise<AuthResponse> {
  //   const user = await this.validateUser(loginDto.username, loginDto.password);
  //   if (!user) {
  //     throw new UnauthorizedException('用户名或密码错误');
  //   }

  //   const payload = {
  //     username: user.username,
  //     sub: user.id,
  //   };

  //   return {
  //     access_token: this.jwtService.sign(payload),
  //     user: {
  //       id: user.id,
  //       username: user.username,
  //       avatar: user.avatar,
  //       bio: user.bio,
  //     },
  //   };
  // }

  // async register(registerDto: RegisterDto): Promise<AuthResponse> {
  //   // 检查用户名是否已存在
  //   const existingUser = await this.usersService.findByUsername(
  //     registerDto.username,
  //   );
  //   if (existingUser) {
  //     throw new ConflictException('用户名已被注册');
  //   }

  //   // 加密密码
  //   const hashedPassword = await bcrypt.hash(registerDto.password, 10);

  //   // 创建用户
  //   const user = await this.usersService.create({
  //     ...registerDto,
  //     password: hashedPassword,
  //   });

  //   // 生成JWT token
  //   const payload = {
  //     username: user.username,
  //     sub: user.id,
  //   };

  //   return {
  //     access_token: this.jwtService.sign(payload),
  //     user: {
  //       id: user.id,
  //       // email: user.email,
  //       username: user.username,
  //       avatar: user.avatar,
  //       bio: user.bio,
  //     },
  //   };
  // }

  // async refreshToken(user: any): Promise<{ access_token: string }> {
  //   const payload = {
  //     username: user.username,
  //     sub: user.id,
  //     email: user.email,
  //   };

  //   return {
  //     access_token: this.jwtService.sign(payload),
  //   };
  // }
}
