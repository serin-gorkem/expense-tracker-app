import { Expense } from "@/models/expense.model";
import {
  DayInfo,
  DayKey,
  toDayKeyLocal,
} from "@/utils/consistency/buildDailyConsistencyMap";
import {
  buildMonthGrid,
  formatMonthLabel,
} from "@/utils/consistency/calenderUtils";
import { getWeekStreakSegments } from "@/utils/consistency/getWeekStreakSegments";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import React, { useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import CalendarDay from "./CalendarDay";

/* ---------- Types ---------- */

type Props = {
  month: Date;
  dayMap: Record<DayKey, DayInfo>;
  expensesByDay: Map<string, Expense[]>;
  onSelectDay: (dayKey: DayKey) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
};

const WEEKDAYS: readonly string[] = [
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
  "Sun",
];

/* ---------- Component ---------- */

export default function ConsistencyCalendar({
  month,
  dayMap,
  onPrevMonth,
  onNextMonth,
  expensesByDay,
  onSelectDay,
}: Props) {
  const weeks = useMemo<(number | null)[][]>(
    () => buildMonthGrid(month),
    [month]
  );

  const monthTitle = useMemo<string>(() => formatMonthLabel(month), [month]);

  const today = new Date();

  const isSameMonthAsToday =
    today.getFullYear() === month.getFullYear() &&
    today.getMonth() === month.getMonth();

  return (
    <View style={{ marginBottom: 12 }}>
      <BlurView intensity={22} tint="dark" style={styles.card}>
        <LinearGradient
          colors={["rgba(255,255,255,0.1)", "rgba(255,255,255,0.03)"]}
          style={StyleSheet.absoluteFillObject}
        />

        {/* ---------- Header ---------- */}
        <View style={styles.headerRow}>
          <Pressable onPress={onPrevMonth} style={styles.arrowBtn}>
            <Text style={styles.arrowText}>‹</Text>
          </Pressable>

          <View style={styles.headerCenter}>
            <Text style={styles.title}>Consistency</Text>
            <Text style={styles.subtitle}>{monthTitle}</Text>
          </View>

          <Pressable onPress={onNextMonth} style={styles.arrowBtn}>
            <Text style={styles.arrowText}>›</Text>
          </Pressable>
        </View>

        {/* ---------- Weekdays ---------- */}
        <View style={styles.weekHeader}>
          {WEEKDAYS.map((label) => (
            <Text key={label} style={styles.weekDay}>
              {label}
            </Text>
          ))}
        </View>

        {/* ---------- Calendar Grid ---------- */}
        <View style={styles.grid}>
          {weeks.map((week, weekIndex) => (
            <View key={weekIndex} style={styles.weekRow}>
              {/* STREAK BACKGROUNDS */}
              {(() => {
                const weekInfos = week.map((day) => {
                  if (day == null) return undefined;
                  const key = toDayKeyLocal(
                    new Date(month.getFullYear(), month.getMonth(), day, 12)
                  );
                  return dayMap[key];
                });

                const segments = getWeekStreakSegments(weekInfos);

                return segments.map((seg, i) => (
                  <View
                    key={i}
                    style={[
                      styles.streakTrack,
                      {
                        left: `${(seg.startIndex / 7) * 100}%`,
                        width: `${
                          ((seg.endIndex - seg.startIndex + 1) / 7) * 100
                        }%`,
                      },
                    ]}
                  />
                ));
              })()}

              {/* DAY CELLS */}
              {week.map((day, dayIndex) => {
                if (day === null) {
                  return <CalendarDay key={dayIndex} day={null} />;
                }

                const date = new Date(
                  month.getFullYear(),
                  month.getMonth(),
                  day,
                  12
                );

                const dayKey = toDayKeyLocal(date);
                const info = dayMap[dayKey];
                const segments = getWeekStreakSegments(
                  week.map((d) =>
                    d == null
                      ? undefined
                      : dayMap[
                          toDayKeyLocal(
                            new Date(
                              month.getFullYear(),
                              month.getMonth(),
                              d,
                              12
                            )
                          )
                        ]
                  )
                );

                const isStreakStart =
                  info?.status === "gold" &&
                  segments.some((s) => s.startIndex === dayIndex);

                const isStreakEnd =
                  info?.status === "gold" &&
                  isSameMonthAsToday &&
                  date.getDate() === today.getDate();

                return (
                  <CalendarDay
                    key={dayIndex}
                    day={day}
                    status={info?.status}
                    isToday={
                      isSameMonthAsToday && date.getDate() === today.getDate()
                    }
                    contributedToGoal={info?.contributedToGoal}
                    goalAmount={info?.goalAmount}
                    isStreakStart={isStreakStart}
                    isStreakEnd={isStreakEnd}
                    onPress={() => onSelectDay(dayKey)}
                  />
                );
              })}
            </View>
          ))}
        </View>

        {/* ---------- Legend ---------- */}
        <View style={styles.legendRow}>
          <LegendDot color="#F59E0B" label="Active streak" />
          <LegendDot color="#22C55E" label="Completed" />
          <LegendDot color="#22D3EE" label="Goal" />
          <LegendX label="Missed" />
        </View>
      </BlurView>
    </View>
  );
}

/* ---------- Legend components ---------- */

function LegendDot({ color, label }: { color: string; label: string }) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, { backgroundColor: color }]} />
      <Text style={styles.legendText}>{label}</Text>
    </View>
  );
}

function LegendX({ label }: { label: string }) {
  return (
    <View style={styles.legendItem}>
      <Text style={styles.legendX}>×</Text>
      <Text style={styles.legendText}>{label}</Text>
    </View>
  );
}

/* ---------- Styles ---------- */

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
    padding: 14,
    overflow: "hidden",
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  headerCenter: {
    alignItems: "center",
    flex: 1,
  },

  arrowBtn: {
    width: 34,
    height: 28,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },

  arrowText: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 18,
    fontWeight: "900",
  },

  title: {
    color: "rgba(255,255,255,0.92)",
    fontSize: 14,
    fontWeight: "900",
  },

  subtitle: {
    color: "rgba(255,255,255,0.55)",
    fontSize: 12,
    fontWeight: "700",
  },

  weekHeader: {
    flexDirection: "row",
    marginBottom: 6,
  },

  weekDay: {
    width: "14.2857%",
    textAlign: "center",
    color: "rgba(255,255,255,0.45)",
    fontSize: 11,
    fontWeight: "800",
  },

  grid: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    backgroundColor: "rgba(255,255,255,0.03)",
    paddingVertical: 6,
  },
  streakTrack: {
    position: "absolute",
    top: "50%",
    transform: [{ translateY: -17 }], // SIZE / 2
    height: 34,
    backgroundColor: "rgba(245,158,11,0.22)",
    borderRadius: 999,
    zIndex: 0,
  },
  weekRow: {
    flexDirection: "row",
    position: "relative",
  },
  legendRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.08)",
  },

  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 999,
  },

  legendX: {
    color: "#EF4444",
    fontSize: 14,
    fontWeight: "900",
  },

  legendText: {
    color: "rgba(255,255,255,0.55)",
    fontSize: 11,
    fontWeight: "700",
  },
});
