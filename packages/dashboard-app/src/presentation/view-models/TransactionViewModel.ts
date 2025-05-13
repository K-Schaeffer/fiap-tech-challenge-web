import { TransactionAttributes } from "@/domain/entities/Transaction";
import { formatCurrency, formatDate } from "../formatters";

export interface TransactionViewModel {
  id: string;
  formattedDate: string;
  formattedValue: string;
  type: string;
}

export class TransactionViewModelMapper {
  static toViewModel(transaction: TransactionAttributes): TransactionViewModel {
    return {
      id: transaction.id!,
      formattedDate: formatDate(transaction.date),
      formattedValue: formatCurrency(transaction.value, transaction.currency),
      type: transaction.type,
    };
  }

  static toViewModelList(
    transactions: TransactionAttributes[]
  ): TransactionViewModel[] {
    return transactions
      .filter(
        (transaction): transaction is Required<TransactionAttributes> =>
          transaction.id !== undefined
      )
      .map((transaction) => this.toViewModel(transaction));
  }
}
