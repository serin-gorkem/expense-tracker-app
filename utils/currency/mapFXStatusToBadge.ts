// utils/currency/mapFXStatusToBadge.ts
import { FXStatus } from "@/src/context/FXContext";

export type FXBadgeStatus = "live" | "cached" | "stale" | "locked";

export function mapFXStatusToBadge(
  status: FXStatus
): FXBadgeStatus | null {
  if (status === "empty") return null;
  return status;
}