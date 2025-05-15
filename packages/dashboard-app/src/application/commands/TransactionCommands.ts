export interface TransactionCommand {
  type: string;
  value: number;
  fileBase64?: string;
  fileName?: string;
}

export interface TransactionEditCommand extends TransactionCommand {
  id: string;
}
