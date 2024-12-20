import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { createDataSource } from './data/database';
import { TodolistModule } from './todolist/todolist.module';
import { UserModule } from './user/user.module';
@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: process.env.NODE_ENV === 'production' ? undefined : `.env`,
      isGlobal: true,
    }),
    TodolistModule,
    UserModule,
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
