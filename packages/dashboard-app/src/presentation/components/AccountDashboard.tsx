"use client";
import { AccountAttributes } from "@/domain/entities/Account";
import { TransactionAttributes } from "@/domain/entities/Transaction";
import { formatCurrency, getFormattedDateNow } from "@/presentation/formatters";
import { TransactionViewModelMapper } from "@/presentation/view-models/TransactionViewModel";
import { Container, Grid2 } from "@mui/material";
import {
  FAccountSummaryCard,
  FCard,
  FInvestmentsCard,
  FMenuList,
  FMenuListItem,
  FModal,
  FTransactionForm,
  FTransactionFormCard,
  FTransactionFormItem,
  FTransactionFormItemInput,
  FTransactionListCard,
} from "components";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface AccountDashboardProps {
  menuItems: FMenuListItem[];
  account: AccountAttributes;
  transactionList: TransactionAttributes[];
  getInitialData: () => void;
  submitAddTransaction?: (
    transaction: Omit<TransactionAttributes, "id">
  ) => void;
  submitEditTransaction?: (transaction: TransactionAttributes) => void;
  submitDeleteTransaction?: (transactionId: string) => void;
}

export default function AccountDashboard({
  menuItems,
  account,
  transactionList,
  getInitialData,
  submitAddTransaction,
  submitEditTransaction,
  submitDeleteTransaction,
}: AccountDashboardProps) {
  useEffect(() => {
    getInitialData();
  }, [getInitialData]);

  const formattedBalance = formatCurrency(account.balance, account.currency);
  const formattedDate = getFormattedDateNow();
  const pathname = usePathname();

  const currentMenuItems = menuItems.map((item) => ({
    ...item,
    current: item.path === pathname,
  }));

  const formattedTransactions =
    TransactionViewModelMapper.toViewModelList(transactionList);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTransaction, setCurrentTransaction] =
    useState<FTransactionFormItem>();

  const openEditModal = (transactionId: string) => {
    const transaction = transactionList.find(({ id }) => id === transactionId);
    if (transaction) {
      setCurrentTransaction({
        id: transaction.id!,
        type: transaction.type,
        value: transaction.value,
      });
    }
    setIsModalOpen(true);
  };

  const handleEditTransaction = (transaction: FTransactionFormItem) => {
    if (!submitEditTransaction || !currentTransaction?.id) {
      return;
    }

    const editedTransaction: TransactionAttributes = {
      ...transaction,
      id: currentTransaction.id,
      currency: "R$",
      date: new Date().toISOString(),
    };

    submitEditTransaction(editedTransaction);
  };

  const handleAddTransaction = (transaction: FTransactionFormItemInput) => {
    if (!submitAddTransaction) {
      return;
    }

    const newTransaction: Omit<TransactionAttributes, "id"> = {
      ...transaction,
      currency: "R$",
      date: new Date().toISOString(),
    };

    submitAddTransaction(newTransaction);
  };

  return (
    <main
      style={{
        minWidth: "100%",
        minHeight: "100%",
        backgroundColor: "var(--mui-palette-tertiary-light)",
      }}
    >
      <Container maxWidth="xl">
        <Grid2 container spacing={3} paddingTop={3} paddingBottom={3}>
          <Grid2 size={{ xs: 0, lg: 2 }}>
            <FCard
              options={{
                sx: {
                  display: { xs: "none", lg: "block" },
                },
              }}
            >
              <FMenuList menuItems={currentMenuItems}>
                <Link href="" />
              </FMenuList>
            </FCard>
          </Grid2>

          <Grid2
            size={{ xs: 12, lg: 6 }}
            display="flex"
            flexDirection="column"
            gap={3}
          >
            <FAccountSummaryCard
              firstName={account.firstName}
              currency={account.currency}
              balance={formattedBalance}
              date={formattedDate}
            >
              <Image src="/assets/card-pixels-2.svg" alt="" fill />
              <Image src="/assets/card-pixels-1.svg" alt="" fill />
              <Image src="/assets/card-illustration-1.svg" alt="" fill />
            </FAccountSummaryCard>
            <FTransactionFormCard
              addTransaction={handleAddTransaction}
              accountBalance={account.balance}
            >
              <Image src="/assets/card-pixels-3.svg" alt="" layout="fill" />
              <Image src="/assets/card-pixels-4.svg" alt="" layout="fill" />
              <Image
                src="/assets/card-illustration-2.svg"
                alt=""
                layout="fill"
              />
            </FTransactionFormCard>
            <FInvestmentsCard>
              <Image src="/assets/card-pixels-3.svg" alt="" layout="fill" />
              <Image src="/assets/card-pixels-4.svg" alt="" layout="fill" />
            </FInvestmentsCard>
          </Grid2>

          <Grid2 size={{ xs: 12, lg: 4 }}>
            <FTransactionListCard
              transactionItems={formattedTransactions}
              editTransaction={openEditModal}
              deleteTransaction={submitDeleteTransaction}
            />
          </Grid2>
        </Grid2>
        <FModal
          title="Editar transação"
          isOpen={isModalOpen}
          handleClose={() => setIsModalOpen(false)}
        >
          <FTransactionForm
            accountBalance={account.balance}
            currentTransaction={currentTransaction}
            editTransaction={handleEditTransaction}
            closeEditModal={() => setIsModalOpen(false)}
            buttonText="Concluir edição"
          />
        </FModal>
      </Container>
    </main>
  );
}
