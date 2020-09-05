// import AppError from '../errors/AppError';
import { getCustomRepository } from 'typeorm';
import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';
import CategoriesRepository from '../repositories/CategoriesRepository';
import AppError from '../errors/AppError';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category_title: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category_title,
  }: Request): Promise<Transaction> {
    if (type !== 'income' && type !== 'outcome') {
      throw new AppError('Type is not valid');
    }

    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const categoriesRepository = getCustomRepository(CategoriesRepository);

    const balance = (await transactionsRepository.getBalance()).total;

    if (type === 'outcome' && balance - value < 0) {
      throw new AppError('There is not enough balance for this transaction');
    }

    let category = await categoriesRepository.findOne({
      title: category_title,
    });

    if (!category) {
      category = categoriesRepository.create({ title: category_title });
      await categoriesRepository.save(category);
    }

    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category_id: category.id,
    });

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
