import { Goal } from "@/models/goal.model";
import { StyleSheet, View } from "react-native";
import GoalListItem from "./GoalListItem";

type GoalsListProps = {
  goals: Goal[];
  activeGoalId?: string;
  onEdit: (goal: Goal) => void;
};

export default function GoalsList({
  goals,
  activeGoalId,
  onEdit,
}: GoalsListProps) {
  const mappedGoals = goals.map((goal) => {
    return (
      <GoalListItem
        key={goal.id}
        goal={goal}
        isActive={goal.id === activeGoalId}
        onEdit={onEdit}
      />
    );
  });
  return <View style={styles.container}>{mappedGoals}</View>;
}

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
  },
});
