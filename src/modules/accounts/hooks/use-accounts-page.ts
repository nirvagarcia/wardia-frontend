"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { usePreferencesStore } from "@/shared/stores/preferences-store";
import { getTranslation } from "@/shared/langs";
import { formatCurrency } from "@/shared/utils/currency";
import { useAccountsStore } from "@/shared/stores/accounts-store";
import { useInitializeAccounts } from "@/shared/hooks/use-initialize-accounts";
import {
  useCredentialsQuery, useAddCredential, useUpdateCredential, useDeleteCredential,
} from "@/shared/hooks/use-credentials-query";
import type { IAccount, ICreditCard, ICredential } from "@/shared/types/finance";

type TabType = "debit" | "credit" | "credentials";

export function useAccountsPage() {
  const { language, currency } = usePreferencesStore();
  const t = useCallback((key: string, vars?: Record<string, string | number>) =>
    getTranslation(language, key, vars), [language]);

  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("credentials");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCredentialsModalOpen, setIsCredentialsModalOpen] = useState(false);
  const [editingCredential, setEditingCredential] = useState<ICredential | null>(null);
  const [editingAccount, setEditingAccount] = useState<IAccount | null>(null);
  const [editingCard, setEditingCard] = useState<ICreditCard | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{
    isOpen: boolean; type: "account" | "card" | null; id: string | null; name: string;
  }>({ isOpen: false, type: null, id: null, name: "" });

  const { isLoading: accountsLoading, error } = useInitializeAccounts();
  const credentialsQuery = useCredentialsQuery();
  const addCredentialMutation = useAddCredential();
  const updateCredentialMutation = useUpdateCredential();
  const deleteCredentialMutation = useDeleteCredential();

  const {
    accounts, creditCards: cards,
    addAccount, updateAccount, deleteAccount,
    addCreditCard, updateCreditCard, deleteCreditCard,
    reorderAccounts, reorderCreditCards,
    getTotalBalance, getTotalCreditUsed, getTotalCreditAvailable,
  } = useAccountsStore();

  useEffect(() => { setMounted(true); }, []);

  const credentials = credentialsQuery.data ?? [];
  const isLoading = accountsLoading || credentialsQuery.isLoading;



  const handleAddClick = useCallback(() => {
    if (activeTab === "credentials") {
      setEditingCredential(null); setIsCredentialsModalOpen(true);
    } else {
      setEditingAccount(null); setEditingCard(null); setIsAddModalOpen(true);
    }
  }, [activeTab]);

  const handleEditAccount = useCallback((account: IAccount) => {
    setEditingAccount(account); setEditingCard(null); setIsAddModalOpen(true);
  }, []);

  const handleEditCard = useCallback((card: ICreditCard) => {
    setEditingCard(card); setEditingAccount(null); setIsAddModalOpen(true);
  }, []);

  const handleEditCredentials = useCallback((credential: ICredential) => {
    setEditingCredential(credential); setIsCredentialsModalOpen(true);
  }, []);

  const handleDeleteAccount = useCallback((id: string) => {
    const account = accounts.find((acc) => acc.id === id);
    if (account) setConfirmDelete({ isOpen: true, type: "account", id, name: account.bankName });
  }, [accounts]);

  const handleDeleteCard = useCallback((id: string) => {
    const card = cards.find((c) => c.id === id);
    if (card) setConfirmDelete({ isOpen: true, type: "card", id, name: `${card.network.toUpperCase()} *${card.cardNumber.slice(-4)}` });
  }, [cards]);

  const confirmDeletion = useCallback(() => {
    if (confirmDelete.type === "account" && confirmDelete.id) deleteAccount(confirmDelete.id);
    else if (confirmDelete.type === "card" && confirmDelete.id) deleteCreditCard(confirmDelete.id);
    setConfirmDelete({ isOpen: false, type: null, id: null, name: "" });
  }, [confirmDelete, deleteAccount, deleteCreditCard]);

  const handleDeleteCredential = useCallback(async (id: string) => {
    try { await deleteCredentialMutation.mutateAsync(id); toast.success(t("credentials.deleteSuccess")); }
    catch { toast.error(t("credentials.deleteError")); }
  }, [deleteCredentialMutation, t]);

  const handleSaveCredential = useCallback(async (data: Omit<ICredential, "id" | "lastUpdated">) => {
    try { await addCredentialMutation.mutateAsync(data); toast.success(t("credentials.addSuccess")); setIsCredentialsModalOpen(false); }
    catch { toast.error(t("credentials.addError")); }
  }, [addCredentialMutation, t]);

  const handleUpdateCredential = useCallback(async (id: string, data: Partial<Omit<ICredential, "id" | "lastUpdated">>) => {
    try {
      await updateCredentialMutation.mutateAsync({ id, data });
      toast.success(t("credentials.updateSuccess")); setIsCredentialsModalOpen(false); setEditingCredential(null);
    } catch { toast.error(t("credentials.updateError")); }
  }, [updateCredentialMutation, t]);

  const totalBalance = getTotalBalance();
  const totalUsedCredit = getTotalCreditUsed();
  const totalAvailable = getTotalCreditAvailable();
  const formatCurrencyValue = useCallback((value: number) => formatCurrency(value, currency, language), [currency, language]);

  return {
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
  };
}
