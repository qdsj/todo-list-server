import { CanActivate, Injectable } from '@nestjs/common';

import { ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const token = this.extractTokenFromHeader(request);

    console.log('jwt token', token);
    if (token) {
      try {
        const payload = this.jwtService.verify(token);
        console.log('jwt payload', payload);
        request['user'] = payload;
        const newToken = this.jwtService.sign({ username: '' });
        response.setHeader('token', `${newToken}`);

        // skip cookie guard
        request['sikp-cookie-guard'] = true;

        console.log('jwt valid success');
      } catch (error) {
        console.log('jwt valid failed, in catch', error);
      }
    } else {
      console.log('jwt valid failed');
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] =
      (request.headers as any).authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
