import { StyleSheet, View, ViewProps } from "react-native";

export default function GlassCard({ style, ...props }: ViewProps) {
  return <View style={[styles.card, style]} {...props} />;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    padding: 16,
    backgroundColor: "rgba(255,255,255,0.08)",
    overflow: "hidden",
  },
});