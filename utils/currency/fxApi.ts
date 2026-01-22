import { CurrencyCode } from "@/models/currency.model";
import { FXRate } from "@/models/fxRate.model";

const SUPPORTED: CurrencyCode[] = ["TRY", "USD", "EUR"];

export async function fetchFXRates(base: CurrencyCode): Promise<FXRate> {
  const targets = SUPPORTED.filter((c) => c !== base).join(",");

  const res = await fetch(
    `https://api.frankfurter.app/latest?from=${base}&to=${targets}`,
  );

  if (!res.ok) {
    throw new Error("Frankfurter FX request failed");
  }

  const json = await res.json();

  const rates: Record<CurrencyCode, number> = {
    [base]: 1,
  } as any;

  for (const c of SUPPORTED) {
    if (c === base) continue;

    const baseToTarget = json.rates[c]; // 1 BASE = X TARGET
    rates[c] = Number((1 / baseToTarget).toFixed(6)); // ✅ 1 TARGET = ? BASE
  }

  return {
    base,
    fetchedAt: Date.now(),
    source: "api",
    rates,
  };
}
