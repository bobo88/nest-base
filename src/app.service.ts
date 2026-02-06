import { Injectable } from '@nestjs/common';
import { ConfigService } from './config/config.service';

@Injectable()
export class AppService {
  constructor(private configService: ConfigService) {}

  getHello(): string {
    const appConfig = this.configService.app;
    return `Hello World! 当前环境: ${appConfig.nodeEnv}, 端口: ${appConfig.port}`;
  }

  getConfigInfo(): any {
    return {
      app: this.configService.app,
      database: this.configService.database,
      redis: this.configService.redis,
      jwt: this.configService.jwt,
    };
  }
}
