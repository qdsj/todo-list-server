import { IsNumber, IsOptional } from 'class-validator';

export class GetTasksDto {
  @IsNumber()
  user_id: number;

  @IsOptional()
  isCompleted?: boolean;

  @IsOptional()
  isDeleted?: boolean;
}
