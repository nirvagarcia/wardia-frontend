import type { ITransaction } from "@/shared/types/finance";
import type { MonthSummary } from "@/server/modules/transactions/transactions.service";

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const json = await response.json().catch(() => ({}));
    throw new Error((json as { error?: string }).error ?? `Request failed: ${response.status}`);
  }
  if (response.status === 204) return undefined as T;
  return response.json().then((j: { data: T }) => j.data);
}

function toTransaction(r: ITransaction & { transactionDate: string }): ITransaction {
  return { ...r, transactionDate: new Date(r.transactionDate) };
}

export type TransactionQueryParams =
  | string
  | { startDate: string; endDate?: string };

export const transactionsService = {
  async getTransactions(params?: TransactionQueryParams): Promise<ITransaction[]> {
    let url = "/api/transactions";
    if (typeof params === "string") {
      url = `/api/transactions?month=${params}`;
    } else if (params) {
      const qs = new URLSearchParams({ startDate: params.startDate });
      if (params.endDate) qs.set("endDate", params.endDate);
      url = `/api/transactions?${qs.toString()}`;
    }
    const res = await fetch(url);
    const data = await handleResponse<ITransaction[]>(res);
    return data.map((t) => toTransaction(t as ITransaction & { transactionDate: string }));
  },

  async getHistory(): Promise<MonthSummary[]> {
    const res = await fetch("/api/transactions/history");
    return handleResponse<MonthSummary[]>(res);
  },

  async createTransaction(data: Omit<ITransaction, "id">): Promise<ITransaction> {
    const res = await fetch("/api/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: data.type,
        status: data.status,
        amountValue: data.amount.value,
        amountCurrency: data.amount.currency,
        description: data.description,
        merchant: data.source,
        category: data.category,
        date: data.transactionDate instanceof Date ? data.transactionDate.toISOString() : data.transactionDate,
        notes: data.notes,
        cardId: data.cardId,
      }),
    });
    const t = await handleResponse<ITransaction & { transactionDate: string }>(res);
    return toTransaction(t);
  },

  async updateTransaction(id: string, data: Omit<ITransaction, "id">): Promise<ITransaction> {
    const res = await fetch(`/api/transactions/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: data.type,
        status: data.status,
        amountValue: data.amount.value,
        amountCurrency: data.amount.currency,
        description: data.description,
        merchant: data.source,
        category: data.category,
        date: data.transactionDate instanceof Date ? data.transactionDate.toISOString() : data.transactionDate,
        notes: data.notes,
        cardId: data.cardId,
      }),
    });
    const t = await handleResponse<ITransaction & { transactionDate: string }>(res);
    return toTransaction(t);
  },

  async deleteTransaction(id: string): Promise<void> {
    const res = await fetch(`/api/transactions/${id}`, { method: "DELETE" });
    return handleResponse<void>(res);
  },
};
