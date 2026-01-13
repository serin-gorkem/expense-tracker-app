import { FXRate } from "@/models/fxRate.model";

const ONE_DAY = 1000 * 60 * 60 * 24;

export function isFXStale(rate: FXRate): boolean {
  return Date.now() - rate.fetchedAt > ONE_DAY;
}