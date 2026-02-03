import { forwardRef } from "react";
import {
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputProps,
  TextStyle,
} from "react-native";

import { useColorScheme } from "@/hooks/use-color-scheme";

type ThemedTextInputProps = TextInputProps & {
  style?: StyleProp<TextStyle>;
};

export const ThemedTextInput = forwardRef<TextInput, ThemedTextInputProps>(
  ({ style, placeholderTextColor, ...props }, ref) => {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";
    return (
      <TextInput
        ref={ref}
        style={[
          styles.base,
          isDark ? styles.inputDark : styles.inputLight,
          style,
        ]}
        placeholderTextColor={
          placeholderTextColor ?? (isDark ? "#888" : "#666")
        }
        {...props}
      />
    );
  },
);

ThemedTextInput.displayName = "ThemedTextInput";

const styles = StyleSheet.create({
  base: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
  },
  inputDark: {
    color: "#f5f5f5",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderColor: "rgba(255,255,255,0.2)",
  },
  inputLight: {
    color: "#111",
    backgroundColor: "rgba(0,0,0,0.04)",
    borderColor: "rgba(0,0,0,0.1)",
  },
});
