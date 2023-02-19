import { useEffect, useState } from "react";

import { BoldText, Text, TextInput, View } from "../components/Themed";
import Container from "../components/Container";
import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";

import { getDatabase, onValue, ref, set } from "firebase/database";
import { getAuth } from "firebase/auth";

export default function TabThreeScreen() {
  const colorScheme = useColorScheme();
  const db = getDatabase();
  const { currentUser } = getAuth();

  const [text, setText] = useState<string>("");
  const [fetched, setFetched] = useState<string | undefined>();

  function writeUserData(userId: string, text: string) {
    set(ref(db, "users/" + userId), {
      text: text,
      date: Date.now(),
    });
  }

  useEffect(() => {
    if (currentUser) {
      writeUserData(currentUser?.uid, text);
    }
  }, [text]);

  useEffect(() => {
    const textRef = ref(db, "users/" + `${currentUser?.uid}`);
    // rendered on snapshot
    const unsubscribe = onValue(textRef, (snapshot) => {
      const data = snapshot.val();
      setFetched(data.text);
    });
    return () => unsubscribe();
  }, []);

  return (
    <Container>
      <View style={{ width: "100%", alignItems: "flex-start" }}>
        <BoldText>From Firestore:</BoldText>
        <Text
          style={{
            color: fetched
              ? Colors[colorScheme].text
              : Colors[colorScheme].tabIconDefault,
          }}
        >
          {fetched || "Text fetched from firestore will be shown here"}
        </Text>
      </View>
      <View
        style={{
          position: "absolute",
          bottom: 0,
          width: "100%",
          marginBottom: 20,
        }}
      >
        <TextInput
          placeholder="Your Text"
          numberOfLines={2}
          value={text}
          onChangeText={(text) => setText(text)}
          textAlignVertical="top"
          multiline={true}
        />
      </View>
    </Container>
  );
}
