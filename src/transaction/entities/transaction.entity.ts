import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { TransactionInterface } from '../interfaces/transaction.interface';

@Entity({ name: 'transactions' })
export class Transaction implements TransactionInterface {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_email' })
  userEmail: string;

  @Column()
  value: string;

  constructor(init: Partial<any>) {
    return Object.assign(this, init);
  }
}
