import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateTaskDto {
  @IsNumber()
  user_id: number;

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description: string;
}
