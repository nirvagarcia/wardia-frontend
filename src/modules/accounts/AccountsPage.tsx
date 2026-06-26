"use client";

import { BankCredentialsSection } from "./components/credentials-section";
import { AddAccountModal } from "./components/modals/add-account";
import { AddCredentialsModal } from "./components/modals/add-credentials-modal";
import { ConfirmModal } from "@/shared/components/modals/confirm-modal";
import { AccountsHeader } from "./components/accounts-header";
import { AccountsSkeleton } from "./components/accounts-skeleton";
import { AccountsTabs } from "./components/accounts-tabs";
import { DebitStats, CreditStats } from "./components/accounts-stats";
import { DebitAccountsTab } from "./components/debit-accounts-tab";
import { CreditCardsTab } from "./components/credit-cards-tab";
import { useAccountsPage } from "./hooks/use-accounts-page";

export default function AccountsPage() {
  const {
    mounted, isLoading, error, t,
    accounts, cards, credentials,
    activeTab, setActiveTab,
    isAddModalOpen, setIsAddModalOpen,
    isCredentialsModalOpen, setIsCredentialsModalOpen,
    editingCredential, setEditingCredential,
    editingAccount, setEditingAccount,
    editingCard, setEditingCard,
    confirmDelete, setConfirmDelete,
    totalBalance, totalUsedCredit, totalAvailable, formatCurrencyValue,
    addAccount, updateAccount, addCreditCard, updateCreditCard,
    reorderAccounts, reorderCreditCards,
    handleAddClick, handleEditAccount, handleEditCard, handleEditCredentials,
    handleDeleteAccount, handleDeleteCard, confirmDeletion,
    handleDeleteCredential, handleSaveCredential, handleUpdateCredential,
  } = useAccountsPage();

  if (!mounted || isLoading) return <AccountsSkeleton />;

  if (error) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center space-y-4">
        <p className="text-red-500 dark:text-red-400">Error: {error as string}</p>
        <button onClick={() => window.location.reload()} className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600">
          {t("common.back")}
        </button>
      </div>
    </div>
  );

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
            balanceLabel={t("accounts.totalBalance")}
            cardSubtitle={`${accounts.length} ${accounts.length === 1 ? t("accounts.debitCard") : t("accounts.debitCards")}`}
            spentAmount={formatCurrencyValue(totalBalance * 0.15)}
            spentLabel={t("dashboard.spent")}
            thisMonthLabel={t("dashboard.thisMonth")}
          />
        )}

        {activeTab === "credit" && (
          <CreditStats
            availableCredit={formatCurrencyValue(totalAvailable)}
            cardsCount={cards.length}
            cardSubtitle={`${cards.length} ${cards.length === 1 ? t("accounts.creditCard") : t("accounts.creditCards")}`}
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
              onDelete={handleDeleteCredential}
            />
          </div>
        )}
      </section>

      <AddAccountModal
        isOpen={isAddModalOpen}
        onClose={() => { setIsAddModalOpen(false); setEditingAccount(null); setEditingCard(null); }}
        editingAccount={editingAccount}
        editingCard={editingCard}
        onAddAccount={addAccount}
        onAddCard={addCreditCard}
        onUpdateAccount={updateAccount}
        onUpdateCard={updateCreditCard}
      />

      <AddCredentialsModal
        isOpen={isCredentialsModalOpen}
        onClose={() => { setIsCredentialsModalOpen(false); setEditingCredential(null); }}
        editingCredential={editingCredential}
        onSave={handleSaveCredential}
        onUpdate={handleUpdateCredential}
      />

      <ConfirmModal
        isOpen={confirmDelete.isOpen}
        onClose={() => setConfirmDelete({ isOpen: false, type: null, id: null, name: "" })}
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
