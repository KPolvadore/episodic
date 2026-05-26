import { useMemo, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { theme } from "@/constants/theme";
import {
  defaultShowCategory,
  defaultShowVisibility,
  isShowPublic,
  isValidShowTitle,
  normalizeShowTitle,
  showCategories,
  showVisibilityOptions,
} from "@/models/show";
import type { ShowCategory, ShowVisibility } from "@/types/show";

type EditShowParams = {
  category?: ShowCategory;
  description?: string;
  showId?: string;
  title?: string;
  visibility?: ShowVisibility;
};

function getParamValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function getShowCategoryParam(value: string | string[] | undefined) {
  const category = getParamValue(value);

  return showCategories.find((option) => option === category);
}

function getShowVisibilityParam(value: string | string[] | undefined) {
  const visibility = getParamValue(value);

  return showVisibilityOptions.find((option) => option === visibility);
}

export default function EditShowScreen() {
  const params = useLocalSearchParams<EditShowParams>();

  const initialTitle = getParamValue(params.title) ?? "";
  const initialDescription = getParamValue(params.description) ?? "";
  const initialCategory =
    getShowCategoryParam(params.category) ?? defaultShowCategory;
  const initialVisibility =
    getShowVisibilityParam(params.visibility) ?? defaultShowVisibility;

  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [category, setCategory] = useState<ShowCategory>(initialCategory);
  const [visibility, setVisibility] =
    useState<ShowVisibility>(initialVisibility);

  const normalizedTitle = useMemo(() => normalizeShowTitle(title), [title]);
  const canSave = isValidShowTitle(title);

  return (
    <ThemedView variant="screen" style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <ThemedText variant="title">Edit Show</ThemedText>
          <ThemedText variant="body" style={styles.helperText}>
            Update the local draft fields. Saving will be connected later.
          </ThemedText>
        </View>

        <ThemedView variant="card" style={styles.form}>
          <View style={styles.field}>
            <ThemedText variant="subtitle">Show title</ThemedText>
            <TextInput
              onChangeText={setTitle}
              placeholder="Name your show"
              placeholderTextColor={theme.colors.text.muted}
              style={styles.input}
              value={title}
            />
            {!canSave ? (
              <ThemedText variant="caption" style={styles.validationText}>
                A title is required before this can be saved.
              </ThemedText>
            ) : null}
          </View>

          <View style={styles.field}>
            <ThemedText variant="subtitle">Description</ThemedText>
            <TextInput
              multiline
              onChangeText={setDescription}
              placeholder="What should viewers expect?"
              placeholderTextColor={theme.colors.text.muted}
              style={[styles.input, styles.descriptionInput]}
              textAlignVertical="top"
              value={description}
            />
          </View>

          <View style={styles.field}>
            <ThemedText variant="subtitle">Category</ThemedText>
            <View style={styles.optionWrap}>
              {showCategories.map((option) => (
                <Pressable
                  key={option}
                  onPress={() => setCategory(option)}
                  style={[
                    styles.option,
                    option === category ? styles.selectedOption : null,
                  ]}
                >
                  <ThemedText
                    variant="caption"
                    style={[
                      styles.optionText,
                      option === category ? styles.selectedOptionText : null,
                    ]}
                  >
                    {option}
                  </ThemedText>
                </Pressable>
              ))}
            </View>
          </View>

          <View style={styles.field}>
            <ThemedText variant="subtitle">Visibility</ThemedText>
            <ThemedText variant="caption" style={styles.helperText}>
              Private Shows are only visible to you once account support is
              connected.
            </ThemedText>
            <View style={styles.optionWrap}>
              {showVisibilityOptions.map((option) => (
                <Pressable
                  key={option}
                  onPress={() => setVisibility(option)}
                  style={[
                    styles.option,
                    option === visibility ? styles.selectedOption : null,
                  ]}
                >
                  <ThemedText
                    variant="caption"
                    style={[
                      styles.optionText,
                      option === visibility ? styles.selectedOptionText : null,
                    ]}
                  >
                    {option}
                  </ThemedText>
                </Pressable>
              ))}
            </View>
          </View>
        </ThemedView>

        <ThemedView variant="card" style={styles.preview}>
          <ThemedText variant="subtitle">Local edit preview</ThemedText>
          <ThemedText variant="body">
            {normalizedTitle || "Untitled Show"}
          </ThemedText>
          <ThemedText variant="caption" style={styles.helperText}>
            {category} - {isShowPublic(visibility) ? "public" : "private"}
          </ThemedText>
          <ThemedText variant="caption" style={styles.helperText}>
            This edit form is UI-only and does not save yet.
          </ThemedText>
        </ThemedView>

        <Pressable
          accessibilityState={{ disabled: !canSave }}
          disabled={!canSave}
          style={[styles.saveButton, !canSave ? styles.disabledButton : null]}
        >
          <ThemedText variant="body" style={styles.saveText}>
            Save Changes Later
          </ThemedText>
        </Pressable>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: theme.spacing.xl,
    paddingBottom: theme.spacing["3xl"],
  },
  descriptionInput: {
    minHeight: 112,
  },
  disabledButton: {
    opacity: 0.44,
  },
  field: {
    gap: theme.spacing.sm,
  },
  form: {
    gap: theme.spacing.xl,
  },
  header: {
    gap: theme.spacing.sm,
  },
  helperText: {
    color: theme.colors.text.secondary,
  },
  input: {
    backgroundColor: theme.colors.background.secondary,
    borderColor: theme.colors.border.subtle,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    color: theme.colors.text.primary,
    fontSize: theme.typography.size.md,
    lineHeight: theme.typography.lineHeight.md,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  option: {
    borderColor: theme.colors.border.subtle,
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  optionText: {
    color: theme.colors.text.secondary,
    textTransform: "capitalize",
  },
  optionWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.sm,
  },
  preview: {
    gap: theme.spacing.sm,
  },
  saveButton: {
    alignItems: "center",
    backgroundColor: theme.colors.brand.primary,
    borderRadius: theme.radius.md,
    padding: theme.spacing.lg,
  },
  saveText: {
    fontWeight: theme.typography.weight.bold,
  },
  screen: {
    paddingTop: theme.spacing.xl,
  },
  selectedOption: {
    backgroundColor: theme.colors.brand.primary,
    borderColor: theme.colors.brand.primary,
  },
  selectedOptionText: {
    color: theme.colors.text.primary,
  },
  validationText: {
    color: theme.colors.state.warning,
  },
});
