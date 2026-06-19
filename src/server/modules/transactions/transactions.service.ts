import { ApiError } from "@/server/lib/api-error";
import * as repo from "./transactions.repository";
import type { TransactionCreateInput, TransactionUpdateInput } from "./transactions.validation";

export interface MonthSummary {
  label: string;
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  transactionCount: number;
  currency: string;
}

export async function getTransactionsByMonth(userId: string, year: number, month: number) {
  return repo.findByUserAndMonth(userId, year, month);
}

export async function getMonthlyHistory(userId: string): Promise<MonthSummary[]> {
  const all = await repo.findAllByUser(userId);

  const map = new Map<string, MonthSummary>();

  for (const txn of all) {
    const d = new Date(txn.transactionDate);
    const y = d.getFullYear();
    const m = d.getMonth() + 1;
    const key = `${y}-${String(m).padStart(2, "0")}`;

    if (!map.has(key)) {
      map.set(key, {
        label: key,
        totalIncome: 0,
        totalExpenses: 0,
        balance: 0,
        transactionCount: 0,
        currency: txn.amount.currency,
      });
    }

    const entry = map.get(key)!;
    entry.transactionCount++;
    if (txn.type === "income") {
      entry.totalIncome += txn.amount.value;
    } else if (txn.type === "expense") {
      entry.totalExpenses += txn.amount.value;
    }
    entry.balance = entry.totalIncome - entry.totalExpenses;
  }

  return Array.from(map.values()).sort((a, b) => b.label.localeCompare(a.label));
}

export async function createTransaction(userId: string, data: TransactionCreateInput) {
  return repo.create(userId, data);
}

export async function updateTransaction(id: string, userId: string, data: TransactionUpdateInput) {
  const existing = await repo.findById(id, userId);
  if (!existing) throw new ApiError("Transaction not found", 404);
  return repo.update(id, data);
}

export async function deleteTransaction(id: string, userId: string) {
  const existing = await repo.findById(id, userId);
  if (!existing) throw new ApiError("Transaction not found", 404);
  await repo.remove(id);
}
