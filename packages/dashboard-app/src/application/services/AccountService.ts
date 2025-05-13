import { Account } from "@/domain/entities/Account";
import { AccountRepository } from "@/domain/repositories/AccountRepository";
import { GetAccountBalanceUseCase } from "../usecases/GetAccountBalanceUseCase";

export class AccountService {
  private readonly getAccountBalanceUseCase: GetAccountBalanceUseCase;

  constructor(private readonly accountRepository: AccountRepository) {
    this.getAccountBalanceUseCase = new GetAccountBalanceUseCase(
      accountRepository
    );
  }

  async getAccountInfo(): Promise<Account> {
    return this.accountRepository.getAccountInfo();
  }

  async getBalance() {
    return this.getAccountBalanceUseCase.execute();
  }
}
