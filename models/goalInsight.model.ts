export type GoalInsight = {
  type: "ahead" | "on_track" | "behind" | "risk" | "inactive";
  titleKey: string;
  descriptionKey: string;
};