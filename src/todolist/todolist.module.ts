import { Module } from '@nestjs/common';
import { TodolistService } from './todolist.service';
import { TodolistController } from './todolist.controller';
import { CookieAuthGuard } from 'src/guards/cookie.auth';
import { JwtAuthGuard } from 'src/guards/jwt.auth';
import { ClientsModule } from '@nestjs/microservices';
import { Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
        transport: Transport.TCP,
        options: {
          host: process.env.AUTH_SERVICE_HOST,
          port: Number(process.env.AUTH_SERVICE_PORT),
        },
      },
    ]),
  ],
  controllers: [TodolistController],
  providers: [TodolistService, JwtAuthGuard, CookieAuthGuard],
})
export class TodolistModule {}
