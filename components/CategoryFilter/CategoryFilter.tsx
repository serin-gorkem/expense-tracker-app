import { Category, CATEGORY_OPTIONS } from '@/models/expense.model';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type CategoryFilterProps = {
  category: Category | "all";
  setCategory: (value: Category | "all") => void;
};

const CategoryFilter = ({ category, setCategory }: CategoryFilterProps) => {
  return (
    <View>
      <Text style={styles.filterLabel}>Filter by category</Text>

      <View style={styles.categoryRow}>
        {/* ALL */}
        <Pressable
          onPress={() => setCategory("all")}
          style={[styles.category, category === "all" && styles.categoryActive]}
        >
          <Text style={styles.categoryText}>All</Text>
        </Pressable>

        {/* CATEGORY_OPTIONS */}
        {CATEGORY_OPTIONS.map((item) => {
          const active = category === item.key;

          return (
            <Pressable
              key={item.key}
              onPress={() => setCategory(item.key)}
              style={[styles.category, active && styles.categoryActive]}
            >
              <Text style={styles.categoryText}>{item.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  categoryRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },

  category: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },

  categoryActive: {
    backgroundColor: "rgba(91,124,255,0.22)",
    borderColor: "rgba(91,124,255,0.35)",
  },

  categoryText: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 12,
    fontWeight: "800",
  },
  filterLabel: {
    color: "rgba(255,255,255,0.65)",
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 6,
  },
});

export default CategoryFilter
