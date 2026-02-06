import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { ConfigService } from './config/config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 全局验证管道
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // 获取配置服务
  const configService = app.get(ConfigService);

  // 验证必需的环境变量
  configService.validateRequired([
    'NODE_ENV',
    'PORT',
    'DATABASE_URL',
    'REDIS_URL',
    'JWT_SECRET',
  ]);

  // 启用CORS（开发环境）
  if (configService.app.isDevelopment) {
    app.enableCors({
      origin: true,
      credentials: true,
    });
  }

  const port = configService.app.port;
  await app.listen(port);

  console.log(`🚀 应用运行在 ${configService.app.nodeEnv} 模式`);
  console.log(`📡 服务地址: http://localhost:${port}`);
  console.log(
    `💾 数据库: ${configService.database.host}:${configService.database.port}`,
  );
  console.log(
    `🔴 Redis: ${configService.redis.host}:${configService.redis.port}`,
  );
}

bootstrap();
