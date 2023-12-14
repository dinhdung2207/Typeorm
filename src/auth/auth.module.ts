import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Otp } from '../entities';

@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([Otp])],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
