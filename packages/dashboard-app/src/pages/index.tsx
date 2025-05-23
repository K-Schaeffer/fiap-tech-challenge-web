import { initializeHttpServices } from "@/infrastructure/configuration/HttpServiceConfiguration";
import AccountDashboard from "@/presentation/components/AccountDashboard";
import { MENU_ITEMS } from "@/presentation/constants/menuItems";
import { TransactionDTO } from "@/presentation/types/TransactionDTO";
import Head from "next/head";
import { useCallback, useMemo, useState } from "react";

export default function DashboardView() {
  const { accountService, transactionService } = useMemo(
    () => initializeHttpServices(),
    []
  );

  const [localAccount, setLocalAccount] = useState({
    fullName: "",
    firstName: "",
    balance: 0,
    currency: "",
  });
  const [localTransactions, setLocalTransactions] = useState<TransactionDTO[]>(
    []
  );

  const fetchAccount = useCallback(async () => {
    const account = await accountService.getAccountInfo();
    setLocalAccount({
      fullName: account.fullName,
      firstName: account.firstName,
      balance: account.balance,
      currency: account.currency,
    });
  }, [accountService]);

  const fetchTransactions = useCallback(async () => {
    const transactions = await transactionService.getTransactions();
    setLocalTransactions(
      transactions.map((t) => ({
        id: t.id,
        type: t.type,
        date: t.date,
        value: t.value,
        currency: t.currency,
        fileBase64: t.fileBase64,
        fileName: t.fileName,
      }))
    );
  }, [transactionService]);

  const getInitialData = useCallback(async () => {
    await fetchAccount();
    await fetchTransactions();
  }, [fetchAccount, fetchTransactions]);

  const submitAddTransaction = useCallback(
    async (transaction: TransactionDTO) => {
      await transactionService.addTransaction(transaction);
      await fetchTransactions();
    },
    [transactionService, fetchTransactions]
  );

  const submitEditTransaction = useCallback(
    async (transaction: TransactionDTO) => {
      if (!transaction.id) return;

      await transactionService.editTransaction({
        ...transaction,
        id: transaction.id as string,
      });
      await fetchTransactions();
    },
    [transactionService, fetchTransactions]
  );

  const submitDeleteTransaction = useCallback(
    async (transactionId: string) => {
      await transactionService.deleteTransaction(transactionId);
      await fetchTransactions();
    },
    [transactionService, fetchTransactions]
  );

  return (
    <>
      <Head>
        <title>Dashboard</title>
        <meta name="description" content="By FIAP Tech Challenge" />
      </Head>
      <AccountDashboard
        menuItems={MENU_ITEMS}
        account={localAccount}
        transactionList={localTransactions}
        getInitialData={getInitialData}
        submitAddTransaction={submitAddTransaction}
        submitEditTransaction={submitEditTransaction}
        submitDeleteTransaction={submitDeleteTransaction}
      />
    </>
  );
}
