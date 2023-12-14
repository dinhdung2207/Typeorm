import { BeforeInsert, Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { AbstractEntity } from './base.entity';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Entity()
export class Otp extends AbstractEntity {
  @BeforeInsert()
  hashPassword() {
    this.hashCode = bcrypt.hashSync(this.hashCode, 10);
  }
  @Column()
  hashCode: string;

  @Column({
    type: 'bigint',
  })
  expiredAt: number;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;
}
