import { Account } from "../entities/Account";

export interface AccountRepository {
  getAccountInfo(): Promise<Account>;
}
