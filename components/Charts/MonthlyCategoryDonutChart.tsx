import { Category } from "@/models/expense.model";
import { DonutChartItem } from "@/utils/expenseChart";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { PieChart } from "react-native-gifted-charts";
import GlassCard from "../ui/GlassCard";

type Props = {
  data: DonutChartItem[];
  monthLabel: string;
  selectedCategory: Category | "all";
  onSelectCategory: (category: Category | "all") => void;
};

export default function MonthlyCategoryDonutChart({
  data,
  monthLabel,
  selectedCategory,
  onSelectCategory,
}: Props) {
  if (!data.length) return null;

  const total = data.reduce((sum, d) => sum + d.value, 0);
  const isFiltering = selectedCategory !== "all";

  const handleSelect = (label: Category) => {
    onSelectCategory(selectedCategory === label ? "all" : label);
  };

  const getSliceShift = (index: number, total: number) => {
    const angle = (2 * Math.PI * index) / total;
    const distance = 6; // 🔥 daha soft

    return {
      shiftX: Math.cos(angle) * distance,
      shiftY: Math.sin(angle) * distance,
    };
  };

  const activeItem = data.find(d => d.label === selectedCategory);

  return (
    <GlassCard style={{ marginBottom: 16 }}>
      <View style={styles.container}>
        <PieChart
          donut
          radius={80}
          innerRadius={52}
          data={data.map((item, index) => {
            const isActive = selectedCategory === item.label;
            const shift = isActive
              ? getSliceShift(index, data.length)
              : { shiftX: 0, shiftY: 0 };
              const dimColor = (color: string) =>
                isFiltering && !isActive ? "rgba(255,255,255,0.15)" : color;
              
            return {
              ...item,
              shiftX: shift.shiftX,
              shiftY: shift.shiftY,

              // ✨ PREMIUM STROKE
              strokeWidth: isActive ? 3 : 1,
              strokeColor: isActive
                ? "rgba(255,255,255,0.35)"
                : "rgba(0,0,0,0.35)",
              color: dimColor(item.color),
              opacity: isFiltering ? (isActive ? 1 : 0.18) : 1,
              onPress: () => handleSelect(item.label as Category),
            };
          })}
          centerLabelComponent={() => (
            <Pressable onPress={() => onSelectCategory("all")} hitSlop={12}>
              <View style={styles.center}>
                <Text style={styles.month}>{monthLabel}</Text>

                <Text style={styles.total}>
                  ₺{(activeItem?.value ?? total).toLocaleString("en-US")}
                </Text>

                {isFiltering && (
                  <Text style={styles.activeLabel}>
                    {activeItem?.label}
                  </Text>
                )}
              </View>
            </Pressable>
          )}
        />
      </View>

      <View style={styles.legend}>
        {data.map(item => {
          const isActive = selectedCategory === item.label;

          return (
            <Pressable
              key={item.label}
              onPress={() => handleSelect(item.label as Category)}
            >
              <View
                style={[
                  styles.legendItem,
                  isActive && styles.legendItemActive,
                  isFiltering && !isActive && { opacity: 0.35 },
                ]}
              >
                <View style={[styles.dot, { backgroundColor: item.color }]} />
                <Text style={styles.legendText}>
                  {item.label} · ₺{item.value}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </GlassCard>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingVertical: 16,
  },
  center: {
    alignItems: "center",
  },
  month: {
    color: "rgba(255,255,255,0.55)",
    fontSize: 12,
    fontWeight: "600",
  },
  total: {
    color: "rgba(255,255,255,0.95)",
    fontSize: 18,
    fontWeight: "800",
    marginTop: 2,
  },
  activeLabel: {
    marginTop: 4,
    fontSize: 11,
    fontWeight: "700",
    color: "rgba(255,255,255,0.65)",
    textTransform: "capitalize",
  },
  legend: {
    marginTop: 8,
    paddingHorizontal: 12,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  legendItemActive: {
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 10,
    paddingVertical: 4,
    paddingHorizontal: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  legendText: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 12,
    fontWeight: "600",
  },
});