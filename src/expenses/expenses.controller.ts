import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CreateExpenseDto } from './dtos/create-expense.dto';
import { ExpensesService } from './expenses.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../utils/guards/auth.guard';

@ApiTags('Expenses API')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('expenses')
export class ExpensesController {
  constructor(private expensesService: ExpensesService) {}

  @Post('/')
  createExpense(@Body() createExpenseDto: CreateExpenseDto, @Request() req) {
    return this.expensesService.create(createExpenseDto, req.user.data);
  }

  @Get('/your-expenses')
  getAllExpensesUser(@Request() req) {
    return this.expensesService.findWithUserId(req.user.data);
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
