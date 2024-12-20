import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tasks')
class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 255,
  })
  title: string;

  @Column({
    type: 'varchar',
    length: 255,
    default: '',
  })
  description: string;

  @Column({
    type: 'int',
    default: 0,
  })
  status: number;

  @Column({
    type: 'int',
    default: 0,
  })
  priority: number;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  due_date: Date;

  @Column({
    name: 'update_at',
    type: 'timestamp',
    nullable: true,
  })
  update_time: Date;

  @Column({
    name: 'create_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  create_time: Date;

  @Column({
    name: 'deleted_at',
    type: 'timestamp',
    nullable: true,
  })
  deleted_time: Date;

  @Column({
    name: 'created_by',
    type: 'int',
  })
  user_id: number;
}

export default Task;
