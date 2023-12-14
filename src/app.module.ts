import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ExpensesModule } from './expenses/expenses.module';
import { Category, Expense, Otp, User } from './entities';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '123123',
      database: 'type_orm',
      entities: [User, Expense, Category, Otp],
      synchronize: true,
    }),
    AuthModule,
    UsersModule,
    ExpensesModule,
    CategoriesModule,
  ],
})
export class AppModule {}
