import { StyleSheet, TouchableOpacity } from "react-native";

import Container from "../components/Container";
import { Text } from "../components/Themed";
import { styles } from "../themes";

import { RootStackScreenProps } from "../types";

export default function NotFoundScreen({
  navigation,
}: RootStackScreenProps<"NotFound">) {
  return (
    <Container centered>
      <Text style={styles.title}>This screen doesn't exist.</Text>
      <TouchableOpacity
        onPress={() => navigation.replace("Root")}
        style={styles.link}
      >
        <Text style={styles.linkText}>Go to home screen!</Text>
      </TouchableOpacity>
    </Container>
  );
}
