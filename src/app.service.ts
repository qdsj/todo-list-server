import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  getVersion(): string {
    try {
      return '0.0.3';
    } catch {
      return '0.0.0';
    }
  }
}
