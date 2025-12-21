import { Feather } from "@expo/vector-icons";
import React from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";

type SearchBarProps = {
  value: string;
  onChange: (text: string) => void;
};

export default function SearchBar({ value, onChange }: SearchBarProps) {
  const hasValue = value.length > 0;

  return (
    <View style={styles.container}>
      <Feather
        name="search"
        size={16}
        color="rgba(255,255,255,0.45)"
        style={styles.icon}
      />

      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder="Search expenses…"
        placeholderTextColor="rgba(255,255,255,0.45)"
        style={styles.input}
        autoCorrect={false}
        autoCapitalize="none"
        returnKeyType="search"
      />

      {hasValue && (
        <Pressable
          onPress={() => onChange("")}
          hitSlop={10}
          style={styles.clear}
        >
          <Feather name="x" size={16} color="rgba(255,255,255,0.6)" />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    height: 48,
    paddingHorizontal: 12,
    backgroundColor: "rgba(17,24,39,0.55)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    color: "rgba(255,255,255,0.9)",
    fontSize: 14,
    fontWeight: "500",
  },
  clear: {
    marginLeft: 6,
  },
});