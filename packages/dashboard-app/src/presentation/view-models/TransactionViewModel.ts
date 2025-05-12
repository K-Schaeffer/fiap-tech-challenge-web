import { TransactionProps } from "@/domain/entities/Transaction";
import { formatCurrency, formatDate } from "../formatters";

export interface TransactionViewModel {
  id: string;
  formattedDate: string;
  formattedValue: string;
  type: string;
}

export class TransactionViewModelMapper {
  static toViewModel(transaction: TransactionProps): TransactionViewModel {
    return {
      id: transaction.id!,
      formattedDate: formatDate(transaction.date),
      formattedValue: formatCurrency(transaction.value, transaction.currency),
      type: transaction.type,
    };
  }

  static toViewModelList(
    transactions: TransactionProps[]
  ): TransactionViewModel[] {
    return transactions
      .filter(
        (transaction): transaction is Required<TransactionProps> =>
          transaction.id !== undefined
      )
      .map((transaction) => this.toViewModel(transaction));
  }
}
