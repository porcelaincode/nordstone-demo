import { useState, useRef, useEffect } from "react";
import { Platform } from "react-native";

import * as Device from "expo-device";
import * as Notifications from "expo-notifications";

import Button from "../components/Button";
import Container from "../components/Container";
import { View } from "../components/Themed";
import Navbar from "../components/Navbar";
import useColorScheme from "../hooks/useColorScheme";
import Colors from "../constants/Colors";

import { getAuth, signOut } from "firebase/auth";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function TabOneScreen() {
  const auth = getAuth();

  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);

  const colorScheme = useColorScheme();
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) =>
      setExpoPushToken(token)
    );

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  const handleLogout = async () => {
    await signOut(auth).catch((err) => alert(err));
  };

  return (
    <Container centered>
      <View style={{ position: "absolute", top: 0, width: "100%" }}>
        <Navbar
          icon="logout"
          onPress={handleLogout}
          color={Colors[colorScheme].text}
        />
      </View>
      <Button
        title="Fetch Notification"
        onPress={async () => {
          await schedulePushNotification();
        }}
        color="red"
        textColor={"white"}
      />
    </Container>
  );
}

async function schedulePushNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Nordstone Demo",
      body: "You've recieved a notification. Click on this notification to open the app screen.",
      data: { data: "goes here" },
    },
    trigger: { seconds: 1 },
  });
}

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("Test Notifications", {
      name: "Test Notification",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  }
  // else {
  //   alert("Must use physical device for Push Notifications");
  // }

  return token;
}
