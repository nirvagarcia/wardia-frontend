"use client";

/**
 * Add Account Modal Component  
 * Form for adding/editing bank accounts or credit cards
 */

import React, { useState, useEffect, useMemo } from "react";
import { usePreferencesStore } from "@/shared/stores/preferences-store";
import { getTranslation } from "@/shared/langs";
import type { IAccount, ICreditCard } from "@/shared/types/finance";
import { AccountFormFields } from "./account-form-fields";
import { CreditCardFormFields } from "./credit-card-form-fields";
import { ModalHeader } from "@/shared/components/modals/modal-header";
import { AccountTypeSelector } from "./account-type-selector";
import { ModalActions } from "@/shared/components/modals/modal-actions";
import {
  validateAccountForm,
  validateCreditCardForm,
  buildAccountFromForm,
  buildCreditCardFromForm,
  type AccountFormData,
  type CreditCardFormData,
} from "./form-validation";

interface AddAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddAccount: (account: Omit<IAccount, "id" | "lastUpdated">) => void;
  onAddCard: (card: Omit<ICreditCard, "id" | "lastStatementDate" | "nextPaymentDate" | "minimumPayment">) => void;
  editingAccount?: IAccount | null;
  editingCard?: ICreditCard | null;
  onUpdateAccount?: (id: string, account: Omit<IAccount, "id" | "lastUpdated">) => void;
  onUpdateCard?: (id: string, card: Omit<ICreditCard, "id" | "lastStatementDate" | "nextPaymentDate" | "minimumPayment">) => void;
}

type ModalAccountType = "debit" | "credit";

export function AddAccountModal({
  isOpen,
  onClose,
  onAddAccount,
  onAddCard,
  editingAccount,
  editingCard,
  onUpdateAccount,
  onUpdateCard,
}: AddAccountModalProps): React.JSX.Element | null {
  const { language, currency } = usePreferencesStore();
  const t = (key: string) => getTranslation(language, key);

  const [accountType, setAccountType] = useState<ModalAccountType>(
    editingAccount ? "debit" : editingCard ? "credit" : "debit"
  );

  const initialAccountFormData: AccountFormData = useMemo(() => ({
    bankName: "",
    accountNumber: "",
    cci: "",
    balance: "",
    accountSubType: "checking",
    isDefault: false,
    cvv: "",
    network: "visa",
    expiryMonth: "",
    expiryYear: "",
  }), []);

  const initialCreditCardFormData: CreditCardFormData = useMemo(() => ({
    bankName: "",
    cardholderName: "",
    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
    network: "visa",
    creditLimit: "",
    usedCredit: "",
    cutoffDay: "",
    paymentDueDay: "",
  }), []);

  const [accountFormData, setAccountFormData] = useState<AccountFormData>(initialAccountFormData);
  const [creditCardFormData, setCreditCardFormData] = useState<CreditCardFormData>(initialCreditCardFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!isOpen) return;

    if (editingAccount) {
      setAccountType("debit");
      setAccountFormData({
        bankName: editingAccount.bankName,
        accountNumber: editingAccount.accountNumber,
        cci: editingAccount.cci,
        balance: editingAccount.balance.value.toString(),
        accountSubType: editingAccount.accountType,
        isDefault: editingAccount.isDefault,
        network: editingAccount.network,
        cvv: editingAccount.cvv,
        expiryMonth: editingAccount.expiryMonth.toString(),
        expiryYear: editingAccount.expiryYear.toString(),
      });
    } else if (editingCard) {
      setAccountType("credit");
      setCreditCardFormData({
        bankName: editingCard.bankName,
        cardholderName: editingCard.cardholderName,
        cardNumber: editingCard.cardNumber,
        expiryMonth: editingCard.expiryMonth.toString(),
        expiryYear: editingCard.expiryYear.toString(),
        network: editingCard.network,
        creditLimit: editingCard.creditLimit.value.toString(),
        usedCredit: editingCard.usedCredit.value.toString(),
        cutoffDay: editingCard.cutoffDay.toString(),
        paymentDueDay: editingCard.paymentDueDay.toString(),
      });
    } else {
      setAccountFormData(initialAccountFormData);
      setCreditCardFormData(initialCreditCardFormData);
      setErrors({});
    }
  }, [isOpen, editingAccount, editingCard, initialAccountFormData, initialCreditCardFormData]);

  if (!isOpen) return null;

  const isEditMode = !!(editingAccount || editingCard);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (accountType === "debit") {
      const validationErrors = validateAccountForm(accountFormData, t);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }

      const newAccount = buildAccountFromForm(accountFormData, currency);

      if (isEditMode && editingAccount && onUpdateAccount) {
        onUpdateAccount(editingAccount.id, newAccount);
      } else {
        onAddAccount(newAccount);
      }
    } else {
      const validationErrors = validateCreditCardForm(creditCardFormData, t);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }

      const newCard = buildCreditCardFromForm(creditCardFormData, currency);

      if (isEditMode && editingCard && onUpdateCard) {
        onUpdateCard(editingCard.id, newCard);
      } else {
        onAddCard(newCard);
      }
    }

    setAccountFormData(initialAccountFormData);
    setCreditCardFormData(initialCreditCardFormData);
    setErrors({});
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4" onClick={onClose}>
      <div
        className="bg-white dark:bg-zinc-900 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <ModalHeader
          title={isEditMode ? t("forms.editAccount") : t("forms.addAccount")}
          onClose={onClose}
        />

        <form onSubmit={handleSubmit} className="p-6 space-y-6" autoComplete="off">
          <AccountTypeSelector
            selectedType={accountType}
            onTypeChange={setAccountType}
            disabled={isEditMode}
            debitLabel={t("accounts.debit")}
            creditLabel={t("accounts.credit")}
          />

          {accountType === "debit" ? (
            <AccountFormFields
              formData={accountFormData}
              errors={errors}
              onChange={(updates) => setAccountFormData({ ...accountFormData, ...updates })}
              t={t}
            />
          ) : (
            <CreditCardFormFields
              formData={creditCardFormData}
              errors={errors}
              onChange={(updates) => setCreditCardFormData({ ...creditCardFormData, ...updates })}
              t={t}
            />
          )}

          <ModalActions
            onCancel={onClose}
            onSubmit={() => {}}
            cancelLabel={t("forms.cancel")}
            submitLabel={isEditMode ? t("forms.save") : t("forms.add")}
          />
        </form>
      </div>
    </div>
  );
}
