import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateTaskStatusDto {
  @IsNumber()
  user_id: number;

  @IsBoolean()
  isCompleted: boolean;
}

export class UpdateTaskDto {
  @IsString({ message: 'title must be a string' })
  // @IsOptional()
  title: string;

  @IsString({ message: 'description must be a string' })
  @IsOptional()
  description?: string;

  user_id: number;
}
