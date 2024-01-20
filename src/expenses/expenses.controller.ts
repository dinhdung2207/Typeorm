import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateExpenseDto } from './dtos/create-expense.dto';
import { ExpensesService } from './expenses.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../utils/guards/auth.guard';
import { PageOptionsDto } from '../utils/customer-decorators/pagination/page-meta.dto';

@ApiTags('Expenses API')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('expenses')
// @UseInterceptors(ClassSerializerInterceptor)
export class ExpensesController {
  constructor(private expensesService: ExpensesService) {}

  @Post('/')
  createExpense(@Body() createExpenseDto: CreateExpenseDto, @Request() req) {
    return this.expensesService.create(createExpenseDto, req.user.data);
  }

  @Get('/your-expenses')
  getAllExpensesUser(@Request() req, @Query() pageOptionsDto: PageOptionsDto) {
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
