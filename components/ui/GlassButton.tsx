import { BlurView } from "expo-blur";
import { Pressable, StyleSheet, Text } from "react-native";

type Props = {
  label: string;
  onPress: () => void;
};

export function GlassButton({ label, onPress }: Props) {
  return (
    <Pressable onPress={onPress}>
      <BlurView intensity={40} tint="dark" style={styles.button}>
        <Text style={styles.text}>{label}</Text>
      </BlurView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  text: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});