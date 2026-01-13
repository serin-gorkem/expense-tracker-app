import { CurrencyCode } from "@/models/currency.model";

export type CurrencyMeta = {
  code: CurrencyCode;
  symbol: string;
  label: string;
  locale: string;
};

export const CURRENCY_META: Record<CurrencyCode, CurrencyMeta> = {
  TRY: {
    code: "TRY",
    symbol: "₺",
    label: "Turkish Lira",
    locale: "tr-TR",
  },
  USD: {
    code: "USD",
    symbol: "$",
    label: "US Dollar",
    locale: "en-US",
  },
  EUR: {
    code: "EUR",
    symbol: "€",
    label: "Euro",
    locale: "de-DE",
  },
};

export function getCurrencyMeta(code: CurrencyCode): CurrencyMeta {
  return CURRENCY_META[code];
}