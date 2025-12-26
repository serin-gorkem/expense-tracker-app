import { ViewMode } from "@/utils/expense/expenseSelectors";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type ModeSwitcherProps = {
  value: ViewMode;
  onChange: (mode: ViewMode) => void;
};

const ModeSwitcher = ({ value, onChange }: ModeSwitcherProps) => {
  const items: { key: ViewMode; label: string }[] = [
    { key: "daily", label: "Daily" },
    { key: "weekly", label: "Weekly" },
    { key: "monthly", label: "Monthly" },
  ];

  return (
    <View style={styles.wrap}>
      <BlurView intensity={26} tint="dark" style={styles.blur}>
        <LinearGradient
          colors={["rgba(255,255,255,0.10)", "rgba(255,255,255,0.04)"]}
          style={StyleSheet.absoluteFillObject}
        />
        <View style={styles.row}>
          {items.map((it) => {
            const active = it.key === value;
            return (
              <Pressable
                key={it.key}
                onPress={() => onChange(it.key)}
                style={[styles.tab, active && styles.tabActive]}
              >
                <Text style={[styles.tabText, active && styles.tabTextActive]}>
                  {it.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </BlurView>
    </View>
  );
};

export default ModeSwitcher;

const styles = StyleSheet.create({
  wrap: { marginBottom: 12 },
  blur: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
    overflow: "hidden",
  },
  row: { flexDirection: "row", padding: 6, gap: 6 },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  tabActive: {
    backgroundColor: "rgba(255,255,255,0.14)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
  },
  tabText: { color: "rgba(255,255,255,0.68)", fontWeight: "700" },
  tabTextActive: { color: "rgba(255,255,255,0.92)" },
});