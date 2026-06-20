/**
 * Zod validation schemas for WARDIA application.
 * Provides runtime type validation for forms and API data.
 */

import { z } from "zod";

// ============================================================================
// BASE SCHEMAS
// ============================================================================

/**
 * Amount schema with value and currency
 */
export const amountSchema = z.object({
  value: z.number().min(0, "Amount must be positive"),
  currency: z.string().min(3).max(3),
});

/**
 * Date schema that accepts Date objects or ISO strings
 */
export const dateSchema = z.union([
  z.date(),
  z.string().datetime(),
]).transform((val) => (typeof val === "string" ? new Date(val) : val));

// ============================================================================
// ACCOUNT SCHEMAS
// ============================================================================

/**
 * Debit card schema
 */
export const debitCardSchema = z.object({
  cardNumber: z.string()
    .regex(/^\d{16}$/, "Card number must be 16 digits")
    .or(z.string().regex(/^\d{4}\s\d{4}\s\d{4}\s\d{4}$/, "Invalid card format")),
  cardNetwork: z.enum(["visa", "mastercard", "amex", "discover", "other"]),
  expiryDate: z.string()
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Expiry must be MM/YY format"),
  cvv: z.string()
    .regex(/^\d{3,4}$/, "CVV must be 3 or 4 digits"),
});

/**
 * Bank account schema
 */
export const accountSchema = z.object({
  id: z.string().min(1),
  bankName: z.string().min(2, "Bank name is required"),
  accountName: z.string().min(2, "Account name is required"),
  accountType: z.enum(["checking", "savings", "investment"]),
  accountNumber: z.string()
    .min(8, "Account number must be at least 8 characters")
    .max(20, "Account number too long"),
  balance: amountSchema,
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid color format"),
  icon: z.string().optional(),
  isDefault: z.boolean().default(false),
  debitCard: debitCardSchema.optional(),
});

/**
 * Credit card schema
 */
export const creditCardSchema = z.object({
  id: z.string().min(1),
  cardName: z.string().min(2, "Card name is required"),
  cardNetwork: z.enum(["visa", "mastercard", "amex", "discover", "other"]),
  lastFourDigits: z.string()
    .regex(/^\d{4}$/, "Must be exactly 4 digits"),
  expiryDate: z.string()
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Expiry must be MM/YY format"),
  creditLimit: amountSchema,
  usedCredit: amountSchema,
  availableCredit: amountSchema,
  paymentDueDate: dateSchema,
  minimumPayment: amountSchema,
  interestRate: z.number().min(0).max(100),
  status: z.enum(["active", "inactive", "blocked"]),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid color format"),
});

/**
 * Bank credentials schema
 */
export const credentialsSchema = z.object({
  id: z.string().min(1),
  bankName: z.string().min(2, "Bank name is required"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  lastAccessed: dateSchema.optional(),
  accountsLinked: z.number().int().min(0).default(0),
});

// ============================================================================
// TRANSACTION SCHEMAS
// ============================================================================

/**
 * Transaction schema
 */
export const transactionSchema = z.object({
  id: z.string().min(1),
  type: z.enum(["income", "expense"]),
  category: z.string().min(1, "Category is required"),
  amount: amountSchema,
  description: z.string().min(2, "Description is required"),
  merchant: z.string().optional(),
  date: dateSchema,
  accountId: z.string().optional(),
  status: z.enum(["completed", "pending", "cancelled"]).default("completed"),
});

// ============================================================================
// SERVICE/SUBSCRIPTION SCHEMAS
// ============================================================================

/**
 * Subscription schema
 */
export const subscriptionSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(2, "Service name is required"),
  description: z.string().optional(),
  amount: amountSchema,
  frequency: z.enum(["daily", "weekly", "monthly", "quarterly", "yearly"]),
  nextPaymentDate: dateSchema,
  status: z.enum(["active", "paused", "cancelled"]).default("active"),
  category: z.string().min(1, "Category is required"),
  accountId: z.string().optional(),
  cardId: z.string().optional(),
  merchantUrl: z.string().url().optional().or(z.literal("")),
  autoRenewal: z.boolean().default(true),
});

// ============================================================================
// FORM SCHEMAS (for modals)
// ============================================================================

/**
 * Add account form schema (without id)
 */
export const addAccountFormSchema = accountSchema.omit({ id: true });

/**
 * Edit account form schema (partial, allows updating specific fields)
 */
export const editAccountFormSchema = accountSchema.partial().required({ id: true });

/**
 * Add credit card form schema
 */
export const addCreditCardFormSchema = creditCardSchema.omit({ 
  id: true,
  availableCredit: true,
});

/**
 * Add transaction form schema
 */
export const addTransactionFormSchema = transactionSchema.omit({ id: true });

/**
 * Edit transaction form schema
 */
export const editTransactionFormSchema = transactionSchema.partial().required({ id: true });

/**
 * Add subscription form schema
 */
export const addSubscriptionFormSchema = subscriptionSchema.omit({ id: true });

/**
 * Edit subscription form schema
 */
export const editSubscriptionFormSchema = subscriptionSchema.partial().required({ id: true });

/**
 * Bank credentials form schema
 */
export const addCredentialsFormSchema = credentialsSchema.omit({ 
  id: true,
  lastAccessed: true,
  accountsLinked: true,
}).extend({
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
});

// ============================================================================
// USER/PROFILE SCHEMAS
// ============================================================================

/**
 * Change password schema
 */
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[a-z]/, "Must contain at least one lowercase letter")
    .regex(/[0-9]/, "Must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Must contain at least one special character"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

/**
 * User preferences schema
 */
export const userPreferencesSchema = z.object({
  language: z.enum(["es", "en"]),
  currency: z.enum(["PEN", "USD", "EUR", "GBP"]),
  theme: z.enum(["light", "dark", "system"]),
  notifications: z.object({
    email: z.boolean().default(true),
    push: z.boolean().default(true),
    sms: z.boolean().default(false),
    paymentReminders: z.boolean().default(true),
    securityAlerts: z.boolean().default(true),
  }),
});

// ============================================================================
// MODAL FORM SCHEMAS (practical, lenient versions for UI forms)
// ============================================================================

export const bankCredentialModalSchema = z.object({
  bankName: z.string().min(1, "Bank name is required"),
  credentialName: z.string().optional().or(z.literal("")),
  description: z.string().optional().or(z.literal("")),
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});
export type BankCredentialModalData = z.infer<typeof bankCredentialModalSchema>;

export const debitCardModalSchema = z.object({
  bankName: z.string().min(1, "Bank name is required"),
  cardName: z.string().min(1, "Card name is required"),
  accountType: z.enum(["savings", "checking"]),
  cardNetwork: z.enum(["visa", "mastercard", "amex", "discover"]),
  accountNumber: z.string().min(1, "Account number is required"),
  cci: z.string().optional().or(z.literal("")),
  expiryMonth: z.number().int().min(1).max(12),
  expiryYear: z.number().int().min(2024),
  cvv: z.string().min(3).max(4),
});
export type DebitCardModalData = z.infer<typeof debitCardModalSchema>;

export const creditCardModalSchema = z.object({
  bankName: z.string().min(1, "Bank name is required"),
  cardName: z.string().min(1, "Card name is required"),
  cardholderName: z.string().min(1, "Cardholder name is required"),
  accountType: z.enum(["savings", "checking"]).optional(),
  cardNetwork: z.enum(["visa", "mastercard", "amex", "discover"]),
  creditLimitValue: z.number().min(0),
  creditLimitCurrency: z.enum(["PEN", "USD", "EUR"]),
  cutoffDay: z.number().int().min(1).max(31),
  accountNumber: z.string().optional().or(z.literal("")),
  cci: z.string().optional().or(z.literal("")),
  expiryMonth: z.number().int().min(1).max(12),
  expiryYear: z.number().int().min(2024),
  cvv: z.string().min(3).max(4),
});
export type CreditCardModalData = z.infer<typeof creditCardModalSchema>;

// Legacy alias kept for compatibility during transition
export const credentialsModalSchema = bankCredentialModalSchema;
export type CredentialsModalData = BankCredentialModalData;

export const serviceModalSchema = z.object({
  name: z.string().min(1, "Service name is required"),
  description: z.string().optional().or(z.literal("")),
  category: z.string().min(1, "Category is required"),
  amount: z.string().refine(
    (v) => !isNaN(parseFloat(v)) && parseFloat(v) > 0,
    "Amount must be a positive number"
  ),
  currency: z.enum(["PEN", "USD", "EUR"]),
  frequency: z.enum(["monthly", "yearly", "weekly", "quarterly"]),
  nextPaymentDate: z.string().min(1, "Date is required"),
  status: z.enum(["active", "paused", "cancelled"]),
  autoRenewal: z.boolean(),
});
export type ServiceModalData = z.infer<typeof serviceModalSchema>;

export const transactionModalSchema = z.object({
  type: z.enum(["income", "expense", "transfer"]),
  category: z.string().min(1, "Category is required"),
  description: z.string().min(1, "Description is required"),
  amount: z.string().refine(
    (v) => !isNaN(parseFloat(v)) && parseFloat(v) > 0,
    "Amount must be a positive number"
  ),
  currency: z.enum(["PEN", "USD", "EUR"]),
  merchant: z.string().optional().or(z.literal("")),
  date: z.string().min(1, "Date is required"),
  notes: z.string().optional().or(z.literal("")),
  status: z.enum(["pending", "completed", "failed"]),
});
export type TransactionModalData = z.infer<typeof transactionModalSchema>;

// ============================================================================
// TYPE INFERENCE
// ============================================================================

export type AmountInput = z.infer<typeof amountSchema>;
export type AccountInput = z.infer<typeof accountSchema>;
export type AddAccountInput = z.infer<typeof addAccountFormSchema>;
export type EditAccountInput = z.infer<typeof editAccountFormSchema>;
export type CreditCardInput = z.infer<typeof creditCardSchema>;
export type AddCreditCardInput = z.infer<typeof addCreditCardFormSchema>;
export type TransactionInput = z.infer<typeof transactionSchema>;
export type AddTransactionInput = z.infer<typeof addTransactionFormSchema>;
export type EditTransactionInput = z.infer<typeof editTransactionFormSchema>;
export type SubscriptionInput = z.infer<typeof subscriptionSchema>;
export type AddSubscriptionInput = z.infer<typeof addSubscriptionFormSchema>;
export type EditSubscriptionInput = z.infer<typeof editSubscriptionFormSchema>;
export type AddCredentialsInput = z.infer<typeof addCredentialsFormSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type UserPreferencesInput = z.infer<typeof userPreferencesSchema>;
