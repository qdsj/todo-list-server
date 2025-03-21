import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-todolist.dto';
import { TodolistService } from './todolist.service';
import { UpdateTaskDto, UpdateTaskStatusDto } from './dto/update-task.dto';
import { CookieAuthGuard } from 'src/guards/cookie.auth';
import { JwtAuthGuard } from 'src/guards/jwt.auth';

@Controller('tasks')
export class TodolistController {
  constructor(private readonly todolistService: TodolistService) {}

  @Get()
  @UseGuards(JwtAuthGuard, CookieAuthGuard)
  getTasks(
    @Query('user_id') userId: number,
    @Query('isCompleted') isCompleted: string,
    @Query('isDeleted') isDeleted: string,
  ) {
    return this.todolistService.getAllTask(userId, isCompleted, isDeleted);
  }

  @Post()
  async createTask(@Body() task: CreateTaskDto) {
    const result = await this.todolistService.addTask(task);
    if (result && result.identifiers.length > 0) {
      return result.identifiers[0];
    }
    throw new HttpException(
      'add task failed',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  @Put(':id')
  async updateTask(@Param('id') id: number, @Body() task: UpdateTaskDto) {
    const res = await this.todolistService.updateTask(id, task);
    if (res && res.affected > 0) {
      return {
        affected: res.affected,
      };
    }
    throw new HttpException(
      'update task failed',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  @Put('status/:id')
  async updateTaskStatus(
    @Param('id') id: number,
    @Body() status: UpdateTaskStatusDto,
  ) {
    const res = await this.todolistService.updateTaskStatus(id, status);
    if (res && res.affected > 0) {
      return {
        affected: res.affected,
      };
    }
    throw new HttpException(
      'update task status failed',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  @Delete(':id')
  async softDeleteTask(
    @Param('id') id: number,
    @Body('user_id') userId: number,
  ) {
    const res = await this.todolistService.softDeleteTask(id, userId);
    if (res && res.affected > 0) {
      return {
        affected: res.affected,
      };
    }
    throw new HttpException(
      'soft delete task failed',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  @Put('restore/:id')
  async restoreTask(@Param('id') id: number, @Body('user_id') userId: number) {
    const res = await this.todolistService.restoreTask(id, userId);
    if (res && res.affected > 0) {
      return {
        affected: res.affected,
      };
    }
    throw new HttpException(
      'restore task failed',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
