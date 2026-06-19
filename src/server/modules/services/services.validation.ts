import { z } from "zod";

export const ServiceCreateSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  category: z.enum(["housing", "utilities", "telecom", "health", "productivity", "entertainment"]),
  iconUrl: z.string().optional(),
  amountValue: z.number().positive(),
  amountCurrency: z.enum(["PEN", "USD", "EUR"]).default("PEN"),
  frequency: z.enum(["monthly", "yearly", "weekly", "quarterly"]),
  nextPaymentDate: z.string().min(1),
  status: z.enum(["active", "paused", "cancelled"]).default("active"),
  autoRenewal: z.boolean().default(true),
});

export const ServiceUpdateSchema = ServiceCreateSchema.partial();

export type ServiceCreateInput = z.infer<typeof ServiceCreateSchema>;
export type ServiceUpdateInput = z.infer<typeof ServiceUpdateSchema>;
