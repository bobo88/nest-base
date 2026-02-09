import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
// UnauthorizedException
import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'username', // 使用username作为用户名字段
    });
  }

  // async validate(username: string, password: string): Promise<any> {
  //   const user = await this.authService.validateUser(username, password);
  //   if (!user) {
  //     throw new UnauthorizedException('用户名或密码错误');
  //   }
  //   return user;
  // }
}
