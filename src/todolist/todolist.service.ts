import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { TodoListSourceType } from 'src/data/database';
import User from '../user/entities/user';
import Task from './entities/task';
import { CreateTaskDto } from './dto/create-todolist.dto';
import { UpdateTaskDto, UpdateTaskStatusDto } from './dto/update-task.dto';

@Injectable()
export class TodolistService {
  constructor(
    @Inject('TodoListSource')
    private todoListSource: TodoListSourceType,
  ) {}

  async addTask(task: CreateTaskDto) {
    const { title, description = '', user_id } = task;
    if (!user_id) {
      throw new HttpException('user_id is required', HttpStatus.BAD_REQUEST);
    }
    const user = await this.todoListSource.getRepository(User).findOne({
      where: { id: user_id },
    });
    if (!user) {
      throw new HttpException('user not found', HttpStatus.BAD_REQUEST);
    }
    const newTask = { title, description, user_id };
    return this.todoListSource.getRepository(Task).insert(newTask);
  }

  getAllTask(user_id: number, isCompleted?: boolean, isDeleted?: boolean) {
    if (!user_id) {
      throw new HttpException('user_id is required', HttpStatus.BAD_REQUEST);
    }
    const where: any = { user_id };
    if (isCompleted !== undefined) {
      where.isCompleted = isCompleted;
    }
    if (isDeleted !== undefined) {
      where.isDeleted = isDeleted;
    } else {
      where.isDeleted = false;
    }
    return this.todoListSource.getRepository(Task).findBy(where);
  }

  async getAllTaskByPhoneOrEmail(phone: string = '', email: string = '') {
    const user = await this.todoListSource.getRepository(User).findOne({
      where: [{ phone }, { email }],
    });

    return this.getAllTask(user.id);
  }

  getTask(id: number, user_id: number) {
    return this.todoListSource.getRepository(Task).findOne({
      where: { id, user_id },
    });
  }

  async updateTask(id: number, task: UpdateTaskDto) {
    const _task = await this.getTask(id, task.user_id);
    if (!_task) {
      throw new HttpException('task not found', HttpStatus.BAD_REQUEST);
    }
    const { title, description = '' } = task;
    if (!title && !description) {
      throw new HttpException(
        'title or description is required',
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.todoListSource.getRepository(Task).update(id, {
      title,
      description,
      update_time: new Date(),
    });
  }

  async updateTaskStatus(id: number, task: UpdateTaskStatusDto) {
    const _task = await this.getTask(id, task.user_id);
    if (!_task) {
      throw new HttpException('task not found', HttpStatus.BAD_REQUEST);
    }
    const _isCompleted = Boolean(task.isCompleted);
    return this.todoListSource.getRepository(Task).update(id, {
      isCompleted: _isCompleted,
      completed_time: _isCompleted ? new Date() : null,
    });
  }

  // async completedTask(id: number, user_id: number) {
  //   const _task = await this.getTask(id, user_id);
  //   if (!_task) {
  //     throw new HttpException('task not found', HttpStatus.BAD_REQUEST);
  //   }
  //   return this.todoListSource.getRepository(Task).update(id, {
  //     isCompleted: true,
  //     completed_time: new Date(),
  //   });
  // }

  // async disCompleteTask(id: number, user_id: number) {
  //   const _task = await this.getTask(id, user_id);
  //   if (!_task) {
  //     throw new HttpException('task not found', HttpStatus.BAD_REQUEST);
  //   }
  //   return this.todoListSource.getRepository(Task).update(id, {
  //     isCompleted: false,
  //     completed_time: null,
  //   });
  // }

  async softDeleteTask(id: number, user_id: number) {
    const _task = await this.getTask(id, user_id);
    if (!_task) {
      throw new HttpException('task not found', HttpStatus.BAD_REQUEST);
    }
    return this.todoListSource.getRepository(Task).update(id, {
      isDeleted: true,
      deleted_time: new Date(),
    });
  }

  async restoreTask(id: number, user_id: number) {
    const _task = await this.getTask(id, user_id);
    if (!_task) {
      throw new HttpException('task not found', HttpStatus.BAD_REQUEST);
    }
    return this.todoListSource.getRepository(Task).update(id, {
      isDeleted: false,
      deleted_time: null,
    });
  }
}
