import { Account, AccountProps } from "@/domain/entities/Account";
import { AccountRepository } from "@/domain/repositories/AccountRepository";

export class HttpAccountRepository implements AccountRepository {
  private readonly baseUrl = "http://localhost:5000";

  async getAccountInfo(): Promise<Account> {
    const res = await fetch(`${this.baseUrl}/account`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data: AccountProps = await res.json();
    return new Account(data);
  }
}
