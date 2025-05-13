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

  constructor(attributes: TransactionAttributes) {
    this.attributes = attributes;
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
