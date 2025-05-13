import { Transaction, TransactionType } from "@/domain/entities/Transaction";
import { AccountRepository } from "@/domain/repositories/AccountRepository";
import { TransactionRepository } from "@/domain/repositories/TransactionRepository";

interface EditTransactionDTO {
  id: string;
  type: string;
  value: number;
  fileBase64?: string;
  fileName?: string;
}

export class EditTransactionUseCase {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly accountRepository: AccountRepository
  ) {}

  async execute(dto: EditTransactionDTO): Promise<Transaction> {
    if (!dto.id) {
      throw new Error("Transaction ID is required");
    }

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

    // Create transaction through the domain entity
    const transaction = Transaction.create({
      id: dto.id,
      type: dto.type,
      rawValue: dto.value,
      currency: "R$",
      date: new Date().toISOString(),
      fileBase64: dto.fileBase64,
      fileName: dto.fileName,
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
