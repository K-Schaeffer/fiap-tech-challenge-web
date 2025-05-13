import { AccountService } from "@/application/services/AccountService";
import { TransactionService } from "@/application/services/TransactionService";
import { HttpAccountRepository } from "./repositories/HttpAccountRepository";
import { HttpTransactionRepository } from "./repositories/HttpTransactionRepository";

export class ServiceProvider {
  private static instance: ServiceProvider;
  private accountService: AccountService;
  private transactionService: TransactionService;
  private accountRepository: HttpAccountRepository;
  private transactionRepository: HttpTransactionRepository;

  private constructor() {
    this.accountRepository = new HttpAccountRepository();
    this.transactionRepository = new HttpTransactionRepository();

    this.accountService = new AccountService(this.accountRepository);
    this.transactionService = new TransactionService(
      this.transactionRepository,
      this.accountRepository
    );
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
