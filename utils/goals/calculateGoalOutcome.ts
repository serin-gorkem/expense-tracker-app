// utils/goals/calculateGoalOutcome.ts

import { Goal } from "@/models/goal.model";

export type GoalOutcome = "ongoing" | "succeeded" | "failed";

type Params = {
  goal: Goal | undefined;
  savedAmount: number;
  now?: Date; // test edilebilirlik için
};

export function calculateGoalOutcome({
  goal,
  savedAmount,
  now = new Date(),
}: Params): GoalOutcome {
  // Goal yoksa outcome üretmeyiz
  if (!goal) return "ongoing";

  // 1️⃣ Progress kontrolü (SUCCESS her şeyin üstünde)
  if (savedAmount >= goal.targetAmount) {
    return "succeeded";
  }

  // 2️⃣ Deadline hesapla
  const msPerDay = 24 * 60 * 60 * 1000;
  const deadline = new Date(
    goal.startDate.getTime() + goal.durationInDays * msPerDay
  );

  // 3️⃣ Süre dolduysa ve hedefe ulaşılamadıysa → FAILURE
  if (now.getTime() > deadline.getTime()) {
    return "failed";
  }

  // 4️⃣ Aksi tüm durumlar
  return "ongoing";
}