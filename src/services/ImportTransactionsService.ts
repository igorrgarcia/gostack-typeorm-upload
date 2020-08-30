import csv from 'csv-parse';
import fs from 'fs';
import path from 'path';

interface CsvTransactions {
  title: string;
  type: string;
  value: number;
  category: string;
}

class ImportTransactionService {
  public async execute(filename: string): Promise<void> {
    const filePath = path.resolve('tmp', filename);
    const fileStream = fs.createReadStream(filePath);
    const csvParser = csv({ from_line: 2 });
    const csvParsed = fileStream.pipe(csvParser);

    // const transactions: CsvTransactions = [];
    const categories: string[] = [];

    csvParsed.on('data', async line => {
      const [title, type, value, category] = line.map((cell: string) =>
        cell.trim(),
      );

      if (!title || !type || !value) return;

      categories.push(category);

    });
    console.log(categories);
  }
}

export default ImportTransactionService;
