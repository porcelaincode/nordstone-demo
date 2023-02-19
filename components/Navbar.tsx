import { AntDesign } from "@expo/vector-icons";
import React from "react";
import { ButtonProps, ColorValue, TouchableOpacity } from "react-native";
import { styles } from "../themes";
import { View, Text } from "./Themed";

interface iNav {
  title?: string;
  icon: React.ComponentProps<typeof AntDesign>["name"];
  onPress: ButtonProps["onPress"];
  color: ColorValue | string;
}

export default function Navbar(props: iNav) {
  return (
    <View style={styles.nav}>
      <Text>{props.title}</Text>
      <TouchableOpacity onPress={props.onPress}>
        <AntDesign name={props.icon} size={25} color={props.color} />
      </TouchableOpacity>
    </View>
  );
}
