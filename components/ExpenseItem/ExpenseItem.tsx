import { Expense } from "@/models/expense.model";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import ReanimatedSwipeable from "react-native-gesture-handler/ReanimatedSwipeable";

type ExpenseItemProps = {
  expense: Expense;
  onDelete: (id: string) => void;
  onEdit: (expense: Expense) => void;
};

const formatDate = (iso: string) => {
  const d = new Date(iso);
  const day = String(d.getDate()).padStart(2, "0");
  const month = d.toLocaleString("tr-TR", { month: "short" });
  return `${day} ${month}`;
};

const formatAmount = (n: number) => {
  try {
    return new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: "TRY",
      maximumFractionDigits: 0,
    }).format(n);
  } catch {
    return `${n} ₺`;
  }
};

const ExpenseItem = ({ expense, onDelete, onEdit }: ExpenseItemProps) => {
  const confirmDelete = () => {
    Alert.alert("Delete Expense", "Are you sure you want to delete this expense?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: () => onDelete(expense.id) },
    ]);
  };

  const renderRightActions = () => (
    <Pressable onPress={confirmDelete} style={[styles.action, styles.actionDelete]}>
      <Text style={styles.actionText}>Delete</Text>
    </Pressable>
  );

  const renderLeftActions = () => (
    <Pressable onPress={() => onEdit(expense)} style={[styles.action, styles.actionEdit]}>
      <Text style={styles.actionText}>Edit</Text>
    </Pressable>
  );

  return (
    <ReanimatedSwipeable renderRightActions={renderRightActions} renderLeftActions={renderLeftActions}>
      <View style={{ marginBottom: 10 }}>
        <BlurView intensity={22} tint="dark" style={styles.card}>
          <LinearGradient
            colors={["rgba(255,255,255,0.10)", "rgba(255,255,255,0.03)"]}
            style={StyleSheet.absoluteFillObject}
          />

          <View style={styles.rowTop}>
            <View style={{ flex: 1 }}>
              <Text style={styles.title} numberOfLines={1}>
                {expense.title}
              </Text>
              <View style={styles.metaRow}>
                <Text style={styles.meta}>{formatDate(expense.date)}</Text>
                <View style={styles.dot} />
                <View style={styles.pill}>
                  <Text style={styles.pillText}>{expense.category}</Text>
                </View>
              </View>
            </View>

            <Text style={styles.amount}>{formatAmount(expense.amount)}</Text>
          </View>
        </BlurView>
      </View>
    </ReanimatedSwipeable>
  );
};

export default ExpenseItem;

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
    overflow: "hidden",
    padding: 14,
  },
  rowTop: { flexDirection: "row", alignItems: "center", gap: 12 },
  title: { color: "rgba(255,255,255,0.92)", fontWeight: "900", fontSize: 15 },
  amount: { color: "rgba(255,255,255,0.92)", fontWeight: "900", fontSize: 14 },

  metaRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 8 },
  meta: { color: "rgba(255,255,255,0.55)", fontSize: 12, fontWeight: "700" },
  dot: { width: 4, height: 4, borderRadius: 4, backgroundColor: "rgba(255,255,255,0.22)" },
  pill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },
  pillText: { color: "rgba(255,255,255,0.72)", fontSize: 12, fontWeight: "800" },

  action: {
    width: 86,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    borderRadius: 18,
  },
  actionDelete: { backgroundColor: "rgba(239,68,68,0.75)" },
  actionEdit: { backgroundColor: "rgba(59,130,246,0.55)" },
  actionText: { color: "rgba(255,255,255,0.95)", fontWeight: "900" },
});