/**
 * Account Form Fields Component
 * Form fields for adding/editing debit accounts.
 */

import React from "react";
import { Hash, Key, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AccountType, CardNetwork } from "@/types/finance";

interface AccountFormFieldsProps {
  formData: {
    bankName: string;
    accountNumber: string;
    cci: string;
    balance: string;
    accountSubType: AccountType;
    network: CardNetwork;
    cvv: string;
    expiryMonth: string;
    expiryYear: string;
    isDefault: boolean;
  };
  errors: Record<string, string>;
  onChange: (updates: Partial<AccountFormFieldsProps["formData"]>) => void;
  t: (key: string) => string;
}

export function AccountFormFields({ formData, errors, onChange, t }: AccountFormFieldsProps): React.JSX.Element {
  return (
    <>
      <div>
        <label className="block text-sm font-medium text-zinc-700 dark:text-gray-300 mb-2">
          <Building2 className="w-4 h-4 inline mr-2" />
          {t("forms.bankName")}
        </label>
        <input
          type="text"
          value={formData.bankName}
          onChange={(e) => onChange({ bankName: e.target.value })}
          placeholder={t("forms.bankNamePlaceholder")}
          className={cn(
            "w-full px-4 py-3 rounded-xl border bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white",
            errors.bankName ? "border-red-500" : "border-zinc-200 dark:border-zinc-700 focus:border-cyan-$100"
          )}
        />
        {errors.bankName && <p className="text-red-500 text-sm mt-1">{errors.bankName}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-gray-300 mb-2">
            {t("forms.accountType")}
          </label>
          <select
            value={formData.accountSubType}
            onChange={(e) => onChange({ accountSubType: e.target.value as AccountType })}
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
            onChange={(e) => onChange({ network: e.target.value as CardNetwork })}
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
          onChange={(e) => onChange({ balance: e.target.value })}
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
          onChange={(e) => onChange({ accountNumber: e.target.value })}
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
          onChange={(e) => onChange({ cci: e.target.value })}
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
              onChange={(e) => onChange({ expiryMonth: e.target.value })}
              placeholder="MM"
              min="1"
              max="12"
              className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white font-mono text-center"
            />
            <input
              type="number"
              value={formData.expiryYear}
              onChange={(e) => onChange({ expiryYear: e.target.value })}
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
            onChange={(e) => onChange({ cvv: e.target.value })}
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
          onChange={(e) => onChange({ isDefault: e.target.checked })}
          className="w-5 h-5 rounded border-zinc-300 text-cyan-$100 focus:ring-cyan-$100"
        />
        <span className="text-zinc-900 dark:text-white font-medium">{t("forms.setAsDefault")}</span>
      </label>
    </>
  );
}
