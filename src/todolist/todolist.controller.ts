import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import Task from './entities/task';
import { TodolistService } from './todolist.service';

@Controller('todolist')
export class TodolistController {
  constructor(private readonly todolistService: TodolistService) {}

  @Get('allTask')
  getTaskById(
    @Query('user_id') user_id: number,
    @Query('isCompleted') isCompleted: string,
    @Query('isDeleted') isDeleted: string,
  ) {
    const _isCompleted = isCompleted === 'true';
    const _isDeleted = isDeleted === 'true';
    return this.todolistService.getAllTask(user_id, _isCompleted, _isDeleted);
  }

  @Post('add')
  async addTask(@Body() task: Task) {
    const result = await this.todolistService.addTask(task, task.user_id);
    if (result && result.identifiers.length > 0) {
      return result.identifiers[0];
    }
    throw new HttpException(
      'add task failed',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  @Put('update')
  async updateTask(@Body() task: Task) {
    const res = await this.todolistService.updateTask(task.id, task);
    if (res && res.affected > 0) {
      return {
        affected: res.affected,
      };
    }
    throw new HttpException('update task failed', HttpStatus.BAD_REQUEST);
  }

  @Put('completed')
  async completedTask(
    @Query('id') id: number,
    @Query('user_id') user_id: number,
  ) {
    const res = await this.todolistService.completedTask(id, user_id);
    if (res && res.affected > 0) {
      return {
        affected: res.affected,
      };
    }
  }

  @Delete('delete')
  deleteTask(@Body() task: Task) {
    return this.todolistService.deleteTask(task.id, task.user_id);
  }
}
