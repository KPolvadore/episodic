import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { theme } from "@/constants/theme";
import { isShowPublic } from "@/models/show";
import type { ShowVisibility } from "@/types/show";

type ShowVisibilityBadgeProps = {
  visibility: ShowVisibility;
};

export function ShowVisibilityBadge({ visibility }: ShowVisibilityBadgeProps) {
  const isPublic = isShowPublic(visibility);

  return (
    <View style={[styles.badge, isPublic ? styles.public : styles.private]}>
      <ThemedText
        variant="caption"
        style={[
          styles.label,
          isPublic ? styles.publicLabel : styles.privateLabel,
        ]}
      >
        {isPublic ? "Public" : "Private"}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: "flex-start",
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
  },
  label: {
    fontWeight: theme.typography.weight.semibold,
  },
  private: {
    backgroundColor: theme.colors.background.secondary,
    borderColor: theme.colors.brand.accent,
  },
  privateLabel: {
    color: theme.colors.brand.accent,
  },
  public: {
    backgroundColor: theme.colors.background.secondary,
    borderColor: theme.colors.brand.secondary,
  },
  publicLabel: {
    color: theme.colors.brand.secondary,
  },
});
