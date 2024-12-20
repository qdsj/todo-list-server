import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import User from '../user/entities/user';
import Task from '../todolist/entities/task';
import UserAuth from 'src/user/entities/userAuth';

export const createDataSource = (configService: ConfigService) => {
  return new DataSource({
    type: 'mysql',
    host: configService.get('DB_HOST'),
    port: configService.get('DB_PORT'),
    username: configService.get('DB_USERNAME'),
    password: configService.get('DB_PASSWORD'),
    database: configService.get('DB_DATABASE'),
    entities: [User, UserAuth, Task],
    synchronize: true,
    poolSize: 10,
    logging: true,
    connectorPackage: 'mysql2',
    extra: {
      authPlugins: 'sha256_password',
    },
  });
};

export type TodoListSourceType = DataSource;
