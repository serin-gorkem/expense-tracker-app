// src/hooks/useTranslation.ts
import { CurrencyCode } from "@/models/currency.model";
import { useFinanceProfile } from "@/src/context/FinanceProfileContext";
import { useLanguage } from "@/src/context/LanguageContext";

export function useTranslation() {
  const { t, language } = useLanguage();
  const { profile } = useFinanceProfile();

  function formatCurrency(
    value: number,
    options?: {
      currency?: CurrencyCode;
      maximumFractionDigits?: number;
    }
  ) {
    const currency = options?.currency ?? profile.baseCurrency ?? "TRY";

    return new Intl.NumberFormat(language, {
      style: "currency",
      currency,
      maximumFractionDigits: options?.maximumFractionDigits ?? 0,
    }).format(value);
  }

  return {
    t,
    formatCurrency,
  };
}