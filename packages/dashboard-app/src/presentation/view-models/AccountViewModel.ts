import { formatCurrency } from "../formatters";
import { AccountDTO } from "../types/AccountDTO";

export interface AccountViewModel {
  firstName: string;
  fullName: string;
  balance: number;
  currency: string;
  formattedBalance: string;
}

export class AccountViewModelMapper {
  static toViewModel(account: AccountDTO): AccountViewModel {
    return {
      firstName: account.firstName,
      fullName: account.fullName,
      balance: account.balance,
      currency: account.currency,
      formattedBalance: formatCurrency(account.balance, account.currency),
    };
  }
}
