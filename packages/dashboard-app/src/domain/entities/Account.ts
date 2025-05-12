export interface AccountProps {
  fullName: string;
  firstName: string;
  balance: number;
  currency: string;
}

export class Account {
  private readonly props: AccountProps;

  constructor(props: AccountProps) {
    this.props = props;
  }

  get fullName(): string {
    return this.props.fullName;
  }

  get firstName(): string {
    return this.props.firstName;
  }

  get balance(): number {
    return this.props.balance;
  }

  get currency(): string {
    return this.props.currency;
  }
}
