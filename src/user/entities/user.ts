import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user')
class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 255,
    default: '默认用户名',
    nullable: true,
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 255,
    default: '',
    nullable: true,
  })
  phone: string;

  @Column({
    type: 'varchar',
    length: 255,
    default: '',
    nullable: true,
  })
  email: string;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  create_time: Date;
}
export default User;
