export interface AccountAttributes {
  fullName: string;
  firstName: string;
  balance: number;
  currency: string;
}

export class Account {
  private readonly attributes: AccountAttributes;

  constructor(attributes: AccountAttributes) {
    this.attributes = attributes;
  }

  get fullName(): string {
    return this.attributes.fullName;
  }

  get firstName(): string {
    return this.attributes.firstName;
  }

  get balance(): number {
    return this.attributes.balance;
  }

  get currency(): string {
    return this.attributes.currency;
  }
}
