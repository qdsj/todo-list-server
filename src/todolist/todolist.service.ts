import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { TodoListSourceType } from 'src/data/database';
import User from '../user/entities/user';
import Task from './entities/task';

@Injectable()
export class TodolistService {
  constructor(
    @Inject('TodoListSource')
    private todoListSource: TodoListSourceType,
  ) {}

  addTask(task: Task, user_id: number) {
    const { title, description = '' } = task;
    const newTask = { title, description, user_id };
    return this.todoListSource.getRepository(Task).insert(newTask);
  }

  getAllTask(
    user_id: number,
    isCompleted: boolean = false,
    isDeleted: boolean = false,
  ) {
    if (!user_id) {
      throw new HttpException('user_id is required', HttpStatus.BAD_REQUEST);
    }
    return this.todoListSource.getRepository(Task).findBy({
      user_id,
      isCompleted,
      isDeleted,
    });
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

  async updateTask(id: number, task: Task) {
    const _task = await this.getTask(id, task.user_id);
    if (!_task) {
      throw new HttpException('task not found', HttpStatus.NOT_FOUND);
    }
    return this.todoListSource.getRepository(Task).update(id, {
      ...task,
      update_time: new Date(),
    });
  }

  async completedTask(id: number, user_id: number) {
    const _task = await this.getTask(id, user_id);
    if (!_task) {
      throw new HttpException('task not found', HttpStatus.NOT_FOUND);
    }
    return this.todoListSource.getRepository(Task).update(id, {
      isCompleted: true,
      completed_time: new Date(),
    });
  }

  async deleteTask(id: number, user_id: number) {
    const _task = await this.getTask(id, user_id);
    if (!_task) {
      throw new HttpException('task not found', HttpStatus.NOT_FOUND);
    }
    return this.todoListSource.getRepository(Task).delete(id);
  }
}
