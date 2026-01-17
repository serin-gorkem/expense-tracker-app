import { CurrencyCode } from "@/models/currency.model";
import { FinanceProfile } from "@/models/financeProfile.model";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";

type FinanceProfileContextType = {
  profile: FinanceProfile;
  setBaseCurrency: (currency: CurrencyCode) => void;
  hydrated: boolean;
  updateProfile: (patch: Partial<FinanceProfile>) => void;
  resetProfile(): void;
};

const STORAGE_KEY = "@finance_profile";

const DEFAULT_PROFILE: FinanceProfile = {
  monthlyIncome: null,
  fixedExpenses: null,
  autoLimitEnabled: true,
  baseCurrency: null,
};

const FinanceProfileContext = createContext<FinanceProfileContextType | null>(
  null
);

export function FinanceProfileProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [profile, setProfile] = useState<FinanceProfile>(DEFAULT_PROFILE);
  const [hydrated, setHydrated] = useState(false);

  /* LOAD */
  useEffect(() => {
    (async () => {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        setProfile(JSON.parse(raw));
      }
      setHydrated(true);
    })();
  }, []);

  /* SAVE */
  useEffect(() => {
    if (!hydrated) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  }, [profile, hydrated]);

  function setBaseCurrency(currency: CurrencyCode) {
    setProfile((prev) => ({
      ...prev,
      baseCurrency: currency,
    }));
  }

  function updateProfile(patch: Partial<FinanceProfile>) {
    setProfile((prev) => ({
      ...prev,
      ...patch,
    }));
  }
  function resetProfile() {
    setProfile(DEFAULT_PROFILE);
  }

  return (
    <FinanceProfileContext.Provider
      value={{ profile, setBaseCurrency, hydrated,updateProfile, resetProfile }}
    >
      {children}
    </FinanceProfileContext.Provider>
  );
}

export function useFinanceProfile() {
  const ctx = useContext(FinanceProfileContext);
  if (!ctx) {
    throw new Error(
      "useFinanceProfile must be used within FinanceProfileProvider"
    );
  }
  return ctx;
}