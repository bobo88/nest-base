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

export interface TypeOrmConfig {
  type: 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mongodb';
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  synchronize: boolean;
  logging: boolean;
  entities: string[];
  migrations: string[];
  migrationsRun: boolean;
  cli: {
    migrationsDir: string;
  };
  retryAttempts: number;
  retryDelay: number;
  timezone: string;
  charset: string;
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
    const dbUrl = this.configService.get<string>(
      'DATABASE_URL',
      'mysql://user:password@localhost:3306/db',
    );
    const url = new URL(dbUrl);
    console.log('============DB URL============', dbUrl, url);

    return {
      url: dbUrl,
      host: url.hostname,
      port: parseInt(url.port) || 3306,
      username: url.username,
      password: url.password,
      database: url.pathname.replace('/', ''),
    };
  }

  // TypeORM配置
  get typeorm(): TypeOrmConfig {
    const dbConfig = this.database;
    const isDevelopment = this.app.isDevelopment;

    return {
      type: 'mysql',
      host: dbConfig.host,
      port: dbConfig.port,
      username: dbConfig.username,
      password: dbConfig.password,
      database: dbConfig.database,
      synchronize: isDevelopment, // 开发环境自动同步
      logging: isDevelopment, // 开发环境启用日志
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      migrations: [__dirname + '/../migrations/*{.ts,.js}'],
      migrationsRun: !isDevelopment, // 生产环境运行迁移
      cli: {
        migrationsDir: 'src/migrations',
      },
      retryAttempts: 10,
      retryDelay: 3000,
      timezone: '+08:00',
      charset: 'utf8mb4',
    };
  }

  // Redis配置
  get redis(): RedisConfig {
    const redisUrl = this.configService.get<string>(
      'REDIS_URL',
      'redis://localhost:6379',
    );
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
    return this.configService.get<T>(key, defaultValue as any) as T;
  }

  // 检查环境变量是否存在
  has(key: string): boolean {
    return this.configService.get(key) !== undefined;
  }

  // 验证必需的环境变量
  validateRequired(keys: string[]): void {
    const missingKeys = keys.filter((key) => !this.has(key));
    if (missingKeys.length > 0) {
      throw new Error(`缺少必需的环境变量: ${missingKeys.join(', ')}`);
    }
  }
}
