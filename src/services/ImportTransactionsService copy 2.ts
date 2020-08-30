import csv from 'csv-parse';
import fs from 'fs';
import path from 'path';
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


class ImportTransactionService {
  public async execute(filename: string): Promise<void> {
    const transactions = await new Promise(resolve => {
      const filePath = path.resolve(__dirname, '..', '..', 'tmp', filename);
      let importedTransactions: Transaction[] = []

      fs.createReadStream(filePath)
        .pipe(csv({ from_line: 2 }))
        .on('data', async data => {
          try {
            const title = data[0].trim();
            const type = data[1].trim();
            const value = Number(data[2].trim());
            const category_title = data[3].trim();

            if (type !== 'income' && type !== 'outcome') {
              throw new AppError('Type is not valid');
            }

            const transactionsRepository = getCustomRepository(
              TransactionsRepository,
            );
            const categoriesRepository = getCustomRepository(
              CategoriesRepository,
            );

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

            importedTransactions.push(transaction);

            await transactionsRepository.save(transaction);
          } catch (err) {
            throw new AppError(err);
          }
          return importedTransactions;
        })
        .on('end', () => {
          resolve(importedTransactions);
        });
    });

    console.log(transactions);
  }
}

export default ImportTransactionService;
