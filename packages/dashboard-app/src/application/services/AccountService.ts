import { Account } from "@/domain/entities/Account";
import { AccountRepository } from "@/domain/repositories/AccountRepository";

export class AccountService {
  constructor(private readonly accountRepository: AccountRepository) {}

  async getAccountInfo(): Promise<Account> {
    return this.accountRepository.getAccountInfo();
  }
}
