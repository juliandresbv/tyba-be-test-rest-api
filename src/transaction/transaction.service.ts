import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './entities/transaction.entity';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionsRepository: Repository<Transaction>,
  ) {}

  async getUserTransactions(email: string) {
    try {
      const foundTransactions = await this.transactionsRepository.findBy({
        userEmail: email,
      });

      return foundTransactions;
    } catch (error) {
      throw error;
    }
  }
}
