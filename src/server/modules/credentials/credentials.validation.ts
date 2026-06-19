import { z } from "zod";

export const CredentialCreateSchema = z.object({
  type: z.enum(["bank", "debit", "credit"]),
  bankName: z.string().min(1),
  credentialName: z.string().optional(),
  description: z.string().optional(),

  username: z.string().optional(),
  password: z.string().optional(),

  cardName: z.string().optional(),
  cardNetwork: z.enum(["visa", "mastercard", "amex", "discover"]).optional(),
  accountNumber: z.string().optional(),
  cci: z.string().optional(),
  expiryMonth: z.number().int().min(1).max(12).optional(),
  expiryYear: z.number().int().min(2024).optional(),
  cvv: z.string().optional(),
  accountType: z.enum(["savings", "checking", "investment"]).optional(),

  cardholderName: z.string().optional(),
  creditLimitValue: z.number().optional(),
  creditLimitCurrency: z.string().optional(),
  cutoffDay: z.number().int().min(1).max(31).optional(),
});

export const CredentialUpdateSchema = CredentialCreateSchema.partial();

export type CredentialCreateInput = z.infer<typeof CredentialCreateSchema>;
export type CredentialUpdateInput = z.infer<typeof CredentialUpdateSchema>;

