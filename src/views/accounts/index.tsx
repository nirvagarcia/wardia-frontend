/**
 * AccountsView - Unified view for all banking products.
 * Extracted from page.tsx for better modularity and maintainability.
 * Now with full i18n support and proper light/dark mode styling.
 */

"use client";

import React, { useState } from "react";
import { usePreferencesStore } from "@/shared/stores/preferences-store";
import { getTranslation } from "@/shared/langs";
import { mockAccounts, mockCreditCards, mockBankCredentials } from "@/shared/utils/mock";
import { BankCredentialsSection } from "./sections/credentials-section";
import { AddAccountModal } from "./modals/add-account";
import { AddCredentialsModal } from "./modals/credentials/add-credentials-modal";
import { ConfirmModal } from "@/shared/components/modals/confirm-modal";
import { Wallet, Plus } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import type { IAccount, ICreditCard, IBankCredentials } from "@/shared/types/finance";
import { SortableAccountCard } from "./components/sortable-account-card";
import { SortableCreditCard } from "./components/sortable-credit-card";
import {
  formatCurrency,
  calculateTotalBalance,
  calculateTotalUsedCredit,
  calculateTotalAvailable,
  createNewAccount,
  createNewCard,
  updateAccount,
  updateCard,
  createNewCredentials,
  updateCredentials,
} from "./utils/helpers";

type TabType = "debit" | "credit" | "credentials";

export function AccountsView(): React.JSX.Element {
  const { language, currency } = usePreferencesStore();
  const t = (key: string, vars?: Record<string, string | number>) => 
    getTranslation(language, key, vars);
  const [activeTab, setActiveTab] = useState<TabType>("debit");

  const [accounts, setAccounts] = useState<IAccount[]>(mockAccounts);
  const [cards, setCards] = useState<ICreditCard[]>(mockCreditCards);
  const [credentials, setCredentials] = useState<IBankCredentials[]>(mockBankCredentials);
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

  const handleAddAccount = (newAccountData: Omit<IAccount, "id" | "lastUpdated">) => {
    const newAccount = createNewAccount(newAccountData);
    setAccounts([...accounts, newAccount]);
  };

  const handleAddCard = (
    newCardData: Omit<ICreditCard, "id" | "lastStatementDate" | "nextPaymentDate" | "minimumPayment">
  ) => {
    const newCard = createNewCard(newCardData);
    setCards([...cards, newCard]);
  };

  const handleUpdateAccount = (
    id: string,
    updatedAccountData: Omit<IAccount, "id" | "lastUpdated">
  ) => {
    setAccounts(
      accounts.map((acc) => (acc.id === id ? updateAccount(id, updatedAccountData) : acc))
    );
  };

  const handleUpdateCard = (
    id: string,
    updatedCardData: Omit<ICreditCard, "id" | "lastStatementDate" | "nextPaymentDate" | "minimumPayment">
  ) => {
    setCards(cards.map((card) => (card.id === id ? updateCard(id, updatedCardData) : card)));
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

  const handleAddCredentials = (newCredData: Omit<IBankCredentials, "id" | "lastUpdated">) => {
    const newCred = createNewCredentials(newCredData);
    setCredentials([...credentials, newCred]);
  };

  const handleUpdateCredentials = (
    id: string,
    updatedCredData: Omit<IBankCredentials, "id" | "lastUpdated">
  ) => {
    setCredentials(
      credentials.map((cred) =>
        cred.id === id ? updateCredentials(id, updatedCredData) : cred
      )
    );
  };

  const handleEditCredentials = (credential: IBankCredentials) => {
    setEditingCredential(credential);
    setIsCredentialsModalOpen(true);
  };

  const handleDeleteCredentials = (id: string) => {
    setCredentials(credentials.filter((cred) => cred.id !== id));
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
      setAccounts(accounts.filter((acc) => acc.id !== confirmDelete.id));
    } else if (confirmDelete.type === "card" && confirmDelete.id) {
      setCards(cards.filter((card) => card.id !== confirmDelete.id));
    }
    setConfirmDelete({ isOpen: false, type: null, id: null, name: "" });
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEndAccounts = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setAccounts((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleDragEndCards = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setCards((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const totalBalance = calculateTotalBalance(accounts);
  const totalUsedCredit = calculateTotalUsedCredit(cards);
  const totalAvailable = calculateTotalAvailable(cards);

  const formatCurrencyValue = (value: number): string => 
    formatCurrency(value, currency, language);

  return (
    <div className="space-y-6">
      <header className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2.5 text-zinc-900 dark:text-white tracking-tight">
              <div className="bg-cyan-500/10 p-2 rounded-xl ring-1 ring-cyan-500/10">
                <Wallet className="w-5 h-5 md:w-6 md:h-6 text-cyan-500 dark:text-cyan-400" />
              </div>
              {t("accounts.title")}
            </h1>
            <p className="text-sm md:text-base text-zinc-500 dark:text-zinc-500 mt-1">{t("accounts.subtitle")}</p>
          </div>
          <button
            onClick={() => {
              if (activeTab === "credentials") {
                setEditingCredential(null);
                setIsCredentialsModalOpen(true);
              } else {
                setEditingAccount(null);
                setEditingCard(null);
                setIsAddModalOpen(true);
              }
            }}
            className="relative group bg-gradient-to-br from-cyan-500 via-cyan-600 to-teal-600 hover:from-cyan-600 hover:via-cyan-700 hover:to-teal-700 p-3 md:p-4 rounded-2xl transition-all text-white hover:scale-105 active:scale-95 ring-1 ring-white/20 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <Plus className="w-5 h-5 md:w-6 md:h-6 relative z-10 drop-shadow-lg" />
          </button>
        </div>

        {/* Premium segmented tabs */}
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab("debit")}
            className={cn(
              "flex-1 py-2.5 md:py-3 px-3 md:px-5 rounded-xl text-xs md:text-sm font-bold transition-all duration-300",
              activeTab === "debit"
                ? "bg-gradient-to-br from-cyan-500 to-cyan-600 text-white shadow-lg hover:shadow-xl"
                : "bg-white/50 dark:bg-zinc-800/50 text-zinc-600 dark:text-zinc-400 hover:bg-white/80 dark:hover:bg-zinc-800/80 hover:text-zinc-900 dark:hover:text-zinc-100"
            )}
          >
            {t("accounts.debit")}
          </button>
          <button
            onClick={() => setActiveTab("credit")}
            className={cn(
              "flex-1 py-2.5 md:py-3 px-3 md:px-5 rounded-xl text-xs md:text-sm font-bold transition-all duration-300",
              activeTab === "credit"
                ? "bg-gradient-to-br from-cyan-500 to-cyan-600 text-white shadow-lg hover:shadow-xl"
                : "bg-white/50 dark:bg-zinc-800/50 text-zinc-600 dark:text-zinc-400 hover:bg-white/80 dark:hover:bg-zinc-800/80 hover:text-zinc-900 dark:hover:text-zinc-100"
            )}
          >
            {t("accounts.credit")}
          </button>
          <button
            onClick={() => setActiveTab("credentials")}
            className={cn(
              "flex-1 py-2.5 md:py-3 px-3 md:px-5 rounded-xl text-xs md:text-sm font-bold transition-all duration-300",
              activeTab === "credentials"
                ? "bg-gradient-to-br from-cyan-500 to-cyan-600 text-white shadow-lg hover:shadow-xl"
                : "bg-white/50 dark:bg-zinc-800/50 text-zinc-600 dark:text-zinc-400 hover:bg-white/80 dark:hover:bg-zinc-800/80 hover:text-zinc-900 dark:hover:text-zinc-100"
            )}
          >
            {t("credentials.title")}
          </button>
        </div>

        {activeTab === "debit" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative overflow-hidden rounded-2xl p-5 md:p-6 bg-gradient-to-br from-cyan-50 to-teal-100 dark:from-cyan-600/30 dark:to-teal-600/30 shadow-sm dark:shadow-[0_8px_16px_rgba(0,0,0,0.3)] border border-cyan-200/40 dark:border-white/5">
              <div className="absolute inset-0 shadow-[inset_0_1px_2px_rgba(255,255,255,0.5)] dark:shadow-[inset_0_2px_8px_rgba(255,255,255,0.05)]" />
              <div className="relative">
                <p className="text-cyan-700 dark:text-cyan-300 text-xs md:text-sm font-semibold mb-1">
                  Balance de Cuentas
                </p>
                <p className="text-3xl md:text-[2.5rem] leading-tight font-bold text-cyan-900 dark:text-white tracking-tight">
                  {formatCurrencyValue(totalBalance)}
                </p>
                <p className="text-cyan-600 dark:text-cyan-400 text-xs md:text-sm mt-2 font-medium">
                  {accounts.length}{" "}
                  {accounts.length === 1 ? "tarjeta débito" : "tarjetas débito"}
                </p>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-2xl p-5 md:p-6 bg-gradient-to-br from-red-50 to-rose-100 dark:from-red-600/30 dark:to-rose-600/30 shadow-sm dark:shadow-[0_8px_16px_rgba(0,0,0,0.3)] border border-red-200/40 dark:border-white/5">
              <div className="absolute inset-0 shadow-[inset_0_1px_2px_rgba(255,255,255,0.5)] dark:shadow-[inset_0_2px_8px_rgba(255,255,255,0.05)]" />
              <div className="relative">
                <p className="text-red-700 dark:text-red-300 text-xs md:text-sm font-semibold mb-1">
                  {t("dashboard.spent")}
                </p>
                <p className="text-3xl md:text-[2.5rem] leading-tight font-bold text-red-900 dark:text-white tracking-tight">
                  {formatCurrencyValue(totalBalance * 0.15)}
                </p>
                <p className="text-red-600 dark:text-red-400 text-xs md:text-sm mt-2 font-medium">
                  {t("dashboard.thisMonth")}
                </p>
              </div>
            </div>
          </div>
        ) : activeTab === "credit" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative overflow-hidden rounded-2xl p-5 md:p-6 bg-gradient-to-br from-cyan-50 to-teal-100 dark:from-cyan-600/30 dark:to-teal-600/30 shadow-sm dark:shadow-[0_8px_16px_rgba(0,0,0,0.3)] border border-cyan-200/40 dark:border-white/5">
              <div className="absolute inset-0 shadow-[inset_0_1px_2px_rgba(255,255,255,0.5)] dark:shadow-[inset_0_2px_8px_rgba(255,255,255,0.05)]" />
              <div className="relative">
                <p className="text-cyan-700 dark:text-cyan-300 text-xs md:text-sm font-semibold mb-1">
                  {t("accounts.available")}
                </p>
                <p className="text-3xl md:text-[2.5rem] leading-tight font-bold text-cyan-900 dark:text-white tracking-tight">
                  {formatCurrencyValue(totalAvailable)}
                </p>
                <p className="text-cyan-600 dark:text-cyan-400 text-xs md:text-sm mt-2 font-medium">
                  {cards.length} {cards.length === 1 ? "tarjeta crédito" : "tarjetas crédito"}
                </p>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-2xl p-5 md:p-6 bg-gradient-to-br from-red-50 to-rose-100 dark:from-red-600/30 dark:to-rose-600/30 shadow-sm dark:shadow-[0_8px_16px_rgba(0,0,0,0.3)] border border-red-200/40 dark:border-white/5">
              <div className="absolute inset-0 shadow-[inset_0_1px_2px_rgba(255,255,255,0.5)] dark:shadow-[inset_0_2px_8px_rgba(255,255,255,0.05)]" />
              <div className="relative">
                <p className="text-red-700 dark:text-red-300 text-xs md:text-sm font-semibold mb-1">
                  {t("accounts.used")}
                </p>
                <p className="text-3xl md:text-[2.5rem] leading-tight font-bold text-red-900 dark:text-white tracking-tight">
                  {formatCurrencyValue(totalUsedCredit)}
                </p>
                <p className="text-red-600 dark:text-red-400 text-xs md:text-sm mt-2 font-medium">
                  {t("dashboard.thisMonth")}
                </p>
              </div>
            </div>
          </div>
        ) : null}
      </header>

      <section>
        {activeTab === "debit" ? (
          <>
            <DndContext
              id="accounts-dnd"
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEndAccounts}
            >
              <SortableContext
                items={accounts.map((acc) => acc.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="grid gap-4 md:grid-cols-2">
                  {accounts.map((account) => (
                    <SortableAccountCard
                      key={account.id}
                      account={account}
                      onEdit={handleEditAccount}
                      onDelete={handleDeleteAccount}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>

            {accounts.length === 0 && (
              <div className="text-center py-12">
                <Wallet className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-zinc-900 dark:text-white">
                  {t("accounts.noAccounts")}
                </h3>
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
            <DndContext
              id="credit-cards-dnd"
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEndCards}
            >
              <SortableContext
                items={cards.map((c) => c.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="grid gap-4 md:grid-cols-2">
                  {cards.map((card) => (
                    <SortableCreditCard
                      key={card.id}
                      card={card}
                      onEdit={handleEditCard}
                      onDelete={handleDeleteCard}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>

            {cards.length === 0 && (
              <div className="text-center py-12">
                <Wallet className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-zinc-900 dark:text-white">
                  {t("accounts.noCards")}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {t("accounts.addFirstCard")}
                </p>
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
          <div className="bg-white dark:bg-zinc-950 rounded-2xl p-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-white">
                {t("credentials.accessCredentials")}
              </h2>
            </div>
            <BankCredentialsSection
              credentials={credentials}
              onEdit={handleEditCredentials}
              onDelete={handleDeleteCredentials}
              onReorder={setCredentials}
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
        onAddAccount={handleAddAccount}
        onAddCard={handleAddCard}
        editingAccount={editingAccount}
        editingCard={editingCard}
        onUpdateAccount={handleUpdateAccount}
        onUpdateCard={handleUpdateCard}
      />

      <AddCredentialsModal
        isOpen={isCredentialsModalOpen}
        onClose={() => {
          setIsCredentialsModalOpen(false);
          setEditingCredential(null);
        }}
        onSave={handleAddCredentials}
        onUpdate={handleUpdateCredentials}
        editingCredential={editingCredential}
      />

      <ConfirmModal
        isOpen={confirmDelete.isOpen}
        onClose={() => setConfirmDelete({ isOpen: false, type: null, id: null, name: "" })}
        onConfirm={confirmDeletion}
        title={t("common.delete")}
        message={t("accounts.confirmDelete", { name: confirmDelete.name })}
        confirmText={t("common.delete")}
        cancelText={t("common.cancel")}
      />
    </div>
  );
}
