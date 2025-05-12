import { Transaction, TransactionProps } from "../entities/Transaction";

export interface TransactionRepository {
  getTransactions(): Promise<Transaction[]>;
  addTransaction(transaction: TransactionProps): Promise<Transaction>;
  editTransaction(transaction: TransactionProps): Promise<Transaction>;
  deleteTransaction(id: string): Promise<void>;
}
