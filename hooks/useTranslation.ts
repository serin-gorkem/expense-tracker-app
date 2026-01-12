// src/hooks/useTranslation.ts
import { useLanguage } from "@/src/context/LanguageContext";

export function useTranslation() {
  const { t, language } = useLanguage();

  function formatCurrency(value: number) {
    return new Intl.NumberFormat(language, {
      style: "currency",
      currency: "EUR", // şimdilik sabit, sonra settings’ten bağlarız
      maximumFractionDigits: 0,
    }).format(value);
  }

  return {
    t,
    formatCurrency,
  };
}