/**
 * Currency Formatting Utilities
 * Professional currency formatting with support for multiple currencies and locales.
 */

import { Currency, Language } from "@/shared/stores/preferences-store";
import { IAmount } from "@/shared/types";

export interface FormatCurrencyOptions {
  currency: Currency;
  language: Language;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
}

/**
 * Get locale string from language
 */
export function getLocale(language: Language): string {
  return language === "es" ? "es-PE" : "en-US";
}

export function formatCurrency(amount: number, options: FormatCurrencyOptions): string;
export function formatCurrency(amount: IAmount, language: Language): string;
export function formatCurrency(value: number, currency: string, language: string): string;

/**
 * Format a number as currency based on user preferences
 * Supports multiple signatures for flexibility across the codebase
 */
export function formatCurrency(
  amountOrValue: number | IAmount,
  optionsOrCurrencyOrLanguage: FormatCurrencyOptions | Language | string,
  languageOrUndefined?: string
): string {
  let value: number;
  let currency: string;
  let language: Language;

  if (typeof amountOrValue === "number") {
    if (typeof optionsOrCurrencyOrLanguage === "object") {
      value = amountOrValue;
      currency = optionsOrCurrencyOrLanguage.currency;
      language = optionsOrCurrencyOrLanguage.language;
    } else if (languageOrUndefined !== undefined) {
      value = amountOrValue;
      currency = optionsOrCurrencyOrLanguage as string;
      language = languageOrUndefined as Language;
    } else {
      throw new Error("Invalid formatCurrency arguments");
    }
  } else {
    value = amountOrValue.value;
    currency = amountOrValue.currency;
    language = optionsOrCurrencyOrLanguage as Language;
  }

  const locale = getLocale(language as Language);
  
  const formatter = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return formatter.format(value);
}

/**
 * Convert between currencies (simplified exchange rates)
 * In production, this would use a real-time API
 */
const exchangeRates: Record<Currency, Record<Currency, number>> = {
  PEN: {
    PEN: 1,
    USD: 0.27,
    EUR: 0.25,
  },
  USD: {
    PEN: 3.75,
    USD: 1,
    EUR: 0.92,
  },
  EUR: {
    PEN: 4.08,
    USD: 1.09,
    EUR: 1,
  },
};

/**
 * Convert amount from one currency to another
 */
export function convertCurrency(
  amount: number,
  from: Currency,
  to: Currency
): number {
  if (from === to) return amount;
  return amount * exchangeRates[from][to];
}

/**
 * Format currency with automatic conversion if needed
 */
export function formatWithConversion(
  amount: number,
  sourceCurrency: Currency,
  targetCurrency: Currency,
  language: Language
): string {
  const converted = convertCurrency(amount, sourceCurrency, targetCurrency);
  return formatCurrency(converted, { currency: targetCurrency, language });
}

/**
 * Get currency symbol
 */
export function getCurrencySymbol(currency: Currency): string {
  const symbols: Record<Currency, string> = {
    PEN: "S/",
    USD: "$",
    EUR: "€",
  };
  return symbols[currency];
}

/**
 * Get currency name
 */
export function getCurrencyName(currency: Currency, language: Language): string {
  const names: Record<Language, Record<Currency, string>> = {
    es: {
      PEN: "Soles",
      USD: "Dólares",
      EUR: "Euros",
    },
    en: {
      PEN: "Soles",
      USD: "Dollars",
      EUR: "Euros",
    },
  };
  return names[language][currency];
}
