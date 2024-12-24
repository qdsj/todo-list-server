import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { LoginByEmailDto, LoginByPhoneDto } from './dto/login.dto';
import { RegisterByEmailDto, RegisterByPhoneDto } from './dto/register.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // @Post('add')
  // async addUser(@Body() user: User) {
  //   return await this.userService.addUser(user);
  // }

  @Get('check')
  getUser(@Query('phone') phone: string, @Query('email') email: string) {
    return this.userService.getUserByPhoneOrEmail(phone, email);
  }

  @Post('login')
  async login(@Body() user: LoginByPhoneDto | LoginByEmailDto) {
    return {
      code: 200,
      message: '登录成功',
      data: user,
    };
  }

  @Post('register')
  async register(@Body() register: RegisterByPhoneDto | RegisterByEmailDto) {
    return await this.userService.register(register);
  }

  @Get('/all')
  getAllUsers() {
    return this.userService.getAllUsers();
  }
}
