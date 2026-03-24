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
import { AddCredentialsModal } from "@/components/modals/add-credentials-modal";
import {ConfirmModal } from "@/components/modals/confirm-modal";
import { Wallet, Plus, TrendingUp, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
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
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { IAccount, ICreditCard, IBankCredentials } from "@/types/finance";

type TabType = "debit" | "credit" | "credentials";

function SortableAccountCard({ 
  account, 
  onEdit, 
  onDelete 
}: { 
  account: IAccount; 
  onEdit: (account: IAccount) => void; 
  onDelete: (id: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: account.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? transition : transition + ", transform 0.2s ease, box-shadow 0.2s ease",
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style}
      className={cn(
        "relative cursor-grab active:cursor-grabbing transition-all",
        isDragging && "scale-105 shadow-2xl z-50 opacity-90"
      )}
      {...attributes}
      {...listeners}
    >
      <AccountCard account={account} onEdit={onEdit} onDelete={onDelete} />
    </div>
  );
}

function SortableCreditCard({ 
  card, 
  onEdit, 
  onDelete 
}: { 
  card: ICreditCard; 
  onEdit: (card: ICreditCard) => void; 
  onDelete: (id: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? transition : transition + ", transform 0.2s ease, box-shadow 0.2s ease",
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style}
      className={cn(
        "relative cursor-grab active:cursor-grabbing transition-all",
        isDragging && "scale-105 shadow-2xl z-50 opacity-90"
      )}
      {...attributes}
      {...listeners}
    >
      <CreditCardDisplay card={card} onEdit={onEdit} onDelete={onDelete} />
    </div>
  );
}

export default function AccountsPage(): React.JSX.Element {
  const { language, currency } = usePreferencesStore();
  const t = (key: string, vars?: Record<string, string | number>) => getTranslation(language, key, vars);
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
        value: newCard.usedCredit.value * 0.05,
        currency: newCard.usedCredit.currency,
      },
    };
    setCards([...cards, cardWithId]);
  };

  const handleUpdateAccount = (id: string, updatedAccount: Omit<IAccount, "id" | "lastUpdated">) => {
    setAccounts(accounts.map(acc => 
      acc.id === id 
        ? { ...updatedAccount, id, lastUpdated: new Date() }
        : acc
    ));
  };

  const handleUpdateCard = (id: string, updatedCard: Omit<ICreditCard, "id" | "lastStatementDate" | "nextPaymentDate" | "minimumPayment">) => {
    const now = new Date();
    setCards(cards.map(card => 
      card.id === id 
        ? { 
            ...updatedCard, 
            id,
            lastStatementDate: new Date(now.getFullYear(), now.getMonth(), updatedCard.cutoffDay),
            nextPaymentDate: new Date(now.getFullYear(), now.getMonth() + 1, updatedCard.paymentDueDay),
            minimumPayment: {
              value: updatedCard.usedCredit.value * 0.05,
              currency: updatedCard.usedCredit.currency,
            },
          }
        : card
    ));
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

  const handleAddCredentials = (newCred: Omit<IBankCredentials, "id" | "lastUpdated">) => {
    const credWithId: IBankCredentials = {
      ...newCred,
      id: `cred-${Date.now()}`,
      lastUpdated: new Date(),
    };
    setCredentials([...credentials, credWithId]);
  };

  const handleUpdateCredentials = (id: string, updatedCred: Omit<IBankCredentials, "id" | "lastUpdated">) => {
    setCredentials(credentials.map(cred => 
      cred.id === id 
        ? { ...updatedCred, id, lastUpdated: new Date() }
        : cred
    ));
  };

  const handleEditCredentials = (credential: IBankCredentials) => {
    setEditingCredential(credential);
    setIsCredentialsModalOpen(true);
  };

  const handleDeleteCredentials = (id: string) => {
    setCredentials(credentials.filter(cred => cred.id !== id));
  };

  const handleDeleteAccount = (id: string) => {
    const account = accounts.find(acc => acc.id === id);
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
    const card = cards.find(c => c.id === id);
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
      setAccounts(accounts.filter(acc => acc.id !== confirmDelete.id));
    } else if (confirmDelete.type === "card" && confirmDelete.id) {
      setCards(cards.filter(card => card.id !== confirmDelete.id));
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
    <div className="space-y-6">
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
            className="bg-emerald-600 hover:bg-emerald-700 p-3 rounded-xl transition-colors text-white"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>

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
            {t("credentials.title")}
          </button>
        </div>

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

      <section>
        {activeTab === "debit" ? (
          <>
            <DndContext
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
            <DndContext
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
        message={
          t("accounts.confirmDelete", { name: confirmDelete.name })
        }
        confirmText={t("common.delete")}
        cancelText={t("common.cancel")}
        variant="danger"
      />
    </div>
  );
}
