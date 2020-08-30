// import AppError from '../errors/AppError';
import { getCustomRepository } from 'typeorm';
import TransactionsRepository from '../repositories/TransactionsRepository';
import AppError from '../errors/AppError';

interface Resp {
  message: string;
}

class DeleteTransactionService {
  public async execute(id: string): Promise<Resp> {
    const transactionRepository = getCustomRepository(TransactionsRepository);
    const transaction = transactionRepository.findOne({ id });

    if (!transaction) {
      throw new AppError('Transaction ID not found');
    }

    await transactionRepository.delete({ id });

    return { message: `Transaction ID ${id} deleted` };
  }
}

export default DeleteTransactionService;
