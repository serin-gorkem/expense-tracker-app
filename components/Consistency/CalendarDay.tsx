import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Status = "gold" | "green" | "break" | "white" | "empty";

type Props = {
  day: number | null;
  status?: Status;
  isToday?: boolean;

  isStreakStart?: boolean;
  isStreakEnd?: boolean;

  contributedToGoal?: boolean;
  goalAmount?: number;

  onPress?: () => void;
};

const COLORS: Record<Status, string> = {
  gold: "#F59E0B",
  green: "#22C55E",
  break: "rgba(239,68,68,0.15)",
  white: "rgba(255,255,255,0.9)",
  empty: "rgba(255, 255, 255, 0)",
};

export default function CalendarDay({
  day,
  status = "empty",
  isToday = false,
  isStreakStart = false,
  isStreakEnd = false,
  contributedToGoal,
  onPress,
}: Props) {
  if (day == null) {
    return <View style={styles.emptyCell} />;
  }

  const hasGoal = contributedToGoal === true;
  const isGold = status === "gold";
  const isGreen = status === "green";
  const isEdgeDay = isGold && (isStreakStart || isStreakEnd);

  return (
    <View style={styles.cellWrapper}>
      <Pressable onPress={onPress} disabled={!onPress}>
        <View style={styles.cellContainer}>
          {/* DAY CIRCLE */}
          <View
            style={[
              styles.cell,
              isEdgeDay && styles.streakEdgeCell,
              isGreen && styles.greenCell,
              hasGoal && styles.goalCellOverlay,
            ]}
          >
            {status === "break" ? (
              <Text style={styles.breakText}>×</Text>
            ) : (
              <Text style={[styles.dayText, isEdgeDay && styles.goldText]}>
                {day}
              </Text>
            )}

            {/* GOAL DOT */}
            {contributedToGoal && <View style={styles.goalDot} />}
          </View>
        </View>
      </Pressable>
    </View>
  );
}

const SIZE = 34;

const styles = StyleSheet.create({
  cellWrapper: {
    width: "14.2857%",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 6,
    zIndex: 1,
  },

  cellContainer: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },

  emptyCell: {
    width: "14.2857%",
    height: SIZE,
  },

  cell: {
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    alignItems: "center",
    justifyContent: "center",
  },

  streakEdgeCell: {
    backgroundColor: COLORS.gold, // parlak altın
  },
  greenCell: {
    backgroundColor: COLORS.green,
  },
  dayText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: "800",
  },

  goldText: {
    color: "#1F1300",
  },

  breakText: {
    color: "#EF4444",
    fontSize: 16,
    fontWeight: "900",
    marginTop: -1,
  },

  todayRing: {
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.6)",
  },
  goalCellOverlay: {
    boxShadow: "0 0 0 2px rgba(34,211,238,0.9)", // web benzeri
    borderWidth: 1,
    borderColor: "#22D3EE",
  },
  goalDot: {
    position: "absolute",
    top: -3,
    left: 20,
    width: 12,
    height: 12,
    borderRadius: 999,
    backgroundColor: "#22D3EE",
    borderWidth: 1.5,
    borderColor: "rgba(17,24,39,0.9)",
    zIndex: 10,
  },
});
