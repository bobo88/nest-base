import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        // 从环境变量直接读取数据库配置
        const dbUrl = configService.get<string>(
          'DATABASE_URL',
          'mysql://user:password@localhost:3306/db',
        );
        const url = new URL(dbUrl);

        const isDevelopment = configService.get('NODE_ENV') === 'development';

        return {
          type: 'mysql',
          host: url.hostname,
          port: parseInt(url.port) || 3306,
          username: url.username,
          password: url.password,
          database: url.pathname.replace('/', ''),
          synchronize: isDevelopment,
          logging: isDevelopment,
          entities: [__dirname + '/../**/*.entity{.ts,.js}'],
          migrations: [__dirname + '/../migrations/*{.ts,.js}'],
          migrationsRun: !isDevelopment,
          cli: {
            migrationsDir: 'src/migrations',
          },
          // 连接重试配置
          retryAttempts: 10,
          retryDelay: 3000,
          // 连接池配置
          extra: {
            connectionLimit: 10,
            acquireTimeout: 60000,
            timeout: 60000,
          },
          // 时区配置
          timezone: '+08:00',
          // 字符集
          charset: 'utf8mb4',
        };
      },
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
