"use client";

/**
 * Accounts & Cards Page - Unified view for all banking products.
 * Now with full i18n support and proper light/dark mode styling.
 */

import React, { useState } from "react";
import { usePreferencesStore } from "@/store/preferences-store";
import { getTranslation } from "@/lib/i18n";
import { mockAccounts, mockCreditCards, mockBankCredentials } from "@/lib/mock-data";
import { AccountCard } from "@/components/features/account-card";
import { CreditCardDisplay } from "@/components/features/credit-card-display";
import { BankCredentialsSection } from "@/components/features/bank-credentials-section";
import { AddAccountModal } from "@/components/modals/add-account-modal";
import { Wallet, Plus, TrendingUp, AlertCircle, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import type { IAccount, ICreditCard, IBankCredentials } from "@/types/finance";

type TabType = "debit" | "credit" | "credentials";

export default function AccountsPage(): React.JSX.Element {
  const { language, currency } = usePreferencesStore();
  const t = (key: string) => getTranslation(language, key);
  const [activeTab, setActiveTab] = useState<TabType>("debit");

  // Local state for accounts, cards, and credentials
  const [accounts, setAccounts] = useState<IAccount[]>(mockAccounts);
  const [cards, setCards] = useState<ICreditCard[]>(mockCreditCards);
  const [credentials] = useState<IBankCredentials[]>(mockBankCredentials);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleAddAccount = (newAccount: Omit<IAccount, "id" | "lastUpdated">) => {
    const accountWithId: IAccount = {
      ...newAccount,
      id: `account-${Date.now()}`,
      lastUpdated: new Date(),
    };
    setAccounts([...accounts, accountWithId]);
  };

  const handleAddCard = (newCard: Omit<ICreditCard, "id" | "lastStatementDate" | "nextPaymentDate" | "minimumPayment">) => {
    const now = new Date();
    const cardWithId: ICreditCard = {
      ...newCard,
      id: `card-${Date.now()}`,
      lastStatementDate: new Date(now.getFullYear(), now.getMonth(), newCard.cutoffDay),
      nextPaymentDate: new Date(now.getFullYear(), now.getMonth() + 1, newCard.paymentDueDay),
      minimumPayment: {
        value: newCard.usedCredit.value * 0.05, // 5% minimum payment
        currency: newCard.usedCredit.currency,
      },
    };
    setCards([...cards, cardWithId]);
  };

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance.value, 0);
  const totalUsedCredit = cards.reduce((sum, card) => sum + card.usedCredit.value, 0);
  const totalAvailable = cards.reduce((sum, card) => sum + card.availableCredit.value, 0);

  const formatCurrency = (value: number): string => {
    const locale = language === "es" ? "es-PE" : "en-US";
    const formatter = new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
    });
    return formatter.format(value);
  };

  return (
    <div className="min-h-screen p-6 space-y-6 pb-24 bg-white dark:bg-zinc-950">
      {/* Header */}
      <header className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2 text-zinc-900 dark:text-white">
              <Wallet className="w-8 h-8 text-emerald-500 dark:text-emerald-400" />
              {t("accounts.title")}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">{t("accounts.subtitle")}</p>
          </div>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-700 p-3 rounded-xl transition-colors text-white"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="grid grid-cols-3 gap-2 bg-zinc-100 dark:bg-zinc-900/50 backdrop-blur-sm border border-zinc-200 dark:border-zinc-800 rounded-xl p-1">
          <button
            onClick={() => setActiveTab("debit")}
            className={cn(
              "py-3 px-4 rounded-lg font-medium transition-all",
              activeTab === "debit"
                ? "bg-emerald-600 text-white shadow-lg"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            )}
          >
            {t("accounts.debit")}
          </button>
          <button
            onClick={() => setActiveTab("credit")}
            className={cn(
              "py-3 px-4 rounded-lg font-medium transition-all",
              activeTab === "credit"
                ? "bg-emerald-600 text-white shadow-lg"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            )}
          >
            {t("accounts.credit")}
          </button>
          <button
            onClick={() => setActiveTab("credentials")}
            className={cn(
              "py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2",
              activeTab === "credentials"
                ? "bg-emerald-600 text-white shadow-lg"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
            )}
          >
            <Shield className="w-4 h-4" />
            {language === "es" ? "Credenciales" : "Credentials"}
          </button>
        </div>

        {/* Summary Cards Based on Active Tab */}
        {activeTab === "debit" ? (
          <div className="bg-gradient-to-br from-zinc-800 to-zinc-900 dark:from-zinc-900 dark:to-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-2xl p-6">
            <p className="text-sm text-gray-200 dark:text-gray-400 mb-2">{t("accounts.totalBalance")}</p>
            <p className="text-4xl font-bold text-white">{formatCurrency(totalBalance)}</p>
            <p className="text-sm text-emerald-300 dark:text-emerald-400 mt-2">
              {accounts.length} {t("accounts.bankAccounts")}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-zinc-100 dark:bg-zinc-900/50 backdrop-blur-sm border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
                <span className="text-sm text-gray-600 dark:text-gray-400">{t("accounts.available")}</span>
              </div>
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {formatCurrency(totalAvailable)}
              </p>
            </div>

            <div className="bg-zinc-100 dark:bg-zinc-900/50 backdrop-blur-sm border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="w-5 h-5 text-red-500 dark:text-red-400" />
                <span className="text-sm text-gray-600 dark:text-gray-400">{t("accounts.used")}</span>
              </div>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                {formatCurrency(totalUsedCredit)}
              </p>
            </div>
          </div>
        )}
      </header>

      {/* Content Based on Active Tab */}
      <section className="space-y-4">
        {activeTab === "debit" ? (
          <>
            {accounts.map((account) => (
              <AccountCard key={account.id} account={account} />
            ))}
            
            {accounts.length === 0 && (
              <div className="text-center py-12">
                <Wallet className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-zinc-900 dark:text-white">{t("accounts.noAccounts")}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">{t("accounts.addFirst")}</p>
                <button 
                  onClick={() => setIsAddModalOpen(true)}
                  className="bg-emerald-600 hover:bg-emerald-700 px-6 py-3 rounded-lg font-medium transition-colors text-white"
                >
                  {t("accounts.addAccount")}
                </button>
              </div>
            )}
          </>
        ) : activeTab === "credit" ? (
          <>
            {cards.map((card) => (
              <CreditCardDisplay key={card.id} card={card} />
            ))}
            
            {cards.length === 0 && (
              <div className="text-center py-12">
                <Wallet className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-zinc-900 dark:text-white">{t("accounts.noCards")}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">{t("accounts.addFirstCard")}</p>
                <button 
                  onClick={() => setIsAddModalOpen(true)}
                  className="bg-emerald-600 hover:bg-emerald-700 px-6 py-3 rounded-lg font-medium transition-colors text-white"
                >
                  {t("accounts.addCard")}
                </button>
              </div>
            )}
          </>
        ) : (
          // Credentials Tab
          <div className="bg-white dark:bg-zinc-950 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-6">
              <Shield className="w-6 h-6 text-blue-500 dark:text-blue-400" />
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
                {language === "es" ? "Credenciales Bancarias" : "Bank Credentials"}
              </h2>
            </div>
            <BankCredentialsSection credentials={credentials} />
          </div>
        )}
      </section>

      {/* Add Account/Card Modal */}
      <AddAccountModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddAccount={handleAddAccount}
        onAddCard={handleAddCard}
      />
    </div>
  );
}
