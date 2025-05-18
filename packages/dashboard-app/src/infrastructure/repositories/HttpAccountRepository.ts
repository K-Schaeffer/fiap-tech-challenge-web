import { Account, AccountAttributes } from "@/domain/entities/Account";
import { AccountRepository } from "@/domain/repositories/AccountRepository";
import { HttpClient } from "../utils/HttpClient";

export class HttpAccountRepository implements AccountRepository {
  private readonly client: HttpClient;

  constructor() {
    this.client = new HttpClient("http://localhost:5000");
  }

  async getAccountInfo(): Promise<Account> {
    const data = await this.client.get<AccountAttributes>("/account");

    return new Account(data);
  }
}
