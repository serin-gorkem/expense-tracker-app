export type GoalInsight = {
  type:
    | "ahead"
    | "on_track"
    | "behind"
    | "risk"
    | "inactive";

  title: string;
  description: string;
};