import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { SignUpPayloadDto } from '../auth/dtos/sign-up-payload.dto';
import { IUserData } from '../auth/interfaces/user-data.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[] | undefined> {
    return this.usersRepository.find();
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.usersRepository.findOneByOrFail({
      email,
    });
  }

  async createOne(newUserPayload: SignUpPayloadDto): Promise<User> {
    const newUser = this.usersRepository.create(newUserPayload);
    await this.usersRepository.save(newUser);

    return newUser;
  }

  async findByToken(userData: IUserData): Promise<User | undefined> {
    return await this.usersRepository.findOne({
      where: {
        id: Number(userData.id),
        isActive: true,
      },
      select: {
        password: false,
      },
    });
  }
}
