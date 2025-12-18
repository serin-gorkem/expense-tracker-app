import { ViewMode } from "@/utils/expenseSelectors";
import React from "react";
import { Pressable, Text, View } from "react-native";

type ModeSwitcherProps = {
  value: ViewMode;
  onChange: (mode: ViewMode) => void;
};

const ModeSwitcher = ({ value, onChange }: ModeSwitcherProps) => {

    const isActive = (mode:ViewMode) => mode === value;

  return (
    <View style={{ flex: 1, flexDirection: "row", gap:"10" }}>
      <Pressable onPress={() => onChange("daily")}>
        <Text style={{ fontWeight: isActive("daily") ? "bold" : "normal" }}>
          Daily
        </Text>
      </Pressable>
      <Pressable onPress={() => onChange("weekly")}>
        <Text style={{ fontWeight: isActive("weekly") ? "bold" : "normal" }}>
          Weekly
        </Text>
      </Pressable>
      <Pressable onPress={() => onChange("monthly")}>
        <Text style={{ fontWeight: isActive("monthly") ? "bold" : "normal" }}>
          Monthly
        </Text>
      </Pressable>
    </View>
  );
};

export default ModeSwitcher;
