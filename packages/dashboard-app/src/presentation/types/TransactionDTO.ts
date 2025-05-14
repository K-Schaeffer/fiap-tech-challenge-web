export interface TransactionDTO {
  id?: string;
  type: string;
  date?: string;
  value: number;
  currency?: string;
  fileBase64?: string;
  fileName?: string;
}
