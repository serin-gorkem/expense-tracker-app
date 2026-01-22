// utils/currency/fxStorage.ts
import { CurrencyCode } from "@/models/currency.model";
import { FXRate } from "@/models/fxRate.model";
import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = (base: CurrencyCode) => `@fx_rates_${base}`;

export async function saveFXRates(data: FXRate) {
  try {
    await AsyncStorage.setItem(KEY(data.base), JSON.stringify(data));
  } catch (e) {
    console.warn("saveFXRates failed", e);
  }
}

export async function loadFXRates(base: CurrencyCode): Promise<FXRate | null> {
  try {
    const raw = await AsyncStorage.getItem(KEY(base));
    if (!raw) return null;
    return JSON.parse(raw) as FXRate;
  } catch (e) {
    console.warn("loadFXRates failed", e);
    return null;
  }
}

export async function clearFXRates(base?: CurrencyCode) {
  try {
    if (base) {
      await AsyncStorage.removeItem(KEY(base));
      return;
    }
    // istersen tüm FX cache temizliği:
    const keys = await AsyncStorage.getAllKeys();
    const fxKeys = keys.filter((k) => k.startsWith("@fx_rates_"));
    await AsyncStorage.multiRemove(fxKeys);
  } catch (e) {
    console.warn("clearFXRates failed", e);
  }
}
