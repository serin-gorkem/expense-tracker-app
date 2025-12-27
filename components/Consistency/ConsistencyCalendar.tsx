import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import React, { useMemo } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import {
  DayInfo,
  DayKey,
  toDayKeyLocal,
} from "@/utils/consistency/buildDailyConsistencyMap";
import {
  buildMonthGrid,
  formatMonthLabel,
} from "@/utils/consistency/calenderUtils";
import CalendarDay from "./CalendarDay";

/* ---------- Types ---------- */

type Props = {
  month: Date;
  dayMap: Record<DayKey, DayInfo>;
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
}: Props) {
  const weeks = useMemo<(number | null)[][]>(
    () => buildMonthGrid(month),
    [month]
  );

  const monthTitle = useMemo<string>(
    () => formatMonthLabel(month),
    [month]
  );

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
              {week.map((day, dayIndex) => {
                if (day === null) {
                  return (
                    <CalendarDay
                      key={`${weekIndex}-${dayIndex}`}
                      day={null}
                    />
                  );
                }

                const date = new Date(
                  month.getFullYear(),
                  month.getMonth(),
                  day,
                  12,
                  0,
                  0,
                  0
                );

                const dayKey = toDayKeyLocal(date);
                const info: DayInfo | undefined = dayMap[dayKey];
                const status = info?.status ?? "empty";

                const isToday =
                  isSameMonthAsToday &&
                  date.getDate() === today.getDate();

                /* ---------- Duolingo-style horizontal streak logic ---------- */

                const prevDay = dayIndex > 0 ? week[dayIndex - 1] : null;
                const nextDay = dayIndex < 6 ? week[dayIndex + 1] : null;

                let connectsFromPrev = false;
                let connectsToNext = false;

                if (status === "gold") {
                  if (prevDay !== null) {
                    const prevKey = toDayKeyLocal(
                      new Date(
                        month.getFullYear(),
                        month.getMonth(),
                        prevDay,
                        12
                      )
                    );
                    connectsFromPrev = dayMap[prevKey]?.status === "gold";
                  }

                  if (nextDay !== null) {
                    const nextKey = toDayKeyLocal(
                      new Date(
                        month.getFullYear(),
                        month.getMonth(),
                        nextDay,
                        12
                      )
                    );
                    connectsToNext = dayMap[nextKey]?.status === "gold";
                  }
                }

                return (
                  <CalendarDay
                    key={`${weekIndex}-${dayIndex}`}
                    day={day}
                    status={status}
                    isToday={isToday}
                    connectsFromPrev={connectsFromPrev}
                    connectsToNext={connectsToNext}
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
          <LegendX label="Missed" />
        </View>
      </BlurView>
    </View>
  );
}

/* ---------- Legend components ---------- */

function LegendDot({
  color,
  label,
}: {
  color: string;
  label: string;
}) {
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

  weekRow: {
    flexDirection: "row",
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