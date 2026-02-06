# 环境配置管理系统

## 概述

本项目使用 NestJS 的 `@nestjs/config` 模块来管理环境变量，提供了类型安全、验证和分组管理的配置系统。

## 快速开始

### 1. 环境变量文件

创建 `.env` 文件（基于 `.env.example`）：

```bash
# 复制示例文件
cp .env.example .env

# 编辑环境变量
vim .env
```

### 2. 必需的环境变量

确保以下环境变量已设置：

```env
NODE_ENV=development
PORT=3333
DATABASE_URL=mysql://user:password@localhost:3306/db
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-secret-key
```

## 配置服务使用

### 在服务中使用配置

```typescript
import { Injectable } from '@nestjs/common';
import { ConfigService } from './config/config.service';

@Injectable()
export class YourService {
  constructor(private configService: ConfigService) {}

  someMethod() {
    // 获取应用配置
    const appConfig = this.configService.app;
    console.log(`环境: ${appConfig.nodeEnv}, 端口: ${appConfig.port}`);

    // 获取数据库配置
    const dbConfig = this.configService.database;
    console.log(`数据库: ${dbConfig.host}:${dbConfig.port}`);

    // 获取Redis配置
    const redisConfig = this.configService.redis;
    console.log(`Redis: ${redisConfig.host}:${redisConfig.port}`);

    // 获取JWT配置
    const jwtConfig = this.configService.jwt;
    console.log(`JWT密钥: ${jwtConfig.secret}`);

    // 通用方法获取环境变量
    const customVar = this.configService.get('CUSTOM_VAR', 'default');
  }
}
```

### 配置分组

系统将配置分为以下几个组：

1. **应用配置** (`configService.app`)
   - `nodeEnv`: 环境类型
   - `port`: 服务端口
   - `isDevelopment`: 是否为开发环境
   - `isProduction`: 是否为生产环境

2. **数据库配置** (`configService.database`)
   - `url`: 完整的数据库连接URL
   - `host`: 数据库主机
   - `port`: 数据库端口
   - `username`: 用户名
   - `password`: 密码
   - `database`: 数据库名

3. **Redis配置** (`configService.redis`)
   - `url`: Redis连接URL
   - `host`: Redis主机
   - `port`: Redis端口

4. **JWT配置** (`configService.jwt`)
   - `secret`: JWT密钥
   - `expiresIn`: 过期时间

## 环境变量验证

系统在启动时会验证必需的环境变量：

```typescript
// 在 main.ts 中自动验证
configService.validateRequired([
  'NODE_ENV',
  'PORT',
  'DATABASE_URL',
  'REDIS_URL',
  'JWT_SECRET',
]);
```

如果缺少必需的环境变量，应用将无法启动。

## 环境特定配置

### 开发环境 (.env)

```env
NODE_ENV=development
PORT=3333
DATABASE_URL=mysql://dev_user:dev_pass@localhost:3306/dev_db
REDIS_URL=redis://localhost:6379
```

### 生产环境 (.env.production)

```env
NODE_ENV=production
PORT=80
DATABASE_URL=mysql://prod_user:prod_pass@db.prod.com:3306/prod_db
REDIS_URL=redis://redis.prod.com:6379
```

### 测试环境 (.env.test)

```env
NODE_ENV=test
PORT=3001
DATABASE_URL=mysql://test_user:test_pass@localhost:3306/test_db
REDIS_URL=redis://localhost:6379
```

## 最佳实践

### 1. 安全注意事项

- 永远不要将 `.env` 文件提交到版本控制
- 在生产环境使用环境变量而非文件
- 定期轮换敏感密钥（如 JWT_SECRET）

### 2. 配置管理

- 使用 `.env.example` 作为配置模板
- 为不同环境创建对应的环境文件
- 使用有意义的默认值

### 3. 类型安全

- 所有配置都有 TypeScript 接口定义
- 使用类型安全的获取方法
- 避免直接使用 `process.env`

## API 端点

系统提供了以下测试端点：

- `GET /` - 基础问候信息
- `GET /config` - 查看当前配置
- `GET /health` - 健康检查

## 故障排除

### 常见问题

1. **环境变量未加载**
   - 检查 `.env` 文件是否存在
   - 确认文件路径正确
   - 重启应用

2. **配置验证失败**
   - 检查必需的环境变量是否设置
   - 验证环境变量格式是否正确

3. **类型错误**
   - 确保使用正确的配置组
   - 检查 TypeScript 类型定义

### 调试技巧

```typescript
// 在开发环境启用详细日志
if (configService.app.isDevelopment) {
  console.log('当前配置:', configService.getConfigInfo());
}
```

## 扩展配置

要添加新的配置组，请更新 `config.service.ts`：

```typescript
// 添加新的配置接口
export interface NewConfig {
  apiKey: string;
  baseUrl: string;
}

// 在 ConfigService 中添加获取方法
get newConfig(): NewConfig {
  return {
    apiKey: this.configService.get('NEW_API_KEY', ''),
    baseUrl: this.configService.get('NEW_BASE_URL', 'https://api.example.com'),
  };
}
```
