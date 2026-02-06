import { Injectable } from '@nestjs/common';
import { ConfigService as NestConfigService } from '@nestjs/config';

export interface DatabaseConfig {
  url: string;
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}

export interface RedisConfig {
  url: string;
  host: string;
  port: number;
}

export interface JwtConfig {
  secret: string;
  expiresIn: string;
}

export interface AppConfig {
  nodeEnv: string;
  port: number;
  isDevelopment: boolean;
  isProduction: boolean;
}

@Injectable()
export class ConfigService {
  constructor(private configService: NestConfigService) {}

  // 应用配置
  get app(): AppConfig {
    const nodeEnv = this.configService.get<string>('NODE_ENV', 'development');
    return {
      nodeEnv,
      port: this.configService.get<number>('PORT', 3333),
      isDevelopment: nodeEnv === 'development',
      isProduction: nodeEnv === 'production',
    };
  }

  // 数据库配置
  get database(): DatabaseConfig {
    const dbUrl = this.configService.get<string>('DATABASE_URL', 'mysql://user:password@localhost:3306/db');
    const url = new URL(dbUrl);
    
    return {
      url: dbUrl,
      host: url.hostname,
      port: parseInt(url.port) || 3306,
      username: url.username,
      password: url.password,
      database: url.pathname.replace('/', ''),
    };
  }

  // Redis配置
  get redis(): RedisConfig {
    const redisUrl = this.configService.get<string>('REDIS_URL', 'redis://localhost:6379');
    const url = new URL(redisUrl);
    
    return {
      url: redisUrl,
      host: url.hostname,
      port: parseInt(url.port) || 6379,
    };
  }

  // JWT配置
  get jwt(): JwtConfig {
    return {
      secret: this.configService.get<string>('JWT_SECRET', 'bob-588'),
      expiresIn: this.configService.get<string>('JWT_EXPIRES_IN', '7d'),
    };
  }

  // 获取环境变量（通用方法）
  get<T = any>(key: string, defaultValue?: T): T {
    return this.configService.get<T>(key, defaultValue);
  }

  // 检查环境变量是否存在
  has(key: string): boolean {
    return this.configService.get(key) !== undefined;
  }

  // 验证必需的环境变量
  validateRequired(keys: string[]): void {
    const missingKeys = keys.filter(key => !this.has(key));
    if (missingKeys.length > 0) {
      throw new Error(`缺少必需的环境变量: ${missingKeys.join(', ')}`);
    }
  }
}