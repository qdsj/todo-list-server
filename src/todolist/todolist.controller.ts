import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import Task from './entities/task';
import { TodolistService } from './todolist.service';

@Controller('todolist')
export class TodolistController {
  constructor(private readonly todolistService: TodolistService) {}

  // @Get()
  // getTask(
  //   @Optional() @Query('phone') phone: string,
  //   @Optional() @Query('email') email: string,
  // ) {
  //   return this.todolistService.getAllTaskByPhoneOrEmail(
  //     phone || '',
  //     email || '',
  //   );
  // }

  @Get('allTask')
  getTaskById(@Query('user_id') user_id: number) {
    const res = this.todolistService.getAllTask(user_id);
    return res;
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

  @Post('update')
  updateTask(@Body() task: Task) {
    return this.todolistService.updateTask(task.id, task);
  }

  @Delete('delete')
  deleteTask(@Body() task: Task) {
    return this.todolistService.deleteTask(task.id, task.user_id);
  }
}
