import {
  Transaction,
  TransactionAttributes,
} from "@/domain/entities/Transaction";
import { TransactionRepository } from "@/domain/repositories/TransactionRepository";

export class TransactionService {
  constructor(private readonly transactionRepository: TransactionRepository) {}

  async getTransactions(): Promise<Transaction[]> {
    return this.transactionRepository.getTransactions();
  }

  async addTransaction(
    transaction: TransactionAttributes
  ): Promise<Transaction> {
    return this.transactionRepository.addTransaction(transaction);
  }

  async editTransaction(
    transaction: TransactionAttributes
  ): Promise<Transaction> {
    return this.transactionRepository.editTransaction(transaction);
  }

  async deleteTransaction(id: string): Promise<void> {
    return this.transactionRepository.deleteTransaction(id);
  }
}
