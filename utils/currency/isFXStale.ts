import { FXRate } from "@/models/fxRate.model";

const FX_REFRESH_AFTER = 60 * 60 * 1000; // 1 saat
const FX_STALE_AFTER = 6 * 60 * 60 * 1000; // 6 saat

export type FXStatus = "live" | "cached" | "stale";

export function getFXStatus(rate: FXRate): FXStatus {
  const age = Date.now() - rate.fetchedAt;

  if (age <= FX_REFRESH_AFTER) return "live";
  if (age <= FX_STALE_AFTER) return "cached";
  return "stale";
}

/** Eski API korunuyor (geri uyumluluk) */
export function isFXStale(rate: FXRate): boolean {
  return getFXStatus(rate) === "stale";
}

/** YENİ: refresh tetikleme için */
export function shouldRefreshFX(rate: FXRate): boolean {
  return Date.now() - rate.fetchedAt > FX_REFRESH_AFTER;
}