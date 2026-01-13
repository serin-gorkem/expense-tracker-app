// utils/currency/mapFXStatusToBadge.ts
import { FXStatus } from "@/src/context/FXContext";

export type FXBadgeStatus = "live" | "cached" | "stale";

export function mapFXStatusToBadge(
  status: FXStatus
): FXBadgeStatus | null {
  if (status === "empty") return null;
  return status;
}