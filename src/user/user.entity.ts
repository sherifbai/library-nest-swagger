import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BookEntity } from '../book/book.entity';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ default: false })
  subscription: boolean;

  @Column({ default: false })
  role: boolean;

  @ManyToMany(() => BookEntity)
  @JoinTable({ name: 'users_books' })
  books: BookEntity[];
}
