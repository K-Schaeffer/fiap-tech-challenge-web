import {
  Transaction,
  TransactionAttributes,
} from "@/domain/entities/Transaction";
import { TransactionRepository } from "@/domain/repositories/TransactionRepository";
import { HttpClient } from "../utils/HttpClient";

export class HttpTransactionRepository implements TransactionRepository {
  private readonly client: HttpClient;

  constructor() {
    this.client = new HttpClient("http://localhost:5000");
  }

  async getTransactions(): Promise<Transaction[]> {
    const data =
      await this.client.get<TransactionAttributes[]>("/transactions");

    return data.map((transaction) => new Transaction(transaction));
  }

  async addTransaction(
    transaction: TransactionAttributes
  ): Promise<Transaction> {
    const data = await this.client.post<TransactionAttributes>(
      "/transactions",
      transaction
    );

    return new Transaction(data);
  }

  async editTransaction(
    transaction: TransactionAttributes
  ): Promise<Transaction> {
    const data = await this.client.put<TransactionAttributes>(
      `/transactions/${transaction.id}`,
      transaction
    );

    return new Transaction(data);
  }

  async deleteTransaction(id: string): Promise<void> {
    await this.client.delete(`/transactions/${id}`);
  }
}
