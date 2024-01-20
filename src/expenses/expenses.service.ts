import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category, Expense } from '../entities';
import { CreateExpenseDto } from './dtos/create-expense.dto';
import { In, Repository } from 'typeorm';
import { IUserData } from '../auth/interfaces/user-data.interface';
import { UsersService } from '../users/users.service';
import { PaginationDto } from './dtos/pagination.dto';
import {
  PageMetaDto,
  PageOptionsDto,
} from '../utils/customer-decorators/pagination/page-meta.dto';
import { PageDto } from '../utils/customer-decorators/pagination/page.dto';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectRepository(Expense) private expensesRepository: Repository<Expense>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    private usersService: UsersService,
  ) {}

  async create(
    createExpenseDto: CreateExpenseDto,
    userData: IUserData,
  ): Promise<Expense> {
    const categories = await this.categoryRepository.find({
      where: {
        id: In(createExpenseDto.categories),
      },
    });

    const currentUser = await this.usersService.findByToken(userData);

    this.expensesRepository.create({
      ...createExpenseDto,
      categories,
      user: currentUser,
    });

    return await this.expensesRepository.save({
      ...createExpenseDto,
      categories,
      user: currentUser,
    });
  }

  async findWithUserId(
    userData: IUserData,
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<any>> {
    const currentUser = await this.usersService.findByToken(userData);
    const itemCount = await this.expensesRepository.countBy({
      user: {
        id: currentUser.id,
      },
    });
    const pageMetaDto = new PageMetaDto({
      pageOptionsDto,
      itemCount,
    });

    const entities = await this.expensesRepository.find({
      where: {
        user: {
          id: currentUser.id,
        },
      },
      relations: {
        categories: true,
        user: true,
      },
      select: {
        user: {
          firstName: true,
          lastName: true,
          email: true,
        },
      },
      skip: pageOptionsDto.skip,
      take: pageOptionsDto.take,
    });

    return new PageDto(entities, pageMetaDto);
  }

  async findAll(): Promise<Expense[]> {
    return await this.expensesRepository.find({
      relations: {
        categories: true,
      },
    });
  }

  async findDetailsWithId(expenseId: string): Promise<Expense> {
    return await this.expensesRepository.findOneOrFail({
      where: {
        id: Number(expenseId),
      },
      relations: {
        categories: true,
        user: true,
      },
      select: {
        user: {
          firstName: true,
          lastName: true,
          email: true,
        },
      },
    });
  }
}
