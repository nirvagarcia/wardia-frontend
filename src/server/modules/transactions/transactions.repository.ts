import { prisma } from "@/server/db/client";
import type { ITransaction } from "@/shared/types/finance";
import type { TransactionCreateInput, TransactionUpdateInput } from "./transactions.validation";

function toTransaction(row: {
  id: string;
  type: string;
  status: string;
  amountValue: number;
  amountCurrency: string;
  description: string;
  merchant: string | null;
  category: string;
  date: Date;
  notes: string | null;
  accountId: string | null;
  cardId: string | null;
}): ITransaction {
  return {
    id: row.id,
    accountId: row.accountId ?? undefined,
    cardId: row.cardId ?? undefined,
    type: row.type as ITransaction["type"],
    status: row.status as ITransaction["status"],
    amount: {
      value: row.amountValue,
      currency: row.amountCurrency as ITransaction["amount"]["currency"],
    },
    description: row.description,
    source: row.merchant ?? undefined,
    category: row.category,
    transactionDate: row.date,
    notes: row.notes ?? undefined,
  };
}

export async function findByUserAndMonth(
  userId: string,
  year: number,
  month: number
): Promise<ITransaction[]> {
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 1);

  const rows = await prisma.transaction.findMany({
    where: { userId, date: { gte: start, lt: end } },
    orderBy: { date: "desc" },
  });
  return rows.map(toTransaction);
}

export async function findByDateRange(
  userId: string,
  start: Date,
  end: Date | null
): Promise<ITransaction[]> {
  const rows = await prisma.transaction.findMany({
    where: {
      userId,
      date: {
        gte: start,
        ...(end ? { lt: end } : {}),
      },
    },
    orderBy: { date: "desc" },
  });
  return rows.map(toTransaction);
}

export async function findAllByUser(userId: string): Promise<ITransaction[]> {
  const rows = await prisma.transaction.findMany({
    where: { userId },
    orderBy: { date: "desc" },
  });
  return rows.map(toTransaction);
}

export async function findById(id: string, userId: string) {
  return prisma.transaction.findFirst({ where: { id, userId } });
}

export async function create(userId: string, data: TransactionCreateInput): Promise<ITransaction> {
  const row = await prisma.transaction.create({
    data: {
      userId,
      type: data.type,
      status: data.status ?? "completed",
      amountValue: data.amountValue,
      amountCurrency: data.amountCurrency ?? "PEN",
      description: data.description,
      merchant: data.merchant ?? null,
      category: data.category,
      date: new Date(data.date),
      notes: data.notes ?? null,
      accountId: data.accountId ?? null,
      cardId: data.cardId ?? null,
    },
  });
  return toTransaction(row);
}

export async function update(id: string, data: TransactionUpdateInput): Promise<ITransaction> {
  const row = await prisma.transaction.update({
    where: { id },
    data: {
      ...(data.type !== undefined && { type: data.type }),
      ...(data.status !== undefined && { status: data.status }),
      ...(data.amountValue !== undefined && { amountValue: data.amountValue }),
      ...(data.amountCurrency !== undefined && { amountCurrency: data.amountCurrency }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.merchant !== undefined && { merchant: data.merchant }),
      ...(data.category !== undefined && { category: data.category }),
      ...(data.date !== undefined && { date: new Date(data.date) }),
      ...(data.notes !== undefined && { notes: data.notes }),
      ...(data.accountId !== undefined && { accountId: data.accountId }),
      ...(data.cardId !== undefined && { cardId: data.cardId }),
    },
  });
  return toTransaction(row);
}

export async function remove(id: string): Promise<void> {
  await prisma.transaction.delete({ where: { id } });
}
