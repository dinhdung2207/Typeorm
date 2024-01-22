import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CreateExpenseDto } from './dtos/create-expense.dto';
import { ExpensesService } from './expenses.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../utils/guards/auth.guard';
import { PageOptionsDto } from '../utils/customer-decorators/pagination/page-options.dto';
import { ApiPaginatedResponse } from '../utils/customer-decorators/pagination/api-pagination-res';
import { Expense } from '../entities';

@ApiTags('Expenses API')
@ApiBearerAuth()
@UseGuards(AuthGuard)
// @UseInterceptors(ClassSerializerInterceptor)
@Controller('expenses')
export class ExpensesController {
  constructor(private expensesService: ExpensesService) {}

  @Post('/')
  createExpense(@Body() createExpenseDto: CreateExpenseDto, @Request() req) {
    return this.expensesService.create(createExpenseDto, req.user.data);
  }

  @Get('/your-expenses')
  @ApiPaginatedResponse(Expense)
  getAllExpensesUser(@Request() req, @Query() pageOptionsDto: PageOptionsDto) {
    const { page, take } = pageOptionsDto;
    console.log('🚀 ~ ExpensesService ~ take:', typeof take);
    console.log('🚀 ~ ExpensesService ~ page:', typeof page);
    return this.expensesService.findWithUserId(req.user.data, pageOptionsDto);
  }

  @Get('/')
  getAllExpenses() {
    return this.expensesService.findAll();
  }

  @Get('/:id')
  getExpenseDetail(@Param('id') id: string) {
    return this.expensesService.findDetailsWithId(id);
  }
}
