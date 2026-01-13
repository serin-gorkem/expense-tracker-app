import { FXRate } from "@/models/fxRate.model";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@fx_rates";

export async function saveFXRates(data: FXRate) {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn("saveFXRates failed", e);
  }
}

export async function loadFXRates(): Promise<FXRate | null> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as FXRate;
  } catch (e) {
    console.warn("loadFXRates failed", e);
    return null;
  }
}

export async function clearFXRates() {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.warn("clearFXRates failed", e);
  }
}