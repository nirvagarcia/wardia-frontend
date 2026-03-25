/**
 * AccountsView - Unified view for all banking products.
 * Refactored for better modularity with extracted sub-components.
 */

"use client";

import React, { useState, useEffect } from "react";
import { usePreferencesStore } from "@/shared/stores/preferences-store";
import { useAccountsStore } from "@/shared/stores/accounts-store";
import { useInitializeAccounts } from "@/shared/hooks/use-initialize-accounts";
import { getTranslation } from "@/shared/langs";
import { formatCurrency } from "@/shared/utils/currency";
import { LoadingState } from "@/shared/components/loading-state";
import { BankCredentialsSection } from "./sections/credentials-section";
import { AddAccountModal } from "./modals/add-account";
import { AddCredentialsModal } from "./modals/credentials/add-credentials-modal";
import { ConfirmModal } from "@/shared/components/modals/confirm-modal";
import { AccountsHeader } from "./components/accounts-header";
import { AccountsTabs } from "./components/accounts-tabs";
import { DebitStats, CreditStats } from "./components/accounts-stats";
import { DebitAccountsTab } from "./components/debit-accounts-tab";
import { CreditCardsTab } from "./components/credit-cards-tab";
import type { IAccount, ICreditCard, IBankCredentials } from "@/shared/types/finance";

type TabType = "debit" | "credit" | "credentials";

export function AccountsView(): React.JSX.Element {
  const [mounted, setMounted] = useState(false);
  const { language, currency } = usePreferencesStore();
  const t = (key: string, vars?: Record<string, string | number>) => 
    getTranslation(language, key, vars);
  
  const { isLoading, error } = useInitializeAccounts();
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const {
    accounts,
    creditCards: cards,
    credentials,
    addAccount,
    updateAccount,
    deleteAccount,
    addCreditCard,
    updateCreditCard,
    deleteCreditCard,
    addCredentials,
    updateCredentials,
    deleteCredentials,
    reorderAccounts,
    reorderCreditCards,
    reorderCredentials,
    getTotalBalance,
    getTotalCreditUsed,
    getTotalCreditAvailable,
  } = useAccountsStore();
  
  const [activeTab, setActiveTab] = useState<TabType>("debit");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCredentialsModalOpen, setIsCredentialsModalOpen] = useState(false);
  const [editingCredential, setEditingCredential] = useState<IBankCredentials | null>(null);
  const [editingAccount, setEditingAccount] = useState<IAccount | null>(null);
  const [editingCard, setEditingCard] = useState<ICreditCard | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{
    isOpen: boolean;
    type: "account" | "card" | null;
    id: string | null;
    name: string;
  }>({
    isOpen: false,
    type: null,
    id: null,
    name: "",
  });

  if (!mounted || isLoading) {
    return <LoadingState message={t("common.loading")} fullScreen />;
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <p className="text-red-500 dark:text-red-400">Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600"
          >
            {t("common.back")}
          </button>
        </div>
      </div>
    );
  }

  const handleAddClick = () => {
    if (activeTab === "credentials") {
      setEditingCredential(null);
      setIsCredentialsModalOpen(true);
    } else {
      setEditingAccount(null);
      setEditingCard(null);
      setIsAddModalOpen(true);
    }
  };

  const handleEditAccount = (account: IAccount) => {
    setEditingAccount(account);
    setEditingCard(null);
    setIsAddModalOpen(true);
  };

  const handleEditCard = (card: ICreditCard) => {
    setEditingCard(card);
    setEditingAccount(null);
    setIsAddModalOpen(true);
  };

  const handleEditCredentials = (credential: IBankCredentials) => {
    setEditingCredential(credential);
    setIsCredentialsModalOpen(true);
  };

  const handleDeleteAccount = (id: string) => {
    const account = accounts.find((acc) => acc.id === id);
    if (account) {
      setConfirmDelete({
        isOpen: true,
        type: "account",
        id,
        name: account.bankName,
      });
    }
  };

  const handleDeleteCard = (id: string) => {
    const card = cards.find((c) => c.id === id);
    if (card) {
      setConfirmDelete({
        isOpen: true,
        type: "card",
        id,
        name: `${card.network.toUpperCase()} *${card.cardNumber.slice(-4)}`,
      });
    }
  };

  const confirmDeletion = () => {
    if (confirmDelete.type === "account" && confirmDelete.id) {
      deleteAccount(confirmDelete.id);
    } else if (confirmDelete.type === "card" && confirmDelete.id) {
      deleteCreditCard(confirmDelete.id);
    }
    setConfirmDelete({ isOpen: false, type: null, id: null, name: "" });
  };

  const totalBalance = getTotalBalance();
  const totalUsedCredit = getTotalCreditUsed();
  const totalAvailable = getTotalCreditAvailable();
  const formatCurrencyValue = (value: number): string => 
    formatCurrency(value, currency, language);

  return (
    <div className="space-y-6">
      <header className="space-y-4">
        <AccountsHeader
          title={t("accounts.title")}
          subtitle={t("accounts.subtitle")}
          onAddClick={handleAddClick}
        />

        <AccountsTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          debitLabel={t("accounts.debit")}
          creditLabel={t("accounts.credit")}
          credentialsLabel={t("credentials.title")}
        />

        {activeTab === "debit" && (
          <DebitStats
            totalBalance={formatCurrencyValue(totalBalance)}
            accountsCount={accounts.length}
            spentAmount={formatCurrencyValue(totalBalance * 0.15)}
            spentLabel={t("dashboard.spent")}
            thisMonthLabel={t("dashboard.thisMonth")}
          />
        )}

        {activeTab === "credit" && (
          <CreditStats
            availableCredit={formatCurrencyValue(totalAvailable)}
            cardsCount={cards.length}
            usedCredit={formatCurrencyValue(totalUsedCredit)}
            availableLabel={t("accounts.available")}
            usedLabel={t("accounts.used")}
            thisMonthLabel={t("dashboard.thisMonth")}
          />
        )}
      </header>

      <section>
        {activeTab === "debit" && (
          <DebitAccountsTab
            accounts={accounts}
            onEdit={handleEditAccount}
            onDelete={handleDeleteAccount}
            onReorder={reorderAccounts}
            noAccountsMessage={t("accounts.noAccounts")}
            addFirstMessage={t("accounts.addFirst")}
            addAccountLabel={t("accounts.addAccount")}
            onAddClick={() => setIsAddModalOpen(true)}
          />
        )}

        {activeTab === "credit" && (
          <CreditCardsTab
            cards={cards}
            onEdit={handleEditCard}
            onDelete={handleDeleteCard}
            onReorder={reorderCreditCards}
            noCardsMessage={t("accounts.noCards")}
            addFirstCardMessage={t("accounts.addFirstCard")}
            addCardLabel={t("accounts.addCard")}
            onAddClick={() => setIsAddModalOpen(true)}
          />
        )}

        {activeTab === "credentials" && (
          <div className="bg-white dark:bg-zinc-950 rounded-2xl p-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
                {t("credentials.accessCredentials")}
              </h2>
            </div>
            <BankCredentialsSection
              credentials={credentials}
              onEdit={handleEditCredentials}
              onDelete={deleteCredentials}
              onReorder={reorderCredentials}
            />
          </div>
        )}
      </section>

      <AddAccountModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingAccount(null);
          setEditingCard(null);
        }}
        editingAccount={editingAccount}
        editingCard={editingCard}
        onAddAccount={addAccount}
        onAddCard={addCreditCard}
        onUpdateAccount={updateAccount}
        onUpdateCard={updateCreditCard}
      />

      <AddCredentialsModal
        isOpen={isCredentialsModalOpen}
        onClose={() => {
          setIsCredentialsModalOpen(false);
          setEditingCredential(null);
        }}
        editingCredential={editingCredential}
        onSave={addCredentials}
        onUpdate={updateCredentials}
      />

      <ConfirmModal
        isOpen={confirmDelete.isOpen}
        onClose={() =>
          setConfirmDelete({ isOpen: false, type: null, id: null, name: "" })
        }
        onConfirm={confirmDeletion}
        title={t("common.confirmDelete")}
        message={t("common.confirmDeleteMessage", { name: confirmDelete.name })}
        confirmText={t("common.delete")}
        cancelText={t("common.cancel")}
        variant="danger"
      />
    </div>
  );
}
