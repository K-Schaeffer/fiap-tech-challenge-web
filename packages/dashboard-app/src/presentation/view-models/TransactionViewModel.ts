import { formatCurrency, formatDate } from "../formatters";
import { TransactionDTO } from "../types/TransactionDTO";

export interface TransactionViewModel {
  id: string;
  formattedDate: string;
  formattedValue: string;
  type: string;
}

export class TransactionViewModelMapper {
  static toViewModel(transaction: TransactionDTO): TransactionViewModel {
    return {
      id: transaction.id!,
      formattedDate: formatDate(transaction.date ?? new Date().toISOString()),
      formattedValue: formatCurrency(
        transaction.value,
        transaction.currency ?? "BRL"
      ),
      type: transaction.type,
    };
  }

  static toViewModelList(
    transactions: TransactionDTO[]
  ): TransactionViewModel[] {
    return transactions
      .filter(
        (transaction): transaction is Required<TransactionDTO> =>
          transaction.id !== undefined
      )
      .map((transaction) => this.toViewModel(transaction));
  }
}
