import { Entity, Column, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { AbstractEntity } from './base.entity';
import { User } from './user.entity';
import { Category } from './category.entity';

@Entity()
export class Expense extends AbstractEntity {
  @Column()
  name: string;

  @Column()
  price: number;

  @ManyToOne(() => User, (user) => user.expenses)
  user: User;

  @ManyToMany(() => Category)
  @JoinTable()
  categories: Category[];
}
