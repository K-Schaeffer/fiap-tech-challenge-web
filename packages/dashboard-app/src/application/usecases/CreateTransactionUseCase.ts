import {
  Transaction,
  TransactionAttributes,
} from "@/domain/entities/Transaction";
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
    if (dto.fileBase64 && dto.fileName) {
      this.validateFile(dto.fileBase64, dto.fileName);
    }

    const isCredit = ["Depósito", "Empréstimo"].includes(dto.type);
    if (!isCredit) {
      await this.validateBalance(dto.value);
    }

    const transaction: TransactionAttributes = {
      ...dto,
      currency: "R$",
      date: new Date().toISOString(),
      value: this.calculateTransactionValue(dto.type, dto.value),
    };

    return this.transactionRepository.addTransaction(transaction);
  }

  private async validateBalance(value: number): Promise<void> {
    const account = await this.accountRepository.getAccountInfo();
    if (value > account.balance) {
      throw new Error("Insufficient funds");
    }
  }

  private validateFile(fileBase64: string, fileName: string): void {
    const fileSizeInBytes = Math.ceil((fileBase64.length * 3) / 4);
    if (fileSizeInBytes > 1048576) {
      throw new Error("File size must be less than 1MB");
    }

    const fileExtension = fileName.split(".").pop()?.toLowerCase();
    if (!["jpg", "jpeg", "png"].includes(fileExtension || "")) {
      throw new Error("Only jpg, jpeg and png files are allowed");
    }
  }

  private calculateTransactionValue(type: string, value: number): number {
    return ["Depósito", "Empréstimo"].includes(type)
      ? Math.abs(value)
      : -Math.abs(value);
  }
}
