import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { createDataSource } from './data/database';
import { TodolistModule } from './todolist/todolist.module';
import { UserModule } from './user/user.module';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath:
        process.env.NODE_ENV === 'production'
          ? `.env.production`
          : `.env.local`,
      isGlobal: true,
    }),
    TodolistModule,
    UserModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'zenos',
      signOptions: { expiresIn: '12h' },
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: 'TodoListSource',
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const dataSource = createDataSource(configService);
        return await dataSource.initialize();
      },
    },
  ],
  exports: ['TodoListSource'],
})
export class AppModule {}
