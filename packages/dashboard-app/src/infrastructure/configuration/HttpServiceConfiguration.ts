import { AccountService } from "@/application/services/AccountService";
import { TransactionService } from "@/application/services/TransactionService";
import { HttpAccountRepository } from "../repositories/HttpAccountRepository";
import { HttpTransactionRepository } from "../repositories/HttpTransactionRepository";

export interface HttpServices {
  accountService: AccountService;
  transactionService: TransactionService;
}

let httpServices: HttpServices | null = null;

export function initializeHttpServices(): HttpServices {
  if (!httpServices) {
    const repositories = {
      accountRepository: new HttpAccountRepository(),
      transactionRepository: new HttpTransactionRepository(),
    };

    httpServices = {
      accountService: new AccountService(repositories.accountRepository),
      transactionService: new TransactionService(
        repositories.transactionRepository,
        repositories.accountRepository
      ),
    };
  }

  return httpServices;
}
