import { Transaction, TransactionType } from "@/domain/entities/Transaction";
import { AccountRepository } from "@/domain/repositories/AccountRepository";
import { TransactionRepository } from "@/domain/repositories/TransactionRepository";

interface CreateTransactionDTO {
  type: string;
  value: number;
  fileBase64?: string;
  fileName?: string;
}

export class CreateTransactionUseCase {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly accountRepository: AccountRepository
  ) {}

  async execute(dto: CreateTransactionDTO): Promise<Transaction> {
    if (!Object.values(TransactionType).includes(dto.type as TransactionType)) {
      throw new Error("Invalid transaction type");
    }

    if (
      ![TransactionType.DEPOSIT, TransactionType.LOAN].includes(
        dto.type as TransactionType
      )
    ) {
      const account = await this.accountRepository.getAccountInfo();
      account.validateBalance(dto.value);
    }

    const transaction = Transaction.create({
      type: dto.type,
      rawValue: dto.value,
      currency: "R$",
      date: new Date().toISOString(),
      fileBase64: dto.fileBase64,
      fileName: dto.fileName,
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
