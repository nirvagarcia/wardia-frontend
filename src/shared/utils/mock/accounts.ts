/**
 * Mock data for bank accounts.
 */

import { IAccount } from "@/shared/types/finance";
import { createAmount } from "./helpers";

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
    network: "visa",
    cvv: "123",
    expiryMonth: 8,
    expiryYear: 2028,
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
    network: "mastercard",
    cvv: "456",
    expiryMonth: 12,
    expiryYear: 2027,
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
    network: "visa",
    cvv: "789",
    expiryMonth: 6,
    expiryYear: 2029,
  },
];
