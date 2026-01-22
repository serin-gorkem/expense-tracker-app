// src/context/FXContext.tsx
import { CurrencyCode } from "@/models/currency.model";
import { FXRate } from "@/models/fxRate.model";
import { fetchFXRates } from "@/utils/currency/fxApi";
import { loadFXRates, saveFXRates } from "@/utils/currency/fxStorage";
import { getFXStatus, shouldRefreshFX } from "@/utils/currency/isFXStale";
import { createContext, useContext, useEffect, useRef, useState } from "react";
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
  const base = profile.baseCurrency;

  const [rates, setRates] = useState<FXRate | null>(null);
  const [status, setStatus] = useState<FXStatus>("empty");

  // aynı base için üst üste refresh spam'ini engelle
  const refreshingRef = useRef(false);

  useEffect(() => {
    if (!base) {
      setRates(null);
      setStatus("empty");
      return;
    }

    let cancelled = false;

    (async () => {
      // 1) base değişti → önce UI state’i resetle
      setRates(null);
      setStatus("empty");

      // 2) base'e özel cache yükle
      const cached = await loadFXRates(base);

      if (cancelled) return;

      if (cached && cached.base === base) {
        const fxStatus = getFXStatus(cached);
        setRates(cached);
        setStatus(fxStatus);

        // 3) gerekiyorsa background refresh
        if (shouldRefreshFX(cached)) {
          void refresh(base);
        }
      } else {
        // cache yok → direkt fetch
        void refresh(base);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [base]);

  function getRate(currency: CurrencyCode): number | null {
    if (!rates) return null;
    return rates.rates[currency] ?? null;
  }

  async function refresh(forBase?: CurrencyCode) {
    const b = forBase ?? base;
    if (!b) return;

    if (refreshingRef.current) return;
    refreshingRef.current = true;

    try {
      const data = await fetchFXRates(b);
      setRates(data);
      setStatus("live");
      await saveFXRates(data);
    } catch (e) {
      console.warn("FX refresh failed", e);
      setStatus((prev) => (rates ? getFXStatus(rates) : prev));
    } finally {
      refreshingRef.current = false;
    }
  }

  return (
    <FXContext.Provider
      value={{ rates, status, getRate, refresh: () => refresh() }}
    >
      {children}
    </FXContext.Provider>
  );
}

export function useFX() {
  const ctx = useContext(FXContext);
  if (!ctx) throw new Error("useFX must be used within FXProvider");
  return ctx;
}
