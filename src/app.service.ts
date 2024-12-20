import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor(@Inject('AppVersion') private readonly appVersion: string) {}
  getHello(): string {
    return 'Hello World!';
  }

  getVersion(): string {
    try {
      return this.appVersion;
    } catch (error) {
      return '0.0.0';
    }
  }
}
