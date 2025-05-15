import { Transaction, TransactionAttributes } from "../entities/Transaction";

export interface TransactionRepository {
  getTransactions(): Promise<Transaction[]>;
  addTransaction(transaction: TransactionAttributes): Promise<Transaction>;
  editTransaction(transaction: TransactionAttributes): Promise<Transaction>;
  deleteTransaction(id: string): Promise<void>;
}
