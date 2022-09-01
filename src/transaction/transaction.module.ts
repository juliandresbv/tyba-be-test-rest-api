import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Transaction } from './entities/transaction.entity';
import { TransactionService } from './transaction.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Transaction])],
  providers: [TransactionService],
  exports: [TransactionService],
})
export class TransactionModule {}
