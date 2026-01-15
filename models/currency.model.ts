export type CurrencyCode = "TRY" | "USD" | "EUR";

export type CurrencyExposure = {
  currency: CurrencyCode;
  totalAmount: number;     // native
  totalBaseAmount: number; // base currency
  percentage: number;
};