import { Goal } from "@/models/goal.model";
import { GoalDraft } from "@/src/context/WizardContext";
import * as Crypto from "expo-crypto";
export function createGoalFromDraft(draft: GoalDraft): Goal {
  if (!draft.type || !draft.durationInDays || !draft.targetAmount) {
    throw new Error("Incomplete goal draft");
  }

  const title =
    draft.customTitle ??
    (draft.type === "savings"
      ? "Savings Goal"
      : draft.type === "purchase"
      ? "Planned Purchase"
      : "Budget Goal");

  return {
    id: Crypto.randomUUID(),
    title,
    description: undefined,

    targetAmount: draft.targetAmount,
    startDate: new Date(),
    durationInDays: draft.durationInDays,

    category: draft.category, // 👈 sadece pass-through

    status: "active",
  };
}