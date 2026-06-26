import { z } from "zod";

export const BoardCreateSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  description: z.string().max(500).optional(),
  coverImage: z.string().url().optional().or(z.literal("")),
  order: z.number().int().optional(),
});

export const BoardUpdateSchema = BoardCreateSchema.partial();

export const ListCreateSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  description: z.string().max(500).optional(),
  order: z.number().int().optional(),
});

export const ListUpdateSchema = ListCreateSchema.partial();

export const ItemLinkSchema = z.object({
  label: z.string().max(100).optional(),
  url: z.string().url("Invalid URL"),
});

export const ItemCreateSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().max(1000).optional(),
  imageUrl: z.string().url().optional().or(z.literal("")).nullable(),
  priceValue: z.number().nonnegative().optional().nullable(),
  priceCurrency: z.enum(["PEN", "USD", "EUR"]).default("PEN"),
  quantity: z.number().int().min(1).default(1),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
  status: z.enum(["pending", "purchased"]).default("pending"),
  tags: z.array(z.string().max(50)).default([]),
  notes: z.string().max(1000).optional(),
  order: z.number().int().optional(),
  links: z.array(ItemLinkSchema).default([]),
});

export const ItemUpdateSchema = ItemCreateSchema.partial();

export const PurchaseItemSchema = z.object({
  purchasedAt: z.string().min(1, "Purchase date is required"),
  priceValue: z.number().nonnegative().optional().nullable(),
  priceCurrency: z.enum(["PEN", "USD", "EUR"]).optional(),
  createTransaction: z.boolean().default(false),
  transactionData: z.object({
    accountId: z.string().optional(),
    cardId: z.string().optional(),
    category: z.string().min(1),
    notes: z.string().optional(),
  }).optional(),
});

export const ReorderSchema = z.object({
  items: z.array(z.object({ id: z.string(), order: z.number().int() })).min(1),
});

export type BoardCreateInput = z.infer<typeof BoardCreateSchema>;
export type BoardUpdateInput = z.infer<typeof BoardUpdateSchema>;
export type ListCreateInput = z.infer<typeof ListCreateSchema>;
export type ListUpdateInput = z.infer<typeof ListUpdateSchema>;
export type ItemCreateInput = z.infer<typeof ItemCreateSchema>;
export type ItemUpdateInput = z.infer<typeof ItemUpdateSchema>;
export type PurchaseItemInput = z.infer<typeof PurchaseItemSchema>;
export type ReorderInput = z.infer<typeof ReorderSchema>;
