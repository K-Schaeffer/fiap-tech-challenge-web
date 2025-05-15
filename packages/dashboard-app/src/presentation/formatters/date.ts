import { MONTHS } from "../constants/months";

const formatMonth = (_date: string): string => {
  const date = new Date(_date);
  const monthIndex = date.getMonth();
  return MONTHS[monthIndex];
};

export const formatDate = (_date: string): string => {
  const date = new Date(_date);
  return `${date.getDate() < 10 ? "0" + date.getDate() : date.getDate()} de ${formatMonth(_date)} ${date.getFullYear()}`;
};

export const getFormattedDateNow = (): string => {
  const date = new Date();
  return date.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};
