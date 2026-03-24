/**
 * Mock data for WARDIA development and testing.
 * All data is strictly typed and represents realistic financial scenarios.
 */

import {
  IAccount,
  ICreditCard,
  ISubscription,
  IUpcomingPayment,
  IFinancialSummary,
  IBankCredentials,
} from "@/types/finance";
import { IAmount } from "@/types";

// Helper functions for creating amounts
const createAmount = (value: number, currency: "PEN" | "USD" | "EUR" = "PEN"): IAmount => ({
  value,
  currency,
});

// Mock Bank Accounts
export const mockAccounts: IAccount[] = [
  {
    id: "acc-1",
    bankName: "Banco de Crédito del Perú (BCP)",
    accountType: "checking",
    accountNumber: "19412345678901",
    cci: "00219412345678901234",
    balance: createAmount(8450.75),
    lastUpdated: new Date("2026-03-22T10:30:00"),
    isDefault: true,
  },
  {
    id: "acc-2",
    bankName: "Interbank",
    accountType: "savings",
    accountNumber: "20098765432109",
    cci: "00320098765432109876",
    balance: createAmount(15200.00),
    lastUpdated: new Date("2026-03-22T09:15:00"),
    isDefault: false,
  },
  {
    id: "acc-3",
    bankName: "BBVA Perú",
    accountType: "savings",
    accountNumber: "00115678901234",
    cci: "01100115678901234567",
    balance: createAmount(3780.50),
    lastUpdated: new Date("2026-03-21T16:45:00"),
    isDefault: false,
  },
];

// Mock Credit Cards
export const mockCreditCards: ICreditCard[] = [
  {
    id: "card-1",
    cardholderName: "Nirvana García Vásquez",
    cardNumber: "4532123456789012",
    network: "visa",
    expiryMonth: 8,
    expiryYear: 2028,
    status: "active",
    creditLimit: createAmount(10000.00),
    usedCredit: createAmount(3250.80),
    availableCredit: createAmount(6749.20),
    cutoffDay: 15,
    paymentDueDay: 5,
    lastStatementDate: new Date("2026-03-15T00:00:00"),
    nextPaymentDate: new Date("2026-04-05T00:00:00"),
    minimumPayment: createAmount(325.08),
  },
  {
    id: "card-2",
    cardholderName: "Nirvana García Vásquez",
    cardNumber: "5425987654321098",
    network: "mastercard",
    expiryMonth: 12,
    expiryYear: 2027,
    status: "active",
    creditLimit: createAmount(5000.00),
    usedCredit: createAmount(1890.45),
    availableCredit: createAmount(3109.55),
    cutoffDay: 20,
    paymentDueDay: 10,
    lastStatementDate: new Date("2026-03-20T00:00:00"),
    nextPaymentDate: new Date("2026-04-10T00:00:00"),
    minimumPayment: createAmount(189.05),
  },
  {
    id: "card-3",
    cardholderName: "Nirvana García Vásquez",
    cardNumber: "378282246310005",
    network: "amex",
    expiryMonth: 6,
    expiryYear: 2029,
    status: "active",
    creditLimit: createAmount(15000.00),
    usedCredit: createAmount(780.00),
    availableCredit: createAmount(14220.00),
    cutoffDay: 25,
    paymentDueDay: 15,
    lastStatementDate: new Date("2026-02-25T00:00:00"),
    nextPaymentDate: new Date("2026-03-15T00:00:00"),
    minimumPayment: createAmount(78.00),
  },
];

// Mock Subscriptions
export const mockSubscriptions: ISubscription[] = [
  // Entertainment
  {
    id: "sub-1",
    name: "Netflix Premium",
    description: "4K streaming, 4 screens",
    amount: createAmount(49.90),
    frequency: "monthly",
    nextPaymentDate: new Date("2026-04-01T00:00:00"),
    status: "active",
    category: "Entretenimiento",
    cardId: "card-1",
    merchantUrl: "https://netflix.com",
    autoRenewal: true,
  },
  {
    id: "sub-2",
    name: "Spotify Premium",
    description: "Individual plan",
    amount: createAmount(19.90),
    frequency: "monthly",
    nextPaymentDate: new Date("2026-03-28T00:00:00"),
    status: "active",
    category: "Entretenimiento",
    cardId: "card-1",
    merchantUrl: "https://spotify.com",
    autoRenewal: true,
  },
  {
    id: "sub-5",
    name: "Amazon Prime",
    description: "Free shipping & Prime Video",
    amount: createAmount(39.90),
    frequency: "monthly",
    nextPaymentDate: new Date("2026-03-30T00:00:00"),
    status: "active",
    category: "Entretenimiento",
    cardId: "card-1",
    merchantUrl: "https://amazon.com",
    autoRenewal: true,
  },
  // Productivity
  {
    id: "sub-3",
    name: "ChatGPT Plus",
    description: "GPT-4 access",
    amount: createAmount(20.00, "USD"),
    frequency: "monthly",
    nextPaymentDate: new Date("2026-03-25T00:00:00"),
    status: "active",
    category: "productivity",
    cardId: "card-2",
    merchantUrl: "https://openai.com",
    autoRenewal: true,
  },
  {
    id: "sub-6",
    name: "GitHub Copilot",
    description: "AI pair programmer",
    amount: createAmount(10.00, "USD"),
    frequency: "monthly",
    nextPaymentDate: new Date("2026-04-15T00:00:00"),
    status: "active",
    category: "productivity",
    cardId: "card-2",
    merchantUrl: "https://github.com",
    autoRenewal: true,
  },
  // Health & Fitness
  {
    id: "sub-4",
    name: "Gimnasio FitLife",
    description: "Membresía completa",
    amount: createAmount(150.00),
    frequency: "monthly",
    nextPaymentDate: new Date("2026-04-10T00:00:00"),
    status: "active",
    category: "health",
    accountId: "acc-1",
    autoRenewal: true,
  },
  // Utilities & Basic Services
  {
    id: "sub-7",
    name: "Luz del Sur",
    description: "Servicio de electricidad",
    amount: createAmount(180.00),
    frequency: "monthly",
    nextPaymentDate: new Date("2026-04-05T00:00:00"),
    status: "active",
    category: "utilities",
    accountId: "acc-1",
    autoRenewal: false,
  },
  {
    id: "sub-8",
    name: "Sedapal",
    description: "Servicio de agua y alcantarillado",
    amount: createAmount(85.00),
    frequency: "monthly",
    nextPaymentDate: new Date("2026-04-08T00:00:00"),
    status: "active",
    category: "utilities",
    accountId: "acc-1",
    autoRenewal: false,
  },
  {
    id: "sub-9",
    name: "Movistar Fibra",
    description: "Internet 600 Mbps + TV",
    amount: createAmount(120.00),
    frequency: "monthly",
    nextPaymentDate: new Date("2026-04-12T00:00:00"),
    status: "active",
    category: "telecom",
    cardId: "card-1",
    merchantUrl: "https://movistar.com.pe",
    autoRenewal: true,
  },
  {
    id: "sub-10",
    name: "Claro Postpago",
    description: "Plan móvil ilimitado",
    amount: createAmount(89.90),
    frequency: "monthly",
    nextPaymentDate: new Date("2026-04-15T00:00:00"),
    status: "active",
    category: "telecom",
    cardId: "card-2",
    autoRenewal: true,
  },
  // Housing
  {
    id: "sub-11",
    name: "Alquiler de Departamento",
    description: "Miraflores, 2 dormitorios",
    amount: createAmount(1800.00),
    frequency: "monthly",
    nextPaymentDate: new Date("2026-04-01T00:00:00"),
    status: "active",
    category: "housing",
    accountId: "acc-2",
    autoRenewal: false,
  },
  {
    id: "sub-12",
    name: "Mantenimiento de Edificio",
    description: "Cuota mensual",
    amount: createAmount(250.00),
    frequency: "monthly",
    nextPaymentDate: new Date("2026-04-01T00:00:00"),
    status: "active",
    category: "housing",
    accountId: "acc-1",
    autoRenewal: false,
  },
];

// Mock Upcoming Payments
export const mockUpcomingPayments: IUpcomingPayment[] = [
  {
    id: "payment-1",
    name: "ChatGPT Plus",
    amount: createAmount(20.00, "USD"),
    dueDate: new Date("2026-03-25T00:00:00"),
    type: "subscription",
    isUrgent: true,
  },
  {
    id: "payment-2",
    name: "Spotify Premium",
    amount: createAmount(19.90),
    dueDate: new Date("2026-03-28T00:00:00"),
    type: "subscription",
    isUrgent: true,
  },
  {
    id: "payment-3",
    name: "Amazon Prime",
    amount: createAmount(39.90),
    dueDate: new Date("2026-03-30T00:00:00"),
    type: "subscription",
    isUrgent: false,
  },
  {
    id: "payment-4",
    name: "Netflix Premium",
    amount: createAmount(49.90),
    dueDate: new Date("2026-04-01T00:00:00"),
    type: "subscription",
    isUrgent: false,
  },
  {
    id: "payment-5",
    name: "Alquiler + Mantenimiento",
    amount: createAmount(2050.00),
    dueDate: new Date("2026-04-01T00:00:00"),
    type: "loan",
    isUrgent: false,
  },
  {
    id: "payment-6",
    name: "Visa BCP - Pago Mínimo",
    amount: createAmount(325.08),
    dueDate: new Date("2026-04-05T00:00:00"),
    type: "card",
    isUrgent: false,
  },
];

// Mock Bank Credentials
export const mockBankCredentials: IBankCredentials[] = [
  {
    id: "cred-1",
    bankName: "Banco de Crédito del Perú (BCP)",
    username: "nirvana.garcia",
    password: "MySecurePass123!",
    digitalKey: "456789",
    securityToken: "TOKEN-BCP-2026",
    notes: "Usar clave digital para transferencias mayores a S/ 5,000",
    lastUpdated: new Date("2026-03-15T10:00:00"),
  },
  {
    id: "cred-2",
    bankName: "Interbank",
    username: "ngarcia@email.com",
    password: "Inter@Secure2026",
    digitalKey: "789012",
    lastUpdated: new Date("2026-02-28T14:30:00"),
  },
  {
    id: "cred-3",
    bankName: "BBVA Perú",
    username: "nirvana_garcia",
    password: "BBVA#Strong99",
    securityToken: "BBVA-TOKEN-XYZ",
    notes: "Recordar cambiar contraseña cada 90 días",
    lastUpdated: new Date("2026-03-01T09:20:00"),
  },
];

// Calculate totals for financial summary
const calculateTotalBalance = (): IAmount => {
  const total = mockAccounts.reduce((sum, acc) => sum + acc.balance.value, 0);
  return createAmount(total);
};

const calculateTotalCreditCardDebt = (): IAmount => {
  const total = mockCreditCards.reduce((sum, card) => sum + card.usedCredit.value, 0);
  return createAmount(total);
};

const calculateTotalAvailableCredit = (): IAmount => {
  const total = mockCreditCards.reduce((sum, card) => sum + card.availableCredit.value, 0);
  return createAmount(total);
};

const calculateMonthlySubscriptionCost = (): IAmount => {
  const total = mockSubscriptions
    .filter((sub) => sub.frequency === "monthly" && sub.status === "active")
    .reduce((sum, sub) => {
      // Convert USD to PEN for simplification (use hardcoded rate)
      const valueInPEN = sub.amount.currency === "USD" ? sub.amount.value * 3.75 : sub.amount.value;
      return sum + valueInPEN;
    }, 0);
  return createAmount(total);
};

// Mock Financial Summary
export const mockFinancialSummary: IFinancialSummary = {
  totalBalance: calculateTotalBalance(),
  totalCreditCardDebt: calculateTotalCreditCardDebt(),
  totalAvailableCredit: calculateTotalAvailableCredit(),
  monthlySubscriptionCost: calculateMonthlySubscriptionCost(),
  upcomingPayments: mockUpcomingPayments,
};
