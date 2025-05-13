export interface AccountAttributes {
  fullName: string;
  firstName: string;
  balance: number;
  currency: string;
}

export class InsufficientFundsError extends Error {
  constructor(available: number, requested: number) {
    super(`Insufficient funds: available ${available}, requested ${requested}`);
    this.name = "InsufficientFundsError";
  }
}

export class Account {
  private readonly attributes: AccountAttributes;

  constructor(attributes: AccountAttributes) {
    this.attributes = attributes;
  }

  validateBalance(value: number): void {
    if (value > this.balance) {
      throw new InsufficientFundsError(this.balance, value);
    }
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
