/**
 * Mock data for financial summary calculations.
 */

import { IFinancialSummary } from "@/shared/types/finance";
import { IAmount } from "@/shared/types";
import { mockAccounts } from "./accounts";
import { mockCreditCards } from "./credit-cards";
import { mockSubscriptions } from "./subscriptions";
import { mockUpcomingPayments } from "./payments";
import { createAmount, convertToPEN } from "./helpers";

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
    .reduce((sum, sub) => sum + convertToPEN(sub.amount), 0);
  
  return createAmount(total);
};

export const mockFinancialSummary: IFinancialSummary = {
  totalBalance: calculateTotalBalance(),
  totalCreditCardDebt: calculateTotalCreditCardDebt(),
  totalAvailableCredit: calculateTotalAvailableCredit(),
  monthlySubscriptionCost: calculateMonthlySubscriptionCost(),
  upcomingPayments: mockUpcomingPayments,
};
