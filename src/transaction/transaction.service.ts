import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { Transaction } from './entities/transaction.entity';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Transaction)
    private readonly transactionsRepository: Repository<Transaction>,
  ) {}

  async getUserTransactions(id: number) {
    try {
      const foundUser = await this.usersRepository.findOneBy({ id: id });

      if (!foundUser) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }

      const foundTransactions = await this.transactionsRepository.findBy({
        userEmail: foundUser?.email,
      });

      return foundTransactions;
    } catch (error) {
      throw error;
    }
  }
}
