/**
 * Transaction View Helper Functions
 * Utilities for transactions, filtering, calculations, and formatting
 */

import { ITransaction } from "@/shared/types/finance";
import { Currency } from "@/shared/types";
import { convertCurrency } from "@/shared/utils/currency";
import { getDateKey } from "@/shared/utils/date";

export type TransactionCategory = 
  | "salary"
  | "freelance"
  | "overtime"
  | "investment"
  | "other-income"
  | "dining"
  | "groceries"
  | "coffee"
  | "clothing"
  | "tech"
  | "entertainment"
  | "snacks"
  | "utilities"
  | "transportation"
  | "fitness"
  | "health"
  | "education"
  | "housing"
  | "other-expense";

interface CategoryInfo {
  key: TransactionCategory;
  labelKey: string;
  icon: string;
  type: "income" | "expense";
}

export const incomeCategories: CategoryInfo[] = [
  { key: "salary", labelKey: "transactions.categorySalary", icon: "💼", type: "income" },
  { key: "freelance", labelKey: "transactions.categoryFreelance", icon: "💻", type: "income" },
  { key: "overtime", labelKey: "transactions.categoryOvertime", icon: "⏰", type: "income" },
  { key: "investment", labelKey: "transactions.categoryInvestment", icon: "📈", type: "income" },
  { key: "other-income", labelKey: "transactions.categoryOtherIncome", icon: "💰", type: "income" },
];

export const expenseCategories: CategoryInfo[] = [
  { key: "dining", labelKey: "transactions.categoryDining", icon: "🍽️", type: "expense" },
  { key: "groceries", labelKey: "transactions.categoryGroceries", icon: "🛒", type: "expense" },
  { key: "coffee", labelKey: "transactions.categoryCoffee", icon: "☕", type: "expense" },
  { key: "clothing", labelKey: "transactions.categoryClothing", icon: "👕", type: "expense" },
  { key: "tech", labelKey: "transactions.categoryTech", icon: "💻", type: "expense" },
  { key: "entertainment", labelKey: "transactions.categoryEntertainment", icon: "🎬", type: "expense" },
  { key: "snacks", labelKey: "transactions.categorySnacks", icon: "🍬", type: "expense" },
  { key: "utilities", labelKey: "transactions.categoryUtilities", icon: "⚡", type: "expense" },
  { key: "transportation", labelKey: "transactions.categoryTransportation", icon: "🚗", type: "expense" },
  { key: "fitness", labelKey: "transactions.categoryFitness", icon: "💪", type: "expense" },
  { key: "health", labelKey: "transactions.categoryHealth", icon: "🏥", type: "expense" },
  { key: "education", labelKey: "transactions.categoryEducation", icon: "📚", type: "expense" },
  { key: "housing", labelKey: "transactions.categoryHousing", icon: "🏠", type: "expense" },
  { key: "other-expense", labelKey: "transactions.categoryOtherExpense", icon: "📦", type: "expense" },
];

export const getCategoryInfo = (categoryKey: string): CategoryInfo | undefined => {
  return [...incomeCategories, ...expenseCategories].find(cat => cat.key === categoryKey);
};

export const getCategoryLabel = (t: (key: string) => string, categoryKey: string): string => {
  const category = getCategoryInfo(categoryKey);
  return category ? t(category.labelKey) : categoryKey;
};

export const getCategoryIcon = (categoryKey: string): string => {
  const category = getCategoryInfo(categoryKey);
  return category?.icon || "📄";
};

export const calculateTotalIncome = (transactions: ITransaction[], preferredCurrency: Currency): number => {
  return transactions
    .filter(t => t.type === "income" && t.status === "completed")
    .reduce((sum, t) => {
      const converted = convertCurrency(t.amount.value, t.amount.currency as Currency, preferredCurrency);
      return sum + converted;
    }, 0);
};

export const calculateTotalExpenses = (transactions: ITransaction[], preferredCurrency: Currency): number => {
  return transactions
    .filter(t => t.type === "expense" && t.status === "completed")
    .reduce((sum, t) => {
      const converted = convertCurrency(t.amount.value, t.amount.currency as Currency, preferredCurrency);
      return sum + converted;
    }, 0);
};

export const calculateBalance = (transactions: ITransaction[], preferredCurrency: Currency): number => {
  return calculateTotalIncome(transactions, preferredCurrency) - calculateTotalExpenses(transactions, preferredCurrency);
};

export const filterTransactionsByType = (
  transactions: ITransaction[],
  type: "all" | "income" | "expense"
): ITransaction[] => {
  if (type === "all") return transactions;
  return transactions.filter(t => t.type === type);
};

export const filterTransactionsByCategory = (
  transactions: ITransaction[],
  categories: string[]
): ITransaction[] => {
  if (categories.length === 0) return transactions;
  return transactions.filter(t => categories.includes(t.category));
};

export const filterTransactionsByDate = (
  transactions: ITransaction[],
  startDate: Date | null,
  endDate: Date | null
): ITransaction[] => {
  return transactions.filter(t => {
    if (startDate && t.date < startDate) return false;
    if (endDate && t.date > endDate) return false;
    return true;
  });
};

export const sortTransactionsByDate = (
  transactions: ITransaction[],
  order: "asc" | "desc" = "desc"
): ITransaction[] => {
  return [...transactions].sort((a, b) => {
    const timeA = a.date.getTime();
    const timeB = b.date.getTime();
    return order === "desc" ? timeB - timeA : timeA - timeB;
  });
};

export const groupTransactionsByDate = (
  transactions: ITransaction[]
): Record<string, ITransaction[]> => {
  const grouped: Record<string, ITransaction[]> = {};
  
  transactions.forEach(transaction => {
    const dateKey = getDateKey(transaction.date);
    if (!grouped[dateKey]) {
      grouped[dateKey] = [];
    }
    grouped[dateKey].push(transaction);
  });
  
  return grouped;
};

export const getTransactionTypeLabel = (t: (key: string) => string, type: string): string => {
  const typeMap: Record<string, string> = {
    income: t("transactions.income"),
    expense: t("transactions.expense"),
    transfer: t("transactions.transfer"),
  };
  return typeMap[type] || type;
};

export const getTransactionStatusLabel = (t: (key: string) => string, status: string): string => {
  const statusMap: Record<string, string> = {
    completed: t("transactions.completed"),
    pending: t("transactions.pending"),
    failed: t("transactions.failed"),
  };
  return statusMap[status] || status;
};

export const createNewTransaction = (
  transactionData: Omit<ITransaction, "id">
): ITransaction => {
  return {
    ...transactionData,
    id: `txn-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  };
};

export const updateTransaction = (
  transaction: ITransaction,
  updatedData: Partial<Omit<ITransaction, "id">>
): ITransaction => {
  return {
    ...transaction,
    ...updatedData,
  };
};

export const getCategoryExpenseBreakdown = (
  transactions: ITransaction[],
  currency: Currency
): Record<string, number> => {
  const breakdown: Record<string, number> = {};
  
  transactions
    .filter(t => t.type === "expense" && t.status === "completed" && t.amount.currency === currency)
    .forEach(t => {
      breakdown[t.category] = (breakdown[t.category] ?? 0) + t.amount.value;
    });
  
  return breakdown;
};
