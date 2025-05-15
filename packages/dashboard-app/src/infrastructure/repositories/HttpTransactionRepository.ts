import {
  Transaction,
  TransactionAttributes,
} from "@/domain/entities/Transaction";
import { TransactionRepository } from "@/domain/repositories/TransactionRepository";

export class HttpTransactionRepository implements TransactionRepository {
  private readonly baseUrl = "http://localhost:5000";

  async getTransactions(): Promise<Transaction[]> {
    const res = await fetch(`${this.baseUrl}/transactions`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    const data: TransactionAttributes[] = await res.json();
    return data.map((transaction) => new Transaction(transaction));
  }

  async addTransaction(
    transaction: TransactionAttributes
  ): Promise<Transaction> {
    const res = await fetch(`${this.baseUrl}/transactions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(transaction),
    });

    const data: TransactionAttributes = await res.json();
    return new Transaction(data);
  }

  async editTransaction(
    transaction: TransactionAttributes
  ): Promise<Transaction> {
    const res = await fetch(`${this.baseUrl}/transactions/${transaction.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(transaction),
    });

    const data: TransactionAttributes = await res.json();
    return new Transaction(data);
  }

  async deleteTransaction(id: string): Promise<void> {
    await fetch(`${this.baseUrl}/transactions/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
