export enum TransactionType {
  DEPOSIT = "Depósito",
  LOAN = "Empréstimo",
  WITHDRAWAL = "Saque",
  TRANSFER = "Transferência",
  PAYMENT = "Pagamento",
  INVESTMENT = "Investimento",
  FINANCING = "Financiamento",
  CURRENCY_EXCHANGE = "Câmbio de moeda",
  DOC_TED = "DOC/TED",
  PIX = "PIX",
}

export interface TransactionAttributes {
  id?: string;
  type: string;
  date: string;
  value: number;
  currency: string;
  fileBase64?: string;
  fileName?: string;
}

export class Transaction {
  private readonly attributes: TransactionAttributes;
  private static readonly MAX_FILE_SIZE = 1048576; // 1MB
  private static readonly ALLOWED_FILE_EXTENSIONS = ["jpg", "jpeg", "png"];

  constructor(attributes: TransactionAttributes) {
    this.attributes = attributes;
  }

  static create(
    attributes: Omit<TransactionAttributes, "value"> & { rawValue: number }
  ): Transaction {
    const value = Transaction.calculateTransactionValue(
      attributes.type,
      attributes.rawValue
    );

    if (attributes.fileBase64 && attributes.fileName) {
      Transaction.validateFile(attributes.fileBase64, attributes.fileName);
    }

    return new Transaction({
      ...attributes,
      value,
    });
  }

  private static calculateTransactionValue(
    type: string,
    value: number
  ): number {
    return this.isCredit(type) ? Math.abs(value) : -Math.abs(value);
  }

  private static isCredit(type: string): boolean {
    return [TransactionType.DEPOSIT, TransactionType.LOAN].includes(
      type as TransactionType
    );
  }

  private static validateFile(fileBase64: string, fileName: string): void {
    const fileSizeInBytes = Math.ceil((fileBase64.length * 3) / 4);
    if (fileSizeInBytes > this.MAX_FILE_SIZE) {
      throw new Error("File size must be less than 1MB");
    }

    const fileExtension = fileName.split(".").pop()?.toLowerCase();
    if (!this.ALLOWED_FILE_EXTENSIONS.includes(fileExtension || "")) {
      throw new Error("Only jpg, jpeg and png files are allowed");
    }
  }

  isCredit(): boolean {
    return Transaction.isCredit(this.type);
  }

  get id(): string | undefined {
    return this.attributes.id;
  }

  get type(): string {
    return this.attributes.type;
  }

  get date(): string {
    return this.attributes.date;
  }

  get value(): number {
    return this.attributes.value;
  }

  get currency(): string {
    return this.attributes.currency;
  }

  get fileBase64(): string | undefined {
    return this.attributes.fileBase64;
  }

  get fileName(): string | undefined {
    return this.attributes.fileName;
  }
}
