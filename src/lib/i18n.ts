/**
 * Translation System - Simple i18n implementation for Spanish and English.
 * Refactored: Translations now stored in JSON files for easier maintenance.
 */

import esTranslations from "@/locales/es.json";
import enTranslations from "@/locales/en.json";

export type Language = "es" | "en";

export const translations = {
  es: esTranslations,
  en: enTranslations,
} as const;

export type TranslationKeys = typeof translations.es;

/**
 * Get translation for a key in the specified language.
 * Supports variable interpolation with {varName} syntax.
 */
export function getTranslation(
  language: Language,
  path: string,
  variables?: Record<string, string | number>
): string {
  const keys = path.split(".");
  let value: unknown = translations[language];
  
  for (const key of keys) {
    if (value && typeof value === "object" && key in value) {
      value = (value as Record<string, unknown>)[key];
    } else {
      return path;
    }
  }
  
  let result = typeof value === "string" ? value : path;
  
  if (variables) {
    Object.entries(variables).forEach(([key, val]) => {
      result = result.replace(`{${key}}`, String(val));
    });
  }
  
  return result;
}

/**
 * Replace placeholders in translation strings
 */
export function interpolate(text: string, params: Record<string, string | number>): string {
  return text.replace(/\{(\w+)\}/g, (_, key) => String(params[key] ?? ""));
}
