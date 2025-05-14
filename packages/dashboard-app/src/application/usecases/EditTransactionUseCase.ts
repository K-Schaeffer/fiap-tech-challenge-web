import { Transaction, TransactionType } from "@/domain/entities/Transaction";
import { AccountRepository } from "@/domain/repositories/AccountRepository";
import { TransactionRepository } from "@/domain/repositories/TransactionRepository";
import { TransactionEditCommand } from "../commands/TransactionCommands";

export class EditTransactionUseCase {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly accountRepository: AccountRepository
  ) {}

  async execute(command: TransactionEditCommand): Promise<Transaction> {
    if (!command.id) {
      throw new Error("Transaction ID is required");
    }

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
      id: command.id,
      type: command.type,
      rawValue: command.value,
      currency: "R$",
      date: new Date().toISOString(),
      fileBase64: command.fileBase64,
      fileName: command.fileName,
    });

    return this.transactionRepository.editTransaction({
      id: transaction.id,
      type: transaction.type,
      value: transaction.value,
      currency: transaction.currency,
      date: transaction.date,
      fileBase64: transaction.fileBase64,
      fileName: transaction.fileName,
    });
  }
}
