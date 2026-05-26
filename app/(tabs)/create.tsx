import { StyleSheet, Text, View } from "react-native";

export default function CreateScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create</Text>
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
  title: {
    color: "#111",
    fontSize: 28,
    fontWeight: "700",
  },
});
