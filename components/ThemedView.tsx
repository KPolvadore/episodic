import { type ComponentProps } from "react";
import { StyleSheet, View } from "react-native";

import { theme } from "@/constants/theme";

type ViewProps = ComponentProps<typeof View>;

type ThemedViewVariant = "default" | "screen" | "card";

type ThemedViewProps = ViewProps & {
  variant?: ThemedViewVariant;
};

export function ThemedView({
  style,
  variant = "default",
  ...props
}: ThemedViewProps) {
  return <View style={[styles[variant], style]} {...props} />;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.background.elevated,
    borderColor: theme.colors.border.subtle,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    padding: theme.spacing.lg,
    ...theme.shadows.sm,
  },
  default: {
    backgroundColor: theme.colors.background.secondary,
  },
  screen: {
    backgroundColor: theme.colors.background.primary,
    flex: 1,
    padding: theme.spacing.lg,
  },
});
