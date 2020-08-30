import { Router } from 'express';
import { getCustomRepository } from 'typeorm';
import multer from 'multer';
import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';
import storage from '../config/upload';

const transactionsRouter = Router();
const upload = multer({ storage });

transactionsRouter.get('/', async (request, response) => {
  const transactionsRepository = getCustomRepository(TransactionsRepository);

  const transactions = await transactionsRepository.getTransactions();

  const balance = await transactionsRepository.getBalance();

  return response.json({ transactions, balance });
});

transactionsRouter.post('/', async (request, response) => {
  const { title, value, type, category } = request.body;
  const createTransaction = new CreateTransactionService();
  const transaction = await createTransaction.execute({
    title,
    value,
    type,
    category_title: category,
  });
  response.json(transaction);
});

transactionsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;
  const deleteTransaction = new DeleteTransactionService();
  const transactionDeleted = await deleteTransaction.execute(id);
  response.json(transactionDeleted);
});

transactionsRouter.post(
  '/import',
  upload.single('csv'),
  async (request, response) => {
    const importTransactions = new ImportTransactionsService();
    const importedTransactions = await importTransactions.execute(
      request.file.filename,
    );

    response.json(importedTransactions);
  },
);

export default transactionsRouter;
