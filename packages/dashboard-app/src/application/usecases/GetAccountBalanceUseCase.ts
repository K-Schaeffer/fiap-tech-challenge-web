import { Account } from "@/domain/entities/Account";
import { AccountRepository } from "@/domain/repositories/AccountRepository";

interface AccountBalanceDTO {
  balance: number;
  currency: string;
  formattedBalance: string;
}

export class GetAccountBalanceUseCase {
  constructor(private readonly accountRepository: AccountRepository) {}

  async execute(): Promise<AccountBalanceDTO> {
    const account = await this.accountRepository.getAccountInfo();

    return {
      balance: account.balance,
      currency: account.currency,
      formattedBalance: this.formatBalance(account),
    };
  }

  private formatBalance(account: Account): string {
    return new Intl.NumberFormat("en-BR", {
      style: "currency",
      currency: account.currency,
    }).format(account.balance);
  }
}
