// src/i18n/index.ts

import de from "./locales/de.json";
import en from "./locales/en.json";
import fr from "./locales/fr.json";
import tr from "./locales/tr.json";

export type LanguageCode = "tr" | "en" | "de" | "fr";

type TranslationParams = Record<string, string | number>;

const translations: Record<LanguageCode, any> = {
  tr,
  en,
  de,
  fr,
};

/**
 * 🔥 Stateless, safe, param-supporting translation function
 */
export function t(
  key: string,
  lang: LanguageCode,
  params?: TranslationParams
): string {
  if (!key) return "";

  const keys = key.split(".");
  let value: any = translations[lang];

  for (const k of keys) {
    value = value?.[k];
  }

  // Fallback → English
  if (typeof value !== "string") {
    value = translations.en;
    for (const k of keys) {
      value = value?.[k];
    }
  }

  if (typeof value !== "string") {
    return key;
  }

  if (!params) return value;

  return Object.entries(params).reduce((acc, [paramKey, paramValue]) => {
    const regex = new RegExp(`{{\\s*${paramKey}\\s*}}`, "g");
    return acc.replace(regex, String(paramValue));
  }, value);
}