import { Category } from "./expense.model"

export type Goal = {
  id: string
  title: string
  description?:string,
  targetAmount: number
  startDate: Date
  durationInDays: number
  status: "active" | "completed" | "paused"

    // 🧠 Contextual
  category?: Category;

    // 🔥 UX için
  lastBoostAt?: string;
  lastBoostAmount?: number;
}