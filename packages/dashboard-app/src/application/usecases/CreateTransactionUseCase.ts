import { Transaction, TransactionType } from "@/domain/entities/Transaction";
import { AccountRepository } from "@/domain/repositories/AccountRepository";
import { TransactionRepository } from "@/domain/repositories/TransactionRepository";
import { TransactionCommand } from "../commands/TransactionCommands";

export class CreateTransactionUseCase {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly accountRepository: AccountRepository
  ) {}

  async execute(command: TransactionCommand): Promise<Transaction> {
    if (
      !Object.values(TransactionType).includes(command.type as TransactionType)
    ) {
      throw new Error("Invalid transaction type");
    }

    if (
      ![TransactionType.DEPOSIT, TransactionType.LOAN].includes(
        command.type as TransactionType
      )
    ) {
      const account = await this.accountRepository.getAccountInfo();
      account.validateBalance(command.value);
    }

    const transaction = Transaction.create({
      type: command.type,
      rawValue: command.value,
      currency: "R$",
      date: new Date().toISOString(),
      fileBase64: command.fileBase64,
      fileName: command.fileName,
    });

    return this.transactionRepository.addTransaction({
      type: transaction.type,
      value: transaction.value,
      currency: transaction.currency,
      date: transaction.date,
      fileBase64: transaction.fileBase64,
      fileName: transaction.fileName,
    });
  }
}
