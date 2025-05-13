import { Account } from "@/domain/entities/Account";
import { formatCurrency } from "../formatters";

export interface AccountViewModel {
  firstName: string;
  fullName: string;
  balance: number;
  currency: string;
  formattedBalance: string;
}

export class AccountViewModelMapper {
  static toViewModel(account: Account): AccountViewModel {
    return {
      firstName: account.firstName,
      fullName: account.fullName,
      balance: account.balance,
      currency: account.currency,
      formattedBalance: formatCurrency(account.balance, account.currency),
    };
  }
}
