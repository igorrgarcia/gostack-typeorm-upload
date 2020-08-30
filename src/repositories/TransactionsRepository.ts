import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getTransactions(): Promise<Transaction[]> {
    const transactions = await this.find();

    transactions.forEach(transaction => {
      // eslint-disable-next-line no-param-reassign
      transaction.value = Number(transaction.value);
    });

    return transactions;
  }

  public async getBalance(): Promise<Balance> {
    const transactions = await this.getTransactions();

    const income = transactions.reduce((acc, cur): number => {
      if (cur.type === 'income') {
        return acc + cur.value;
      }
      return acc;
    }, 0);

    const outcome = transactions.reduce((acc, cur): number => {
      if (cur.type === 'outcome') {
        return acc + cur.value;
      }
      return acc;
    }, 0);

    const balance = {
      income,
      outcome,
      total: income - outcome,
    };

    return balance;
  }
}

export default TransactionsRepository;
