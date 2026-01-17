import { CurrencyCode } from "@/models/currency.model";
import { FXRate } from "@/models/fxRate.model";
import { fetchFXRates } from "@/utils/currency/fxApi";
import { loadFXRates, saveFXRates } from "@/utils/currency/fxStorage";
import { getFXStatus, shouldRefreshFX } from "@/utils/currency/isFXStale";
import { createContext, useContext, useEffect, useState } from "react";
import { useFinanceProfile } from "./FinanceProfileContext";

export type FXStatus = "live" | "cached" | "stale" | "empty";

type FXContextType = {
  rates: FXRate | null;
  status: FXStatus;
  getRate: (currency: CurrencyCode) => number | null;
  refresh: () => Promise<void>;
};

const FXContext = createContext<FXContextType | null>(null);

export function FXProvider({ children }: { children: React.ReactNode }) {
  const { profile } = useFinanceProfile();
  const [rates, setRates] = useState<FXRate | null>(null);
  const [status, setStatus] = useState<FXStatus>("empty");

  /* INITIAL LOAD */
  useEffect(() => {
    (async () => {
      const cached = await loadFXRates();

      if (!cached) {
        setStatus("empty");
        refresh();
        return;
      }

      const fxStatus = getFXStatus(cached);
      setRates(cached);
      setStatus(fxStatus);

      if (shouldRefreshFX(cached)) {
        refresh(); // 🔥 background refresh
      }
    })();
  }, [profile.baseCurrency]);

  /* BASE CURRENCY CHANGE → invalidate */
  useEffect(() => {
    if (!rates) return;
    if (rates.base !== profile.baseCurrency) {
      setRates(null);
      setStatus("empty");
    }
  }, [profile.baseCurrency]);

  function getRate(currency: CurrencyCode): number | null {
    if (!rates || !profile.baseCurrency) return null;
    if (currency === rates.base) return 1;
    

    const baseToCurrency = rates.rates[currency];
    if (!baseToCurrency) return null;

    return 1 / baseToCurrency;
  }

  async function refresh() {
    if (!profile.baseCurrency) return;
    try {
      const data = await fetchFXRates(profile.baseCurrency);
      setRates(data);
      setStatus("live");
      await saveFXRates(data);
    } catch (e) {
      console.warn("FX refresh failed", e);
      if (rates) {
        setStatus(getFXStatus(rates));
      }
    }
  }

  return (
    <FXContext.Provider value={{ rates, status, getRate, refresh }}>
      {children}
    </FXContext.Provider>
  );
}

export function useFX() {
  const ctx = useContext(FXContext);
  if (!ctx) {
    throw new Error("useFX must be used within FXProvider");
  }
  return ctx;
}