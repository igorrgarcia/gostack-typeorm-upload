import csv from 'csv-parse';
import fs from 'fs';
import path from 'path';
import Transaction from '../models/Transaction';
import CreateTransactionService from './CreateTransactionService';

interface Request {
  title: string;
  type: string;
  value: string;
  category: string;
}

class ImportTransactionsService {
  async execute(filename: string): Promise<Transaction[]> {
    const filePath = path.resolve(__dirname, '..', '..', 'tmp', filename);

    const csvTransactions: Transaction[] = [];

    const createTransaction = new CreateTransactionService();

    const importedTransactions = new Promise(
      (resolve, reject): Transaction[] => {
        fs.createReadStream(filePath)
          .pipe(csv())
          .on('data', async data => {
            if (data[0] === 'title') {
              return;
            }

            const title = data[0].trim();
            const type = data[1].trim();
            const value = Number(data[2].trim());
            const category = data[3].trim();

            const transaction = await createTransaction.execute({
              title,
              type,
              value,
              category_title: category,
            });

            csvTransactions.push(transaction);

          })
          .on('end', () => {
            resolve(() => {return csvTransactions});
          });
      },
    );

    const allImportedTransactions = await importedTransactions;
    return allImportedTransactions;
  }
}

export default ImportTransactionsService;
