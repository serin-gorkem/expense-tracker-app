// src/context/LanguageContext.tsx

import { LanguageCode, t as translate } from "@/src/i18n";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type TranslationParams = Record<string, string | number>;

type LanguageContextValue = {
  language: LanguageCode;
  t: (key: string, params?: TranslationParams) => string;
  changeLanguage: (lang: LanguageCode) => void;
  ready: boolean;
};

const LanguageContext = createContext<LanguageContextValue | undefined>(
  undefined
);

const STORAGE_KEY = "@app_language";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<LanguageCode>("en");
  const [ready, setReady] = useState(false);

  // 🔹 Load persisted language
  useEffect(() => {
    const load = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          setLanguage(stored as LanguageCode);
        }
      } finally {
        setReady(true);
      }
    };
    load();
  }, []);

  const changeLanguage = async (lang: LanguageCode) => {
    setLanguage(lang);
    await AsyncStorage.setItem(STORAGE_KEY, lang);
  };

const t = useMemo(() => {
  return (key: string, params?: Record<string, string | number>) =>
    translate(key, language, params);
}, [language]);

  return (
    <LanguageContext.Provider
      value={{
        language,
        t,
        changeLanguage,
        ready,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return ctx;
}