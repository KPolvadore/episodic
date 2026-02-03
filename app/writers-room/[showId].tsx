import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Alert, Pressable, StyleSheet, TextInput, View } from "react-native";

import ParallaxScrollView from "@/components/parallax-scroll-view";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { IconSymbol } from "@/components/ui/icon-symbol";
import { useCreatorStore } from "@/src/state/creator-store";
import { useWritersRoomStore } from "@/src/state/writers-room-store";

export default function WritersRoomScreen() {
  const params = useLocalSearchParams<{ showId?: string | string[] }>();
  const showId = Array.isArray(params.showId)
    ? params.showId[0]
    : params.showId || "";
  const membersByShowId = useWritersRoomStore((s) => s.membersByShowId);
  const roleByShowId = useWritersRoomStore((s) => s.roleByShowId);
  const seedShow = useWritersRoomStore((s) => s.seedShow);
  const invite = useWritersRoomStore((s) => s.invite);
  const remove = useWritersRoomStore((s) => s.remove);
  const setMyRole = useWritersRoomStore((s) => s.setMyRole);
  const draftsForShow = useCreatorStore((s) => s.draftEpisodesByShowId);
  const unshareDraft = useCreatorStore((s) => s.unshareDraft);
  const [inviteName, setInviteName] = useState("");
  const [inviteRole, setInviteRole] = useState<"editor" | "viewer">("editor");

  useEffect(() => {
    if (showId) {
      seedShow(showId);
    }
  }, [showId, seedShow]);

  const members = membersByShowId[showId] || [];
  const myRole = roleByShowId[showId] || "viewer";
  const canInvite = myRole === "owner" || myRole === "editor";

  const sharedDrafts = useMemo(() => {
    const drafts = draftsForShow[showId] || [];
    return drafts
      .filter((d) => d.sharedWithWritersRoom)
      .slice()
      .sort((a, b) => {
        const aTime = a.sharedAt ?? a.createdAtIso;
        const bTime = b.sharedAt ?? b.createdAtIso;
        return new Date(bTime).getTime() - new Date(aTime).getTime();
      });
  }, [draftsForShow, showId]);

  const handleInvite = () => {
    if (inviteName.trim() && showId) {
      invite(showId, {
        displayName: inviteName.trim(),
        role: inviteRole,
      });
      setInviteName("");
    }
  };

  const handleRemove = (memberId: string) => {
    if (showId) {
      remove(showId, memberId);
    }
  };

  const sharedDraftsList =
    sharedDrafts.length > 0 ? (
      sharedDrafts.map((draft) => (
        <Pressable
          key={draft.id}
          style={styles.draftItem}
          onPress={() =>
            router.push(
              `/create-episode?showId=${showId}&draftEpisodeId=${draft.id}`,
            )
          }
        >
          <View style={styles.draftInfo}>
            <ThemedText>{draft.title}</ThemedText>
            <View style={styles.draftMeta}>
              <ThemedText style={styles.draftStatus}>Draft</ThemedText>
              <ThemedView style={styles.sharedBadge}>
                <ThemedText style={styles.sharedBadgeText}>Shared</ThemedText>
              </ThemedView>
            </View>
          </View>
          {(myRole === "owner" || myRole === "editor") && (
            <Pressable
              style={styles.unshareButton}
              onPress={() => {
                if (showId) unshareDraft(showId, draft.id);
                Alert.alert(
                  "Removed",
                  "Draft was unshared from the Writer’s Room.",
                );
              }}
            >
              <ThemedText style={styles.unshareButtonText}>Unshare</ThemedText>
            </Pressable>
          )}
        </Pressable>
      ))
    ) : (
      <ThemedText style={styles.emptyText}>No drafts shared yet.</ThemedText>
    );

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="person.3.fill"
          style={styles.headerImage}
        />
      }
    >
      <ThemedView style={styles.backButton}>
        <Pressable onPress={() => router.back()}>
          <IconSymbol size={24} color="#007AFF" name="chevron.left" />
        </Pressable>
      </ThemedView>

      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Writers Room</ThemedText>
        <ThemedText>Show ID: {showId}</ThemedText>
      </ThemedView>

      {__DEV__ && (
        <ThemedView style={styles.devControls}>
          <ThemedText>DEV: Toggle Role</ThemedText>
          <View style={styles.roleButtons}>
            {(["owner", "editor", "viewer"] as const).map((role) => (
              <Pressable
                key={role}
                style={[
                  styles.roleButton,
                  myRole === role && styles.roleButtonActive,
                ]}
                onPress={() => showId && setMyRole(showId, role)}
              >
                <ThemedText style={styles.roleButtonText}>{role}</ThemedText>
              </Pressable>
            ))}
          </View>
        </ThemedView>
      )}

      <ThemedView style={styles.membersContainer}>
        <ThemedText type="subtitle">Members ({members.length})</ThemedText>
        {members.map((member) => (
          <ThemedView key={member.id} style={styles.memberItem}>
            <View style={styles.memberInfo}>
              <ThemedText>{member.displayName}</ThemedText>
              <ThemedText style={styles.roleBadge}>
                {member.role.toUpperCase()}
              </ThemedText>
            </View>
            {canInvite && member.id !== "current-user" && (
              <Pressable
                style={styles.removeButton}
                onPress={() => handleRemove(member.id)}
              >
                <ThemedText style={styles.removeButtonText}>Remove</ThemedText>
              </Pressable>
            )}
          </ThemedView>
        ))}
      </ThemedView>

      <ThemedView style={styles.sharedDraftsContainer}>
        <ThemedText type="subtitle">
          Shared Drafts ({sharedDrafts.length})
        </ThemedText>
        {sharedDraftsList}
      </ThemedView>

      {canInvite ? (
        <ThemedView style={styles.inviteContainer}>
          <ThemedText type="subtitle">Invite Member</ThemedText>
          <TextInput
            style={styles.textInput}
            placeholder="Display Name"
            value={inviteName}
            onChangeText={setInviteName}
          />
          <View style={styles.roleSelector}>
            <Pressable
              style={[
                styles.roleOption,
                inviteRole === "editor" && styles.roleOptionActive,
              ]}
              onPress={() => setInviteRole("editor")}
            >
              <ThemedText>Editor</ThemedText>
            </Pressable>
            <Pressable
              style={[
                styles.roleOption,
                inviteRole === "viewer" && styles.roleOptionActive,
              ]}
              onPress={() => setInviteRole("viewer")}
            >
              <ThemedText>Viewer</ThemedText>
            </Pressable>
          </View>
          <Pressable style={styles.inviteButton} onPress={handleInvite}>
            <ThemedText style={styles.inviteButtonText}>Add Member</ThemedText>
          </Pressable>
        </ThemedView>
      ) : (
        <ThemedView style={styles.readOnly}>
          <ThemedText>
            You have viewer access. Contact an owner or editor to invite
            members.
          </ThemedText>
        </ThemedView>
      )}
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    bottom: 0,
    left: 0,
    position: "absolute",
  },
  backButton: {
    marginTop: 16,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  devControls: {
    marginTop: 16,
    padding: 12,
    backgroundColor: "rgba(255,255,0,0.1)",
    borderRadius: 8,
  },
  roleButtons: {
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
  },
  roleButton: {
    padding: 8,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 4,
  },
  roleButtonActive: {
    backgroundColor: "rgba(0,255,0,0.2)",
  },
  roleButtonText: {
    fontSize: 12,
  },
  membersContainer: {
    marginTop: 16,
  },
  memberItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    marginBottom: 8,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 8,
  },
  memberInfo: {
    flex: 1,
  },
  roleBadge: {
    fontSize: 12,
    color: "#888",
    marginTop: 4,
  },
  removeButton: {
    padding: 8,
    backgroundColor: "rgba(255,0,0,0.1)",
    borderRadius: 4,
  },
  removeButtonText: {
    color: "#ff0000",
    fontSize: 12,
  },
  inviteContainer: {
    marginTop: 16,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    borderRadius: 4,
    padding: 8,
    marginTop: 8,
    color: "#fff",
  },
  roleSelector: {
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
  },
  roleOption: {
    padding: 8,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 4,
  },
  roleOptionActive: {
    backgroundColor: "rgba(0,255,0,0.2)",
  },
  inviteButton: {
    marginTop: 8,
    padding: 12,
    backgroundColor: "rgba(0,255,0,0.1)",
    borderRadius: 4,
    alignItems: "center",
  },
  inviteButtonText: {
    color: "#00ff00",
  },
  readOnly: {
    marginTop: 16,
    padding: 12,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 8,
  },
  sharedDraftsContainer: {
    marginTop: 16,
  },
  draftItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    marginBottom: 8,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 8,
  },
  draftInfo: {
    flex: 1,
  },
  draftMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 4,
  },
  draftStatus: {
    fontSize: 12,
    color: "#888",
  },
  sharedBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    backgroundColor: "#4CAF50",
    borderRadius: 4,
  },
  sharedBadgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
  unshareButton: {
    padding: 8,
    backgroundColor: "rgba(255,165,0,0.1)",
    borderRadius: 4,
  },
  unshareButtonText: {
    color: "#FFA500",
    fontSize: 12,
  },
  emptyText: {
    padding: 12,
    textAlign: "center",
    color: "#888",
  },
});
