import { CurrencyCode } from "@/models/currency.model";
import { FXRate } from "@/models/fxRate.model";

const SUPPORTED: CurrencyCode[] = ["TRY", "USD", "EUR"];

export async function fetchFXRates(
  base: CurrencyCode
): Promise<FXRate> {
  const targets = SUPPORTED.filter((c) => c !== base).join(",");

  const res = await fetch(
    `https://api.frankfurter.app/latest?from=${base}&to=${targets}`
  );

  if (!res.ok) {
    throw new Error("Frankfurter FX request failed");
  }

  const json = await res.json();

  return {
    base,
    fetchedAt: Date.now(),
    source: "api",
    rates: {
      TRY: base === "TRY" ? 1 : json.rates.TRY,
      USD: base === "USD" ? 1 : json.rates.USD,
      EUR: base === "EUR" ? 1 : json.rates.EUR,
    },
  };
}