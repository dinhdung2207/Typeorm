import { Entity, Column } from 'typeorm';
import { AbstractEntity } from './base.entity';

@Entity()
export class Category extends AbstractEntity {
  @Column({
    unique: true,
  })
  name: string;
}
