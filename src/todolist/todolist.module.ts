import { Module } from '@nestjs/common';
import { TodolistService } from './todolist.service';
import { TodolistController } from './todolist.controller';
import { CookieAuthGuard } from 'src/guards/cookie.auth';
import { JwtAuthGuard } from 'src/guards/jwt.auth';
import { ClientsModule } from '@nestjs/microservices';
import { Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'AUTH_SERVICE',
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get('AUTH_SERVICE_HOST'),
            port: Number(configService.get('AUTH_SERVICE_PORT')),
          },
        }),
      },
    ]),
  ],
  controllers: [TodolistController],
  providers: [TodolistService, JwtAuthGuard, CookieAuthGuard],
})
export class TodolistModule {}
