import React from "react";
import { ButtonProps, ColorValue, TouchableOpacity } from "react-native";
import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";
import { styles } from "../themes";
import { Text } from "./Themed";

interface iButtonProps {
  primary?: boolean;
  color?: ColorValue;
  textColor?: ColorValue;
}

export default function Button(props: ButtonProps & iButtonProps) {
  const colorScheme = useColorScheme();
  return (
    <TouchableOpacity
      activeOpacity={0.6}
      style={{
        ...styles.button,
        backgroundColor: props.primary
          ? Colors[colorScheme].tint
          : props.color || Colors[colorScheme].tabIconDefault,
      }}
      onPress={props.onPress}
    >
      <Text style={{ color: props.textColor || "white" }}>{props.title}</Text>
    </TouchableOpacity>
  );
}
