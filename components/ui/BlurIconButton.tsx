
import { BlurView } from "expo-blur";
import { Pressable } from "react-native";

type Props = {
  children: React.ReactNode;
  onPress?: () => void;
};

export function BlurIconButton({ children, onPress }: Props) {
  return (
    <Pressable onPress={onPress}>
      <BlurView
        intensity={30}
        tint="dark"
        style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          justifyContent: "center",
          alignItems: "center",
          borderWidth: 1,
          borderColor: "rgba(255,255,255,0.2)",
        }}
      >
        {children}
      </BlurView>
    </Pressable>
  );
}