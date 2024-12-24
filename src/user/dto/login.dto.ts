import { IsNotEmpty } from 'class-validator';

export class LoginByPhoneDto {
  @IsNotEmpty({ message: 'phone is required' })
  phone: string;
  @IsNotEmpty({ message: 'password is required' })
  password: string;
}

export class LoginByEmailDto {
  @IsNotEmpty({ message: 'email is required' })
  email: string;
  @IsNotEmpty({ message: 'password is required' })
  password: string;
}
