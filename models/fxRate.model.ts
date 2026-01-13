import { CurrencyCode } from "./currency.model";

export type FXRate = {
  base: CurrencyCode;              // base currency (örn. TRY)
  rates: Record<CurrencyCode, number>; // 1 base = ? target
  fetchedAt: number;               // unix ms
  source: "api" | "cache";
};