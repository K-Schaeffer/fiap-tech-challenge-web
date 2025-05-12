export interface TransactionProps {
  id?: string;
  type: string;
  date: string;
  value: number;
  currency: string;
  fileBase64?: string;
  fileName?: string;
}

export class Transaction {
  private readonly props: TransactionProps;

  constructor(props: TransactionProps) {
    this.props = props;
  }

  get id(): string | undefined {
    return this.props.id;
  }

  get type(): string {
    return this.props.type;
  }

  get date(): string {
    return this.props.date;
  }

  get value(): number {
    return this.props.value;
  }

  get currency(): string {
    return this.props.currency;
  }

  get fileBase64(): string | undefined {
    return this.props.fileBase64;
  }

  get fileName(): string | undefined {
    return this.props.fileName;
  }
}
