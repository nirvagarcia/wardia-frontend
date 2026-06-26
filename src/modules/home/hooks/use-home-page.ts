"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { usePreferencesStore } from "@/shared/stores/preferences-store";
import { getTranslation } from "@/shared/langs";
import { useServicesQuery, computeUpcomingPayments } from "@/shared/hooks/use-services-query";
import { useCurrentPeriod } from "@/shared/hooks/use-periods-query";
import { useTransactionsQuery } from "@/shared/hooks/use-transactions-query";
import { getServicesInPeriod } from "@/shared/utils/service-payments";
import type { IUpcomingPayment } from "@/shared/types/finance";

export function useHomePage() {
  const [mounted, setMounted] = useState(false);
  const { language, currency } = usePreferencesStore();
  const t = useCallback((key: string) => getTranslation(language, key), [language]);

  useEffect(() => { setMounted(true); }, []);

  const periodQuery = useCurrentPeriod();
  const apiParams = useMemo(() => {
    if (!periodQuery.data) return undefined;
    const start = periodQuery.data.startDate.split("T")[0]!;
    return periodQuery.data.endDate
      ? { startDate: start, endDate: periodQuery.data.endDate.split("T")[0]! }
      : { startDate: start };
  }, [periodQuery.data]);

  const { data: transactions = [], isLoading: txLoading } = useTransactionsQuery(apiParams);
  const { data: servicesData } = useServicesQuery();
  const services = useMemo(() => servicesData?.services ?? [], [servicesData]);

  const servicePayments = useMemo(() => {
    if (!periodQuery.data) return [];
    const periodStart = new Date(periodQuery.data.startDate);
    const periodEnd = periodQuery.data.endDate ? new Date(periodQuery.data.endDate) : new Date();
    return getServicesInPeriod(services.filter((s) => s.status === "active"), periodStart, periodEnd);
  }, [services, periodQuery.data]);

  const allTransactions = useMemo(() => [...transactions, ...servicePayments], [transactions, servicePayments]);

  const periodIncome = useMemo(() =>
    allTransactions.filter((tx) => tx.type === "income").reduce((s, tx) => s + tx.amount.value, 0),
    [allTransactions]);
  const periodExpenses = useMemo(() =>
    allTransactions.filter((tx) => tx.type === "expense").reduce((s, tx) => s + tx.amount.value, 0),
    [allTransactions]);
  const periodBalance = periodIncome - periodExpenses;

  const upcomingPayments = useMemo<IUpcomingPayment[]>(() =>
    computeUpcomingPayments(services, 30).map((s) => ({
      id: s.id, name: s.name, amount: s.amount, dueDate: s.nextPaymentDate, type: "subscription" as const,
    })), [services]);

  const recentTransactions = useMemo(() =>
    [...allTransactions]
      .sort((a, b) => new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime())
      .slice(0, 5),
    [allTransactions]);

  const donutSegments = useMemo(() => {
    if (periodIncome === 0 && periodExpenses === 0) {
      return [{ value: 1, color: "#e4e4e7", label: getTranslation(language, "transactions.income") }];
    }
    const segs: { value: number; color: string; label: string }[] = [];
    if (periodExpenses > 0) segs.push({ value: periodExpenses, color: "#ef4444", label: getTranslation(language, "transactions.expenses") });
    if (periodBalance > 0) segs.push({ value: periodBalance, color: "#06b6d4", label: getTranslation(language, "transactions.balance") });
    return segs;
  }, [periodIncome, periodExpenses, periodBalance, language]);

  return {
    isLoading: !mounted || periodQuery.isLoading || txLoading,
    t, language, currency,
    periodIncome, periodExpenses, periodBalance,
    upcomingPayments, recentTransactions, donutSegments,
    periodLabel: periodQuery.data?.label ?? "",
  };
}
