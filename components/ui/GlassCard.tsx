import { BlurView } from "expo-blur";
import { ViewStyle } from "react-native";

type Props = {
  children: React.ReactNode;
  style?: ViewStyle;
};

export function GlassCard({ children, style }: Props) {
  return (
    <BlurView
      intensity={45}
      tint="dark"
      style={[
        {
          borderRadius: 20,
          padding: 16,
          borderWidth: 1,
          borderColor: "rgba(255,255,255,0.15)",
          backgroundColor: "rgba(255,255,255,0.08)",
        },
        style,
      ]}
    >
      {children}
    </BlurView>
  );
}