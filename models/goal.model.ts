export type Goal = {
  id: string
  title: string
  description?:string,
  targetAmount: number
  savedAmount: number
  startDate: Date
  durationInDays: number
  status: "active" | "completed" | "paused"
}