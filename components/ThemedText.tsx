import { type ComponentProps } from "react";
import { StyleSheet, Text } from "react-native";

import { theme } from "@/constants/theme";

type TextProps = ComponentProps<typeof Text>;

type ThemedTextVariant = "body" | "title" | "subtitle" | "caption";

type ThemedTextProps = TextProps & {
  variant?: ThemedTextVariant;
};

export function ThemedText({
  style,
  variant = "body",
  ...props
}: ThemedTextProps) {
  return <Text style={[styles.base, styles[variant], style]} {...props} />;
}

const styles = StyleSheet.create({
  base: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.size.md,
    fontWeight: theme.typography.weight.regular,
    lineHeight: theme.typography.lineHeight.md,
  },
  body: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.size.md,
    lineHeight: theme.typography.lineHeight.md,
  },
  caption: {
    color: theme.colors.text.muted,
    fontSize: theme.typography.size.xs,
    lineHeight: theme.typography.lineHeight.xs,
  },
  subtitle: {
    color: theme.colors.text.secondary,
    fontSize: theme.typography.size.lg,
    fontWeight: theme.typography.weight.medium,
    lineHeight: theme.typography.lineHeight.lg,
  },
  title: {
    color: theme.colors.text.primary,
    fontSize: theme.typography.size["2xl"],
    fontWeight: theme.typography.weight.bold,
    lineHeight: theme.typography.lineHeight["2xl"],
  },
});
