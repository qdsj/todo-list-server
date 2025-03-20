import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy } from '@nestjs/microservices';
import { Request } from 'express';

@Injectable()
export class CookieAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  @Inject('AUTH_SERVICE')
  private readonly authService: ClientProxy;

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    if (request['sikp-cookie-guard']) {
      return true;
    }

    const token = this.extractTokenFromHeader(request);

    console.log('cookie token', token);
    if (token) {
      try {
        // check token from other microservice
        const res = await this.authService.send('isLogin', token).toPromise();
        console.log('cookie res', res);
        if (res && res.isLogin) {
          console.log('cookie valid success');
          const newToken = this.jwtService.sign({ username: res.username });
          response.setHeader('token', `${newToken}`);
          return true;
        }
      } catch (error) {
        console.log('cookie error', error);
      }
    }
    console.log('cookie valid failed');
    return false;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const token = request.cookies['token'];
    return token;
  }
}
