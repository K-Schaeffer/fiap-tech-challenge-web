import { Transaction } from "@/domain/entities/Transaction";
import { AccountRepository } from "@/domain/repositories/AccountRepository";
import { TransactionRepository } from "@/domain/repositories/TransactionRepository";
import {
  TransactionCommand,
  TransactionEditCommand,
} from "../commands/TransactionCommands";
import { CreateTransactionUseCase } from "../usecases/CreateTransactionUseCase";
import { EditTransactionUseCase } from "../usecases/EditTransactionUseCase";

export class TransactionService {
  private readonly createTransactionUseCase: CreateTransactionUseCase;
  private readonly editTransactionUseCase: EditTransactionUseCase;

  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly accountRepository: AccountRepository
  ) {
    this.createTransactionUseCase = new CreateTransactionUseCase(
      transactionRepository,
      accountRepository
    );
    this.editTransactionUseCase = new EditTransactionUseCase(
      transactionRepository,
      accountRepository
    );
  }

  async getTransactions(): Promise<Transaction[]> {
    return this.transactionRepository.getTransactions();
  }

  async addTransaction(transaction: TransactionCommand): Promise<Transaction> {
    return this.createTransactionUseCase.execute(transaction);
  }

  async editTransaction(
    transaction: TransactionEditCommand
  ): Promise<Transaction> {
    return this.editTransactionUseCase.execute(transaction);
  }

  async deleteTransaction(id: string): Promise<void> {
    return this.transactionRepository.deleteTransaction(id);
  }
}
