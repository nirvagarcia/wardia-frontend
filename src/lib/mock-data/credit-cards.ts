/**
 * Mock data for credit cards.
 */

import { ICreditCard } from "@/types/finance";
import { createAmount } from "./helpers";

export const mockCreditCards: ICreditCard[] = [
  {
    id: "card-1",
    bankName: "Banco de Crédito del Perú (BCP)",
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
    bankName: "Interbank",
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
    bankName: "BBVA Perú",
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
