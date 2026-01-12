import { Goal } from "@/models/goal.model";
import { GoalDraft } from "@/src/context/WizardContext";
import * as Crypto from "expo-crypto";

export function createGoalFromDraft(
  draft: GoalDraft,
  defaultTitle: string
): Goal {
  if (!draft.type || !draft.durationInDays || !draft.targetAmount) {
    throw new Error("Incomplete goal draft");
  }

  return {
    id: Crypto.randomUUID(),
    title: draft.customTitle ?? defaultTitle,
    description: undefined,

    targetAmount: draft.targetAmount,
    startDate: new Date(),
    durationInDays: draft.durationInDays,

    category: draft.category,

    status: "active",
  };
}