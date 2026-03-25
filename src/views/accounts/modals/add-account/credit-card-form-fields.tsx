/**
 * Credit Card Form Fields Component
 * Form fields for adding/editing credit cards.
 */

import React from "react";
import { Building2 } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import type { CardNetwork } from "@/shared/types/finance";

interface CreditCardFormFieldsProps {
  formData: {
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
  };
  errors: Record<string, string>;
  onChange: (updates: Partial<CreditCardFormFieldsProps["formData"]>) => void;
  t: (key: string) => string;
}

export function CreditCardFormFields({
  formData,
  errors,
  onChange,
  t,
}: CreditCardFormFieldsProps): React.JSX.Element {
  return (
    <>
      <div>
        <Label className="flex items-center gap-2 mb-2">
          <Building2 className="w-4 h-4" />
          {t("forms.bankName")}
        </Label>
        <Input
          type="text"
          autoComplete="chrome-off"
          data-form-type="other"
          value={formData.bankName}
          onChange={(e) => onChange({ bankName: e.target.value })}
          placeholder={t("forms.bankNamePlaceholder")}
          className={cn(errors.bankName && "border-red-500 focus-visible:ring-red-500")}
        />
        {errors.bankName && <p className="text-red-500 text-sm mt-1">{errors.bankName}</p>}
      </div>

      <div>
        <Label className="mb-2">
          {t("forms.cardholderName")}
        </Label>
        <Input
          type="text"
          name="credit-cardholder-name-field"
          autoComplete="chrome-off"
          data-form-type="other"
          value={formData.cardholderName}
          onChange={(e) => onChange({ cardholderName: e.target.value.toUpperCase() })}
          placeholder="NIRVANA GARCIA"
          className={cn("uppercase", errors.cardholderName && "border-red-500 focus-visible:ring-red-500")}
        />
        {errors.cardholderName && <p className="text-red-500 text-sm mt-1">{errors.cardholderName}</p>}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <Label className="mb-2">
            {t("forms.cardNumber")}
          </Label>
          <Input
            type="text"
            name="credit-card-number-field"
            autoComplete="chrome-off"
            data-form-type="other"
            value={formData.cardNumber}
            onChange={(e) => onChange({ cardNumber: e.target.value.replace(/\s/g, "") })}
            placeholder="4532 1234 5678 9012"
            maxLength={19}
            className={cn("font-mono", errors.cardNumber && "border-red-500 focus-visible:ring-red-500")}
          />
          {errors.cardNumber && <p className="text-red-500 text-sm mt-1">{errors.cardNumber}</p>}
        </div>

        <div>
          <Label className="mb-2">
            {t("forms.network")}
          </Label>
          <Select
            value={formData.network}
            onValueChange={(value) => onChange({ network: value as CardNetwork })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="visa">Visa</SelectItem>
              <SelectItem value="mastercard">Mastercard</SelectItem>
              <SelectItem value="amex">Amex</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="mb-2">
            {t("forms.expiryMonth")}
          </Label>
          <Input
            type="number"
            min="1"
            max="12"
            value={formData.expiryMonth}
            onChange={(e) => onChange({ expiryMonth: e.target.value })}
            placeholder="MM"
            className={cn(errors.expiry && "border-red-500 focus-visible:ring-red-500")}
          />
        </div>

        <div>
          <Label className="mb-2">
            {t("forms.expiryYear")}
          </Label>
          <Input
            type="number"
            min="2026"
            max="2040"
            value={formData.expiryYear}
            onChange={(e) => onChange({ expiryYear: e.target.value })}
            placeholder="YYYY"
            className={cn(errors.expiry && "border-red-500 focus-visible:ring-red-500")}
          />
        </div>
      </div>
      {errors.expiry && <p className="text-red-500 text-sm mt-1">{errors.expiry}</p>}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="mb-2">
            {t("forms.creditLimit")}
          </Label>
          <Input
            type="number"
            step="0.01"
            value={formData.creditLimit}
            onChange={(e) => onChange({ creditLimit: e.target.value })}
            placeholder="10000.00"
            className={cn(errors.creditLimit && "border-red-500 focus-visible:ring-red-500")}
          />
          {errors.creditLimit && <p className="text-red-500 text-sm mt-1">{errors.creditLimit}</p>}
        </div>

        <div>
          <Label className="mb-2">
            {t("forms.usedCredit")}
          </Label>
          <Input
            type="number"
            step="0.01"
            value={formData.usedCredit}
            onChange={(e) => onChange({ usedCredit: e.target.value })}
            placeholder="2500.00"
            className={cn(errors.usedCredit && "border-red-500 focus-visible:ring-red-500")}
          />
          {errors.usedCredit && <p className="text-red-500 text-sm mt-1">{errors.usedCredit}</p>}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="mb-2">
            {t("forms.cutoffDay")}
          </Label>
          <Input
            type="number"
            min="1"
            max="31"
            value={formData.cutoffDay}
            onChange={(e) => onChange({ cutoffDay: e.target.value })}
            placeholder="15"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-gray-300 mb-2">
            {t("forms.paymentDueDay")}
          </label>
          <input
            type="number"
            name="payment-due-day-field"
            autoComplete="chrome-off"
            data-form-type="other"
            min="1"
            max="31"
            value={formData.paymentDueDay}
            onChange={(e) => onChange({ paymentDueDay: e.target.value })}
            placeholder="5"
            className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white"
          />
        </div>
      </div>
    </>
  );
}
