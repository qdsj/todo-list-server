import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('userauth')
export default class UserAuth {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column()
  password: string;
}
