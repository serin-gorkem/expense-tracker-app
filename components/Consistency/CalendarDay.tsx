import React from "react";
import { StyleSheet, Text, View } from "react-native";

type Status = "gold" | "green" | "break" | "empty";

type Props = {
  day: number | null;
  status?: Status;
  isToday?: boolean;
  connectsFromPrev?: boolean;
  connectsToNext?: boolean;
};

const COLORS: Record<Status, string> = {
  gold: "#F59E0B",
  green: "#22C55E",
  break: "rgba(239,68,68,0.15)",
  empty: "rgba(255,255,255,0.08)",
};

export default function CalendarDay({
  day,
  status = "empty",
  isToday = false,
  connectsFromPrev = false,
  connectsToNext = false,
}: Props) {
  if (day == null) {
    return <View style={styles.emptyCell} />;
  }

  return (
    <View style={styles.cellWrapper}>
      {/* Left streak connector */}
      {status === "gold" && connectsFromPrev && (
        <View style={styles.leftConnector} />
      )}

      {/* Day circle */}
      <View
        style={[
          styles.cell,
          { backgroundColor: COLORS[status] },
          isToday && styles.todayRing,
        ]}
      >
        {status === "break" ? (
          <Text style={styles.breakText}>×</Text>
        ) : (
          <Text
            style={[
              styles.dayText,
              status === "gold" && styles.goldText,
            ]}
          >
            {day}
          </Text>
        )}
      </View>

      {/* Right streak connector */}
      {status === "gold" && connectsToNext && (
        <View style={styles.rightConnector} />
      )}
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

  dayText: {
    color: "rgba(255,255,255,0.9)",
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

  leftConnector: {
    position: "absolute",
    left: -6,
    width: 6,
    height: 6,
    backgroundColor: "#F59E0B",
  },

  rightConnector: {
    position: "absolute",
    right: -6,
    width: 6,
    height: 6,
    backgroundColor: "#F59E0B",
  },
});