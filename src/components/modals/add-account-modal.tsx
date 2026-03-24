"use client";

/**
 * Add Account Modal Component
 * Form for adding/editing bank accounts or credit cards
 */

import React, { useState, useEffect } from "react";
import { usePreferencesStore } from "@/store/preferences-store";
import { getTranslation } from "@/lib/i18n";
import { X, Building2, CreditCard, Hash, Key, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";
import type { IAccount, ICreditCard, AccountType, CardNetwork } from "@/types/finance";

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
  onUpdateCard
}: AddAccountModalProps): React.JSX.Element | null {
  const { language, currency } = usePreferencesStore();
  const t = (key: string) => getTranslation(language, key);

  const [accountType, setAccountType] = useState<ModalAccountType>(
    editingAccount ? "debit" : editingCard ? "credit" : "debit"
  );
  const [formData, setFormData] = useState({
    bankName: "",
    
    accountNumber: "",
    cci: "",
    balance: "",
    accountSubType: "checking" as AccountType,
    isDefault: false,
    cvv: "",
    
    cardholderName: "",
    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
    network: "visa" as CardNetwork,
    creditLimit: "",
    usedCredit: "",
    cutoffDay: "",
    paymentDueDay: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const resetForm = () => {
    setFormData({
      bankName: "",
      accountNumber: "",
      cci: "",
      balance: "",
      accountSubType: "checking" as AccountType,
      isDefault: false,
      cvv: "",
      cardholderName: "",
      cardNumber: "",
      expiryMonth: "",
      expiryYear: "",
      network: "visa" as CardNetwork,
      creditLimit: "",
      usedCredit: "",
      cutoffDay: "",
      paymentDueDay: "",
    });
    setErrors({});
  };


  useEffect(() => {
    if (!isOpen) return;

    if (editingAccount) {
      setAccountType("debit");
      setFormData({
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
        cardholderName: "",
        cardNumber: "",
        creditLimit: "",
        usedCredit: "",
        cutoffDay: "",
        paymentDueDay: "",
      });
    } else if (editingCard) {
      setAccountType("credit");
      setFormData({
        bankName: editingCard.bankName,
        accountNumber: "",
        cci: "",
        balance: "",
        accountSubType: "checking",
        isDefault: false,
        network: editingCard.network,
        cvv: "",
        cardholderName: editingCard.cardholderName,
        cardNumber: editingCard.cardNumber,
        expiryMonth: editingCard.expiryMonth.toString(),
        expiryYear: editingCard.expiryYear.toString(),
        creditLimit: editingCard.creditLimit.value.toString(),
        usedCredit: editingCard.usedCredit.value.toString(),
        cutoffDay: editingCard.cutoffDay.toString(),
        paymentDueDay: editingCard.paymentDueDay.toString(),
      });
    } else {
      resetForm();
    }
  }, [isOpen, editingAccount, editingCard]);

  if (!isOpen) return null;

  const isEditMode = !!(editingAccount || editingCard);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};
    
    if (!formData.bankName.trim()) {
      newErrors.bankName = t("forms.bankNameRequired");
    }

    if (accountType === "debit") {
      if (!formData.accountNumber) newErrors.accountNumber = t("forms.accountNumberRequired");
      if (!formData.cci) newErrors.cci = t("forms.cciRequired");
      if (!formData.balance || parseFloat(formData.balance) < 0) {
        newErrors.balance = t("forms.invalidBalance");
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      const newAccount: Omit<IAccount, "id" | "lastUpdated"> = {
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

      if (isEditMode && editingAccount && onUpdateAccount) {
        onUpdateAccount(editingAccount.id, newAccount);
      } else {
        onAddAccount(newAccount);
      }
    } else {
      if (!formData.cardholderName) newErrors.cardholderName = t("forms.cardholderNameRequired");
      if (!formData.cardNumber || formData.cardNumber.length < 15) {
        newErrors.cardNumber = t("forms.invalidCardNumber");
      }
      if (!formData.expiryMonth || !formData.expiryYear) {
        newErrors.expiry = t("forms.expiryRequired");
      }
      if (!formData.creditLimit || parseFloat(formData.creditLimit) <= 0) {
        newErrors.creditLimit = t("forms.invalidCreditLimit");
      }
      if (!formData.usedCredit || parseFloat(formData.usedCredit) < 0) {
        newErrors.usedCredit = t("forms.invalidUsedCredit");
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      const usedCreditValue = parseFloat(formData.usedCredit);
      const creditLimitValue = parseFloat(formData.creditLimit);

      const newCard: Omit<ICreditCard, "id" | "lastStatementDate" | "nextPaymentDate" | "minimumPayment"> = {
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

      if (isEditMode && editingCard && onUpdateCard) {
        onUpdateCard(editingCard.id, newCard);
      } else {
        onAddCard(newCard);
      }
    }

    resetForm();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-white dark:bg-zinc-900 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-slide-up" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
            {isEditMode 
              ? t("forms.editAccount")
              : t("forms.addAccount")
            }
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-zinc-600 dark:text-zinc-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => !isEditMode && setAccountType("debit")}
              disabled={isEditMode}
              className={cn(
                "p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2",
                accountType === "debit"
                  ? "border-cyan-$100 bg-cyan-$100/10"
                  : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600",
                isEditMode && "opacity-50 cursor-not-allowed"
              )}
            >
              <Wallet className={cn("w-8 h-8", accountType === "debit" ? "text-cyan-$100" : "text-zinc-400")} />
              <span className={cn(
                "font-medium",
                accountType === "debit" ? "text-cyan-$100 dark:text-cyan-$100" : "text-zinc-600 dark:text-zinc-400"
              )}>
                {t("accounts.debit")}
              </span>
            </button>

            <button
              type="button"
              onClick={() => !isEditMode && setAccountType("credit")}
              disabled={isEditMode}
              className={cn(
                "p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2",
                accountType === "credit"
                  ? "border-cyan-$100 bg-cyan-$100/10"
                  : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600",
                isEditMode && "opacity-50 cursor-not-allowed"
              )}
            >
              <CreditCard className={cn("w-8 h-8", accountType === "credit" ? "text-cyan-$100" : "text-zinc-400")} />
              <span className={cn(
                "font-medium",
                accountType === "credit" ? "text-cyan-$100 dark:text-cyan-$100" : "text-zinc-600 dark:text-zinc-400"
              )}>
                {t("accounts.credit")}
              </span>
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-gray-300 mb-2">
              <Building2 className="w-4 h-4 inline mr-2" />
              {t("forms.bankName")}
            </label>
            <input
              type="text"
              value={formData.bankName}
              onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
              placeholder={t("forms.bankNamePlaceholder")}
              className={cn(
                "w-full px-4 py-3 rounded-xl border bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white",
                errors.bankName
                  ? "border-red-500"
                  : "border-zinc-200 dark:border-zinc-700 focus:border-cyan-$100"
              )}
            />
            {errors.bankName && <p className="text-red-500 text-sm mt-1">{errors.bankName}</p>}
          </div>

          {accountType === "debit" ? (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-gray-300 mb-2">
                    {t("forms.accountType")}
                  </label>
                  <select
                    value={formData.accountSubType}
                    onChange={(e) => setFormData({ ...formData, accountSubType: e.target.value as AccountType })}
                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white"
                  >
                    <option value="checking">{t("forms.accountTypeChecking")}</option>
                    <option value="savings">{t("forms.accountTypeSavings")}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-gray-300 mb-2">
                    {t("forms.cardNetwork")}
                  </label>
                  <select
                    value={formData.network}
                    onChange={(e) => setFormData({ ...formData, network: e.target.value as CardNetwork })}
                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white"
                  >
                    <option value="visa">VISA</option>
                    <option value="mastercard">Mastercard</option>
                    <option value="amex">American Express</option>
                    <option value="discover">Discover</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-gray-300 mb-2">
                  {t("forms.currentBalance")}
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.balance}
                  onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
                  placeholder="0.00"
                  className={cn(
                    "w-full px-4 py-3 rounded-xl border bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white",
                    errors.balance ? "border-red-500" : "border-zinc-200 dark:border-zinc-700"
                  )}
                />
                {errors.balance && <p className="text-red-500 text-sm mt-1">{errors.balance}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-gray-300 mb-2">
                  <Hash className="w-4 h-4 inline mr-2" />
                  {t("accounts.accountNumber")}
                </label>
                <input
                  type="text"
                  value={formData.accountNumber}
                  onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                  placeholder="194123456789"
                  className={cn(
                    "w-full px-4 py-3 rounded-xl border bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white font-mono",
                    errors.accountNumber ? "border-red-500" : "border-zinc-200 dark:border-zinc-700"
                  )}
                />
                {errors.accountNumber && <p className="text-red-500 text-sm mt-1">{errors.accountNumber}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-gray-300 mb-2">
                  <Key className="w-4 h-4 inline mr-2" />
                  CCI
                </label>
                <input
                  type="text"
                  value={formData.cci}
                  onChange={(e) => setFormData({ ...formData, cci: e.target.value })}
                  placeholder="00219412345678901234"
                  maxLength={20}
                  className={cn(
                    "w-full px-4 py-3 rounded-xl border bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white font-mono",
                    errors.cci ? "border-red-500" : "border-zinc-200 dark:border-zinc-700"
                  )}
                />
                {errors.cci && <p className="text-red-500 text-sm mt-1">{errors.cci}</p>}
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-zinc-700 dark:text-gray-300 mb-2">
                    {t("forms.expirationDate")}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      value={formData.expiryMonth}
                      onChange={(e) => setFormData({ ...formData, expiryMonth: e.target.value })}
                      placeholder="MM"
                      min="1"
                      max="12"
                      className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white font-mono text-center"
                    />
                    <input
                      type="number"
                      value={formData.expiryYear}
                      onChange={(e) => setFormData({ ...formData, expiryYear: e.target.value })}
                      placeholder="YYYY"
                      min="2024"
                      max="2040"
                      className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white font-mono text-center"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-gray-300 mb-2">
                    CVV
                  </label>
                  <input
                    type="text"
                    value={formData.cvv}
                    onChange={(e) => setFormData({ ...formData, cvv: e.target.value })}
                    placeholder="123"
                    maxLength={4}
                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white font-mono text-center"
                  />
                </div>
              </div>

              <label className="flex items-center gap-3 p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isDefault}
                  onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                  className="w-5 h-5 rounded border-zinc-300 text-cyan-$100 focus:ring-cyan-$100"
                />
                <span className="text-zinc-900 dark:text-white font-medium">
                  {t("forms.setAsDefault")}
                </span>
              </label>
            </>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-gray-300 mb-2">
                  {t("forms.cardholderName")}
                </label>
                <input
                  type="text"
                  value={formData.cardholderName}
                  onChange={(e) => setFormData({ ...formData, cardholderName: e.target.value.toUpperCase() })}
                  placeholder="NIRVANA GARCIA"
                  className={cn(
                    "w-full px-4 py-3 rounded-xl border bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white uppercase",
                    errors.cardholderName ? "border-red-500" : "border-zinc-200 dark:border-zinc-700"
                  )}
                />
                {errors.cardholderName && <p className="text-red-500 text-sm mt-1">{errors.cardholderName}</p>}
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-zinc-700 dark:text-gray-300 mb-2">
                    {t("forms.cardNumber")}
                  </label>
                  <input
                    type="text"
                    value={formData.cardNumber}
                    onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value.replace(/\s/g, "") })}
                    placeholder="4532 1234 5678 9012"
                    maxLength={19}
                    className={cn(
                      "w-full px-4 py-3 rounded-xl border bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white font-mono",
                      errors.cardNumber ? "border-red-500" : "border-zinc-200 dark:border-zinc-700"
                    )}
                  />
                  {errors.cardNumber && <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-gray-300 mb-2">
                    {t("forms.network")}
                  </label>
                  <select
                    value={formData.network}
                    onChange={(e) => setFormData({ ...formData, network: e.target.value as "visa" | "mastercard" | "amex" })}
                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white"
                  >
                    <option value="visa">Visa</option>
                    <option value="mastercard">Mastercard</option>
                    <option value="amex">Amex</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-gray-300 mb-2">
                    {t("forms.expiryMonth")}
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="12"
                    value={formData.expiryMonth}
                    onChange={(e) => setFormData({ ...formData, expiryMonth: e.target.value })}
                    placeholder="MM"
                    className={cn(
                      "w-full px-4 py-3 rounded-xl border bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white",
                      errors.expiry ? "border-red-500" : "border-zinc-200 dark:border-zinc-700"
                    )}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-gray-300 mb-2">
                    {t("forms.expiryYear")}
                  </label>
                  <input
                    type="number"
                    min="2026"
                    max="2040"
                    value={formData.expiryYear}
                    onChange={(e) => setFormData({ ...formData, expiryYear: e.target.value })}
                    placeholder="YYYY"
                    className={cn(
                      "w-full px-4 py-3 rounded-xl border bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white",
                      errors.expiry ? "border-red-500" : "border-zinc-200 dark:border-zinc-700"
                    )}
                  />
                </div>
              </div>
              {errors.expiry && <p className="text-red-500 text-sm mt-1">{errors.expiry}</p>}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-gray-300 mb-2">
                    {t("forms.creditLimit")}
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.creditLimit}
                    onChange={(e) => setFormData({ ...formData, creditLimit: e.target.value })}
                    placeholder="10000.00"
                    className={cn(
                      "w-full px-4 py-3 rounded-xl border bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white",
                      errors.creditLimit ? "border-red-500" : "border-zinc-200 dark:border-zinc-700"
                    )}
                  />
                  {errors.creditLimit && <p className="text-red-500 text-sm mt-1">{errors.creditLimit}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-gray-300 mb-2">
                    {t("forms.usedCredit")}
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.usedCredit}
                    onChange={(e) => setFormData({ ...formData, usedCredit: e.target.value })}
                    placeholder="0.00"
                    className={cn(
                      "w-full px-4 py-3 rounded-xl border bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white",
                      errors.usedCredit ? "border-red-500" : "border-zinc-200 dark:border-zinc-700"
                    )}
                  />
                  {errors.usedCredit && <p className="text-red-500 text-sm mt-1">{errors.usedCredit}</p>}
                </div>
              </div>
            </>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors font-medium"
            >
              {t("common.cancel")}
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 rounded-xl bg-cyan-$100 hover:bg-emerald-700 text-white transition-colors font-medium"
            >
              {isEditMode
                ? t("forms.saveChanges")
                : t("common.add")
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
