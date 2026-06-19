import { z } from "zod";

export const TransactionCreateSchema = z.object({
  type: z.enum(["income", "expense", "transfer"]),
  status: z.enum(["pending", "completed", "failed"]).default("completed"),
  amountValue: z.number().positive(),
  amountCurrency: z.enum(["PEN", "USD", "EUR"]).default("PEN"),
  description: z.string().min(1),
  merchant: z.string().optional(),
  category: z.string().min(1),
  date: z.string().min(1),
  notes: z.string().optional(),
  accountId: z.string().optional(),
  cardId: z.string().optional(),
});

export const TransactionUpdateSchema = TransactionCreateSchema.partial();

export type TransactionCreateInput = z.infer<typeof TransactionCreateSchema>;
export type TransactionUpdateInput = z.infer<typeof TransactionUpdateSchema>;
