import { StyleSheet, Text, View } from "react-native";

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Episodic</Text>
      <Text style={styles.subtitle}>Start building in app/index.tsx.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: "#fff",
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  subtitle: {
    color: "#666",
    fontSize: 16,
    marginTop: 8,
    textAlign: "center",
  },
  title: {
    color: "#111",
    fontSize: 32,
    fontWeight: "700",
  },
});
