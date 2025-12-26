import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  onNext(): void;
};

export default function WelcomeStep({ onNext }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome 👋</Text>
      <Text style={styles.text}>
        Let’s set up your finance profile so we can help you manage money
        better.
      </Text>

      <Pressable style={styles.button} onPress={onNext}>
        <Text style={styles.buttonText}>Get started</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 24 },
  title: { fontSize: 26, fontWeight: "800", marginBottom: 12 },
  text: { fontSize: 15, opacity: 0.7 },
  button: {
    marginTop: 32,
    backgroundColor: "#6366F1",
    padding: 14,
    borderRadius: 12,
  },
  buttonText: { color: "white", fontWeight: "700", textAlign: "center" },
});