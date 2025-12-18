import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet } from "react-native";

export function LiquidBackground() {
  return (
    <>
      <LinearGradient
        colors={["#0B1026", "#1B2A5E", "#0F1A3D"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <LinearGradient
        colors={["rgba(91,141,255,0.35)", "transparent"]}
        start={{ x: 0.2, y: 0.2 }}
        end={{ x: 0.8, y: 0.8 }}
        style={StyleSheet.absoluteFill}
      />
    </>
  );
}