import { Inject, Injectable } from '@nestjs/common';
import { TransactionDto } from './dto/transaction.dto';
import { Repository } from 'typeorm';
import { Transaction } from './entities/transaction.entity';
import { REPOSITORY } from '~/common/constants/database';
import { CartDto } from './dto/carts.dto';
import { calculateTransaction } from './transaction.calculate';
import { User } from '../user/entity/user.entity';
import { TransactionItem } from './entities/transaction-item.entity';

@Injectable()
export class TransactionService {
  constructor(
    @Inject(REPOSITORY.TRANSACTION)
    private readonly transactionRepository: Repository<Transaction>,

    @Inject(REPOSITORY.TRANSACTION_ITEM)
    private readonly transactionItemRepository: Repository<TransactionItem>,

    @Inject(REPOSITORY.USER)
    private readonly userRepository: Repository<User>,
  ) {}

  // TODO
  async create(createTransactionDto: CartDto, userId: number): Promise<Transaction> {
    console.log('service createTransactionDto: ', createTransactionDto);
    const calculate = calculateTransaction(createTransactionDto);
    console.log('calculate: ', calculate);
    const user = await this.userRepository.findOneByOrFail({ id: userId });
    const transactionItems: TransactionItem[] = [];

    for (const item of calculate.items) {
      const transactionItem = await this.transactionItemRepository.save(item);
      transactionItems.push(transactionItem);
    }

    return await this.transactionRepository.save({
      ...calculate,
      user,
      cashier: user.name,
      items: transactionItems,
    });
  }

  findAll() {
    return `This action returns all transaction`;
  }

  findOne(id: number) {
    return `This action returns a #${id} transaction`;
  }

  update(id: number, updateTransactionDto: TransactionDto) {
    console.log(updateTransactionDto);
    return `This action updates a #${id} transaction`;
  }

  remove(id: number) {
    return `This action removes a #${id} transaction`;
  }
}
