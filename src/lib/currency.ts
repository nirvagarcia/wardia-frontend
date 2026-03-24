/**
 * Currency Formatting Utilities
 * Professional currency formatting with support for multiple currencies and locales.
 */

import { Currency, Language } from "@/store/preferences-store";

export interface FormatCurrencyOptions {
  currency: Currency;
  language: Language;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
}

/**
 * Format a number as currency based on user preferences
 */
export function formatCurrency(
  amount: number,
  options: FormatCurrencyOptions
): string {
  const locale = options.language === "es" ? "es-PE" : "en-US";
  
  const formatter = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: options.currency,
    minimumFractionDigits: options.minimumFractionDigits ?? 2,
    maximumFractionDigits: options.maximumFractionDigits ?? 2,
  });

  return formatter.format(amount);
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
