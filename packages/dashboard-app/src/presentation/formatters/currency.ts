export const formatCurrency = (value: number, currency: string): string => {
  return value < 0
    ? `-${currency} ${(Number(value) * -1)?.toFixed(2).replace(".", ",")}`
    : `${currency} ${Number(value)?.toFixed(2).replace(".", ",")}`;
};
