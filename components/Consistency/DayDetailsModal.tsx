import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
    Modal,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

import { Expense } from "@/models/expense.model";
import { DayInfo, DayKey } from "@/utils/consistency/buildDailyConsistencyMap";

type Props = {
  dayKey: DayKey | null;
  dayInfo: DayInfo | null;
  expenses: Expense[];
  onClose: () => void;
};

export default function DayDetailModal({
  dayKey,
  dayInfo,
  expenses,
  onClose,
}: Props) {
  if (!dayKey || !dayInfo) return null;

  const date = new Date(dayKey);

  const statusLabel = {
    gold: "🔥 Streak day",
    green: "✅ Within limit",
    break: "❌ Over limit",
    empty: "💤 No data",
  }[dayInfo.status];

  return (
    <Modal
      visible
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.card} onPress={() => {}}>
          <BlurView intensity={28} tint="dark" style={styles.blur}>
            <LinearGradient
              colors={["rgba(255,255,255,0.12)", "rgba(255,255,255,0.03)"]}
              style={StyleSheet.absoluteFillObject}
            />

            {/* ---------- Header ---------- */}
            <View style={styles.header}>
              <Text style={styles.date}>
                {date.toLocaleDateString("en-US", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </Text>
              <Text style={styles.status}>{statusLabel}</Text>
            </View>

            {/* ---------- Goal Contribution ---------- */}
            {dayInfo.contributedToGoal && (
              <View style={styles.goalBox}>
                <Text style={styles.goalTitle}>🎯 Goal contribution</Text>
                <Text style={styles.goalAmount}>
                  +₺{dayInfo.goalAmount}
                </Text>
              </View>
            )}

            {/* ---------- Expenses ---------- */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Expenses</Text>

              {expenses.length === 0 ? (
                <Text style={styles.emptyText}>
                  No expenses for this day.
                </Text>
              ) : (
                expenses.map((e) => {
                  const isGoal = e.isGoalBoost;
                  return (
                    <View
                      key={e.id}
                      style={[
                        styles.expenseRow,
                        isGoal && styles.goalExpense,
                      ]}
                    >
                      <Text style={styles.expenseTitle}>
                        {isGoal ? "🎯 " : ""}
                        {e.title}
                      </Text>
                      <Text style={styles.expenseAmount}>
                        ₺{e.amount}
                      </Text>
                    </View>
                  );
                })
              )}
            </View>

            {/* ---------- Close ---------- */}
            <Pressable onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeText}>Close</Text>
            </Pressable>
          </BlurView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

/* =========================
   Styles
========================= */

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "center",
    alignItems: "center",
  },

  card: {
    width: "88%",
    borderRadius: 20,
    overflow: "hidden",
  },

  blur: {
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
    borderRadius: 20,
  },

  header: {
    marginBottom: 12,
  },

  date: {
    color: "rgba(255,255,255,0.95)",
    fontSize: 16,
    fontWeight: "900",
  },

  status: {
    marginTop: 4,
    color: "rgba(255,255,255,0.65)",
    fontSize: 12,
    fontWeight: "700",
  },

  goalBox: {
    marginVertical: 10,
    padding: 12,
    borderRadius: 14,
    backgroundColor: "rgba(34,211,238,0.15)",
    borderWidth: 1,
    borderColor: "rgba(34,211,238,0.4)",
  },

  goalTitle: {
    color: "#67E8F9",
    fontSize: 12,
    fontWeight: "800",
  },

  goalAmount: {
    marginTop: 4,
    color: "#A5F3FC",
    fontSize: 14,
    fontWeight: "900",
  },

  section: {
    marginTop: 6,
  },

  sectionTitle: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 13,
    fontWeight: "800",
    marginBottom: 6,
  },

  emptyText: {
    color: "rgba(255,255,255,0.45)",
    fontSize: 12,
  },

  expenseRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.06)",
  },

  goalExpense: {
    borderLeftWidth: 3,
    borderLeftColor: "#22D3EE",
    paddingLeft: 8,
  },

  expenseTitle: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 12,
    fontWeight: "700",
  },

  expenseAmount: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 12,
    fontWeight: "800",
  },

  closeBtn: {
    marginTop: 12,
    paddingVertical: 10,
    borderRadius: 14,
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.14)",
  },

  closeText: {
    color: "rgba(255,255,255,0.95)",
    fontWeight: "900",
  },
});