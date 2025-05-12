import { AccountService } from "@/application/services/AccountService";
import { TransactionService } from "@/application/services/TransactionService";
import { HttpAccountRepository } from "./repositories/HttpAccountRepository";
import { HttpTransactionRepository } from "./repositories/HttpTransactionRepository";

export class ServiceProvider {
  private static instance: ServiceProvider;
  private accountService: AccountService;
  private transactionService: TransactionService;

  private constructor() {
    const accountRepository = new HttpAccountRepository();
    const transactionRepository = new HttpTransactionRepository();

    this.accountService = new AccountService(accountRepository);
    this.transactionService = new TransactionService(transactionRepository);
  }

  public static getInstance(): ServiceProvider {
    if (!ServiceProvider.instance) {
      ServiceProvider.instance = new ServiceProvider();
    }
    return ServiceProvider.instance;
  }

  public getAccountService(): AccountService {
    return this.accountService;
  }

  public getTransactionService(): TransactionService {
    return this.transactionService;
  }
}
