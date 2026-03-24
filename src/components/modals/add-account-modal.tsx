"use client";

/**
 * Add Account Modal Component
 * Form for adding new bank accounts or credit cards
 */

import React, { useState } from "react";
import { usePreferencesStore } from "@/store/preferences-store";
import { getTranslation } from "@/lib/i18n";
import { X, Building2, CreditCard, Hash, Key, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";
import type { IAccount, ICreditCard } from "@/types/finance";

interface AddAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddAccount: (account: Omit<IAccount, "id" | "lastUpdated">) => void;
  onAddCard: (card: Omit<ICreditCard, "id" | "lastStatementDate" | "nextPaymentDate" | "minimumPayment">) => void;
}

type AccountType = "debit" | "credit";

export function AddAccountModal({ isOpen, onClose, onAddAccount, onAddCard }: AddAccountModalProps): React.JSX.Element | null {
  const { language, currency } = usePreferencesStore();
  const t = (key: string) => getTranslation(language, key);

  const [accountType, setAccountType] = useState<AccountType>("debit");
  const [formData, setFormData] = useState({
    // Common fields
    bankName: "",
    
    // Debit fields
    accountNumber: "",
    cci: "",
    balance: "",
    accountSubType: "checking" as "checking" | "savings",
    isDefault: false,
    
    // Credit card fields
    cardholderName: "",
    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
    network: "visa" as "visa" | "mastercard" | "amex",
    creditLimit: "",
    usedCredit: "",
    cutoffDay: "",
    paymentDueDay: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};
    
    if (!formData.bankName.trim()) {
      newErrors.bankName = language === "es" ? "Nombre del banco requerido" : "Bank name required";
    }

    if (accountType === "debit") {
      if (!formData.accountNumber) newErrors.accountNumber = language === "es" ? "Número de cuenta requerido" : "Account number required";
      if (!formData.cci) newErrors.cci = language === "es" ? "CCI requerido" : "CCI required";
      if (!formData.balance || parseFloat(formData.balance) < 0) {
        newErrors.balance = language === "es" ? "Balance inválido" : "Invalid balance";
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
      };

      onAddAccount(newAccount);
    } else {
      // Credit card validation
      if (!formData.cardholderName) newErrors.cardholderName = language === "es" ? "Nombre del titular requerido" : "Cardholder name required";
      if (!formData.cardNumber || formData.cardNumber.length < 15) {
        newErrors.cardNumber = language === "es" ? "Número de tarjeta inválido" : "Invalid card number";
      }
      if (!formData.expiryMonth || !formData.expiryYear) {
        newErrors.expiry = language === "es" ? "Fecha de expiración requerida" : "Expiry date required";
      }
      if (!formData.creditLimit || parseFloat(formData.creditLimit) <= 0) {
        newErrors.creditLimit = language === "es" ? "Límite inválido" : "Invalid limit";
      }
      if (!formData.usedCredit || parseFloat(formData.usedCredit) < 0) {
        newErrors.usedCredit = language === "es" ? "Crédito usado inválido" : "Invalid used credit";
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      const usedCreditValue = parseFloat(formData.usedCredit);
      const creditLimitValue = parseFloat(formData.creditLimit);

      const newCard: Omit<ICreditCard, "id" | "lastStatementDate" | "nextPaymentDate" | "minimumPayment"> = {
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

      onAddCard(newCard);
    }

    // Reset and close
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setFormData({
      bankName: "",
      accountNumber: "",
      cci: "",
      balance: "",
      accountSubType: "checking",
      isDefault: false,
      cardholderName: "",
      cardNumber: "",
      expiryMonth: "",
      expiryYear: "",
      network: "visa",
      creditLimit: "",
      usedCredit: "",
      cutoffDay: "",
      paymentDueDay: "",
    });
    setErrors({});
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-white dark:bg-zinc-900 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-slide-up" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">
            {language === "es" ? "Agregar Cuenta" : "Add Account"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-zinc-600 dark:text-zinc-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Account Type Selection */}
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setAccountType("debit")}
              className={cn(
                "p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2",
                accountType === "debit"
                  ? "border-emerald-500 bg-emerald-500/10"
                  : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600"
              )}
            >
              <Wallet className={cn("w-8 h-8", accountType === "debit" ? "text-emerald-500" : "text-zinc-400")} />
              <span className={cn(
                "font-medium",
                accountType === "debit" ? "text-emerald-600 dark:text-emerald-400" : "text-zinc-600 dark:text-zinc-400"
              )}>
                {t("accounts.debit")}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setAccountType("credit")}
              className={cn(
                "p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2",
                accountType === "credit"
                  ? "border-emerald-500 bg-emerald-500/10"
                  : "border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600"
              )}
            >
              <CreditCard className={cn("w-8 h-8", accountType === "credit" ? "text-emerald-500" : "text-zinc-400")} />
              <span className={cn(
                "font-medium",
                accountType === "credit" ? "text-emerald-600 dark:text-emerald-400" : "text-zinc-600 dark:text-zinc-400"
              )}>
                {t("accounts.credit")}
              </span>
            </button>
          </div>

          {/* Bank Name */}
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-gray-300 mb-2">
              <Building2 className="w-4 h-4 inline mr-2" />
              {language === "es" ? "Nombre del Banco" : "Bank Name"}
            </label>
            <input
              type="text"
              value={formData.bankName}
              onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
              placeholder={language === "es" ? "Ej: BCP, Interbank" : "e.g. BCP, Interbank"}
              className={cn(
                "w-full px-4 py-3 rounded-xl border bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white",
                errors.bankName
                  ? "border-red-500"
                  : "border-zinc-200 dark:border-zinc-700 focus:border-emerald-500"
              )}
            />
            {errors.bankName && <p className="text-red-500 text-sm mt-1">{errors.bankName}</p>}
          </div>

          {accountType === "debit" ? (
            // Debit Account Fields
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-gray-300 mb-2">
                    {language === "es" ? "Tipo de Cuenta" : "Account Type"}
                  </label>
                  <select
                    value={formData.accountSubType}
                    onChange={(e) => setFormData({ ...formData, accountSubType: e.target.value as "checking" | "savings" })}
                    className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white"
                  >
                    <option value="checking">{language === "es" ? "Corriente" : "Checking"}</option>
                    <option value="savings">{language === "es" ? "Ahorros" : "Savings"}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700 dark:text-gray-300 mb-2">
                    {language === "es" ? "Balance Actual" : "Current Balance"}
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
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-gray-300 mb-2">
                  <Hash className="w-4 h-4 inline mr-2" />
                  {language === "es" ? "Número de Cuenta" : "Account Number"}
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

              <label className="flex items-center gap-3 p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isDefault}
                  onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                  className="w-5 h-5 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-zinc-900 dark:text-white font-medium">
                  {language === "es" ? "Establecer como cuenta predeterminada" : "Set as default account"}
                </span>
              </label>
            </>
          ) : (
            // Credit Card Fields
            <>
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-gray-300 mb-2">
                  {language === "es" ? "Nombre del Titular" : "Cardholder Name"}
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
                    {language === "es" ? "Número de Tarjeta" : "Card Number"}
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
                    {language === "es" ? "Red" : "Network"}
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
                    {language === "es" ? "Mes de Expiración" : "Expiry Month"}
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
                    {language === "es" ? "Año de Expiración" : "Expiry Year"}
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
                    {language === "es" ? "Límite de Crédito" : "Credit Limit"}
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
                    {language === "es" ? "Crédito Usado" : "Used Credit"}
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

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors font-medium"
            >
              {language === "es" ? "Cancelar" : "Cancel"}
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition-colors font-medium"
            >
              {language === "es" ? "Agregar" : "Add"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
