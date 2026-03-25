/**
 * Form Validation Helpers
 * Validation functions for account and credit card forms.
 */

import type { IAccount, ICreditCard, AccountType, CardNetwork } from "@/types/finance";
import type { Currency } from "@/store/preferences-store";

export interface AccountFormData {
  bankName: string;
  accountNumber: string;
  cci: string;
  balance: string;
  accountSubType: AccountType;
  isDefault: boolean;
  cvv: string;
  network: CardNetwork;
  expiryMonth: string;
  expiryYear: string;
}

export interface CreditCardFormData {
  bankName: string;
  cardholderName: string;
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  network: CardNetwork;
  creditLimit: string;
  usedCredit: string;
  cutoffDay: string;
  paymentDueDay: string;
}

export function validateAccountForm(
  formData: AccountFormData,
  t: (key: string) => string
): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!formData.bankName.trim()) {
    errors.bankName = t("forms.bankNameRequired");
  }

  if (!formData.accountNumber) {
    errors.accountNumber = t("forms.accountNumberRequired");
  }

  if (!formData.cci) {
    errors.cci = t("forms.cciRequired");
  }

  if (!formData.balance || parseFloat(formData.balance) < 0) {
    errors.balance = t("forms.invalidBalance");
  }

  return errors;
}

export function validateCreditCardForm(
  formData: CreditCardFormData,
  t: (key: string) => string
): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!formData.bankName.trim()) {
    errors.bankName = t("forms.bankNameRequired");
  }

  if (!formData.cardholderName) {
    errors.cardholderName = t("forms.cardholderNameRequired");
  }

  if (!formData.cardNumber || formData.cardNumber.length < 15) {
    errors.cardNumber = t("forms.invalidCardNumber");
  }

  if (!formData.expiryMonth || !formData.expiryYear) {
    errors.expiry = t("forms.expiryRequired");
  }

  if (!formData.creditLimit || parseFloat(formData.creditLimit) <= 0) {
    errors.creditLimit = t("forms.invalidCreditLimit");
  }

  if (!formData.usedCredit || parseFloat(formData.usedCredit) < 0) {
    errors.usedCredit = t("forms.invalidUsedCredit");
  }

  return errors;
}

export function buildAccountFromForm(
  formData: AccountFormData,
  currency: Currency
): Omit<IAccount, "id" | "lastUpdated"> {
  return {
    bankName: formData.bankName,
    accountType: formData.accountSubType,
    accountNumber: formData.accountNumber,
    cci: formData.cci,
    balance: {
      value: parseFloat(formData.balance),
      currency: currency,
    },
    isDefault: formData.isDefault,
    network: formData.network,
    cvv: formData.cvv || "000",
    expiryMonth: parseInt(formData.expiryMonth) || 12,
    expiryYear: parseInt(formData.expiryYear) || 2030,
  };
}

export function buildCreditCardFromForm(
  formData: CreditCardFormData,
  currency: Currency
): Omit<ICreditCard, "id" | "lastStatementDate" | "nextPaymentDate" | "minimumPayment"> {
  const usedCreditValue = parseFloat(formData.usedCredit);
  const creditLimitValue = parseFloat(formData.creditLimit);

  return {
    bankName: formData.bankName,
    cardholderName: formData.cardholderName,
    cardNumber: formData.cardNumber,
    network: formData.network,
    expiryMonth: parseInt(formData.expiryMonth),
    expiryYear: parseInt(formData.expiryYear),
    status: "active",
    creditLimit: {
      value: creditLimitValue,
      currency: currency,
    },
    usedCredit: {
      value: usedCreditValue,
      currency: currency,
    },
    availableCredit: {
      value: creditLimitValue - usedCreditValue,
      currency: currency,
    },
    cutoffDay: parseInt(formData.cutoffDay) || 15,
    paymentDueDay: parseInt(formData.paymentDueDay) || 5,
  };
}
