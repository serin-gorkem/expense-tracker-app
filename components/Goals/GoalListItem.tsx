import { CATEGORY_OPTIONS } from "@/models/expense.model";
import { Goal } from "@/models/goal.model";
import { useExpensesStore } from "@/src/context/ExpensesContext";
import { useGoalsStore } from "@/src/context/GoalContext";
import { Pressable, StyleSheet, Text, View } from "react-native";
type Props = {
  goal: Goal;
  isActive: boolean;
  onEdit: (goal: Goal) => void;
};

export default function GoalListItem({ goal, isActive, onEdit }: Props) {
  const { expenses } = useExpensesStore();
  const { toggleGoal, calculateGoalProgress } = useGoalsStore();

  const savedAmount = calculateGoalProgress(goal.id, expenses);

  const categoryLabel = goal.category
    ? CATEGORY_OPTIONS.find((c) => c.key === goal.category)?.label
    : null;
  const progress =
    goal.targetAmount > 0 ? Math.min(savedAmount / goal.targetAmount, 1) : 0;

  const percentage = Math.round(progress * 100);
  const isCompleted = goal.status === "completed";

  return (
    <Pressable
      onPress={() => {
        if (isCompleted) return;
        toggleGoal(goal.id);
      }}
      onLongPress={() => onEdit(goal)}
      style={[
        styles.card,
        isActive && styles.active,
        isCompleted && styles.completed,
      ]}
    >
      <View style={styles.header}>
        <Text style={styles.title}>{goal.title}</Text>
        {isActive && <Text style={styles.badge}>ACTIVE</Text>}
      </View>

      <View style={styles.metaRow}>
        <Text style={styles.amount}>
          {savedAmount} / {goal.targetAmount}
        </Text>
        <Text style={styles.percent}>{percentage}%</Text>
      </View>
      {categoryLabel && <Text style={styles.category}>{categoryLabel}</Text>}

      <View style={styles.track}>
        <View style={[styles.fill, { width: `${percentage}%` }]} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 14,
    borderRadius: 16,
    marginBottom: 10,
    backgroundColor: "rgba(17,24,39,0.65)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },

  active: {
    borderColor: "#6366F1",
    backgroundColor: "rgba(99,102,241,0.18)",
  },

  completed: {
    opacity: 0.5,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },

  title: {
    flex: 1,
    color: "rgba(255,255,255,0.92)",
    fontWeight: "800",
    fontSize: 14,
  },

  titleCompleted: {
    textDecorationLine: "line-through",
  },

  badge: {
    fontSize: 10,
    fontWeight: "900",
    color: "#6366F1",
    borderWidth: 1,
    borderColor: "#6366F1",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
  },

  badgeCompleted: {
    fontSize: 10,
    fontWeight: "900",
    color: "#22c55e",
    borderWidth: 1,
    borderColor: "#22c55e",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
  },
  category: {
    fontSize: 11,
    fontWeight: "700",
    color: "rgba(255,255,255,0.55)",
    marginBottom: 6,
  },

  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },

  amount: {
    fontSize: 12,
    color: "rgba(255,255,255,0.65)",
    fontWeight: "600",
  },

  percent: {
    fontSize: 12,
    color: "#a5b4fc",
    fontWeight: "800",
  },

  track: {
    height: 6,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.08)",
    overflow: "hidden",
  },

  fill: {
    height: "100%",
    backgroundColor: "#6366F1",
  },

  fillCompleted: {
    backgroundColor: "#22c55e",
  },
});
