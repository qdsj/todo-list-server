import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import User from './entities/user';
import { TodoListSourceType } from 'src/data/database';
import { RegisterByEmailDto, RegisterByPhoneDto } from './dto/register.dto';
import UserAuth from './entities/userAuth';
import { hashPassword, verifyPassword } from 'src/util/secrets';
import { LoginByEmailDto, LoginByPhoneDto } from './dto/login.dto';

@Injectable()
export class UserService {
  @Inject('TodoListSource')
  private todoListSource: TodoListSourceType;

  async addUser(user: User) {
    if (!user.phone && !user.email) {
      throw new HttpException(
        'phone or email is required',
        HttpStatus.BAD_REQUEST,
      );
    }
    const {
      identifiers: [{ id }],
    } = await this.todoListSource.getRepository(User).insert(user);

    return this.getUserById(id);
  }

  async register(register: RegisterByPhoneDto | RegisterByEmailDto) {
    // search user
    const _user = await this.getUserByPhoneOrEmail(
      (register as RegisterByPhoneDto).phone,
      (register as RegisterByEmailDto).email,
    );
    if (_user) {
      throw new HttpException('user already exists', HttpStatus.BAD_REQUEST);
    }
    const user = await this.addUser({
      phone: (register as RegisterByPhoneDto).phone,
      email: (register as RegisterByEmailDto).email,
    } as any);

    return this.addUserAuth(user, register.password);
  }

  async addUserAuth(user: User, password: string) {
    const user_id = user.id;
    if (!password) {
      throw new HttpException('password is required', HttpStatus.BAD_REQUEST);
    }
    const _password = await hashPassword(password);
    try {
      await this.todoListSource
        .getRepository(UserAuth)
        .insert({ user_id, password: _password });
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'add user auth failed',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return user;
  }

  async getUserByPhoneOrEmail(phone: string, email: string) {
    if (!phone && !email) {
      throw { type: 'client_error', message: 'phone or email is required' };
    }
    return this.todoListSource.getRepository(User).findOne({
      where: [{ phone }, { email }],
    });
  }

  async getUserById(id: number) {
    return this.todoListSource.getRepository(User).findOne({
      where: { id },
    });
  }

  async getAllUsers() {
    return this.todoListSource.getRepository(User).find();
  }

  async login(login: LoginByPhoneDto | LoginByEmailDto) {
    const user = await this.getUserByPhoneOrEmail(
      (login as LoginByPhoneDto).phone,
      (login as LoginByEmailDto).email,
    );
    if (!user) {
      throw new HttpException('user not found', HttpStatus.BAD_REQUEST);
    }
    const userAuth = await this.todoListSource.getRepository(UserAuth).findOne({
      where: { user_id: user.id },
    });
    if (!userAuth) {
      throw new HttpException('user auth not found', HttpStatus.BAD_REQUEST);
    }
    const isPasswordValid = await verifyPassword(
      login.password,
      userAuth.password,
    );
    if (!isPasswordValid) {
      throw new HttpException('password is incorrect', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }
}
