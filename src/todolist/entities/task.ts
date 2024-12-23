import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tasks')
class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 255,
    comment: 'task title',
  })
  title: string;

  @Column({
    type: 'varchar',
    length: 255,
    default: '',
    comment: 'task description',
  })
  description: string;

  @Column({
    type: 'int',
    default: 0,
    name: 'is_completed',
    transformer: {
      to: (value: boolean) => (value ? 1 : 0),
      from: (value: number) => value === 1,
    },
    comment: '0: not completed, 1: completed',
  })
  isCompleted: boolean;

  @Column({
    type: 'int',
    default: 0,
    comment: 'task priority',
  })
  priority: number;

  @Column({
    type: 'timestamp',
    nullable: true,
    comment: 'task due date',
  })
  due_date: Date;

  @Column({
    name: 'create_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    comment: 'task create time',
  })
  create_time: Date;

  @Column({
    name: 'update_at',
    type: 'timestamp',
    nullable: true,
    comment: 'task update time',
  })
  update_time: Date;

  @Column({
    name: 'completed_at',
    type: 'timestamp',
    nullable: true,
    comment: 'task completed time',
  })
  completed_time: Date;

  @Column({
    name: 'is_deleted',
    type: 'int',
    default: 0,
    transformer: {
      to: (value: boolean) => (value ? 1 : 0),
      from: (value: number) => value === 1,
    },
    comment: '0: not deleted, 1: deleted',
  })
  isDeleted: boolean;

  @Column({
    name: 'deleted_at',
    type: 'timestamp',
    nullable: true,
    comment: 'task delete time',
  })
  deleted_time: Date;

  @Column({
    name: 'created_by',
    type: 'int',
    comment: 'task creator id',
    nullable: false,
  })
  user_id: number;
}

export default Task;
