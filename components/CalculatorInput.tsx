import React, { useState } from "react";
import { TextInputProps } from "react-native";
import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";
import { DigitalTextInput, View } from "./Themed";

interface iCInput {}

export default function CalculatorInput(props: iCInput & TextInputProps) {
  const colorScheme = useColorScheme();
  const [focus, setFocus] = useState<boolean>(false);
  return (
    <View
      style={{
        height: 50,
        width: 100,
        paddingHorizontal: 15,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: focus
          ? Colors[colorScheme].tint
          : Colors[colorScheme].tabIconDefault,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <DigitalTextInput
        style={{
          width: "100%",
          color: focus ? Colors[colorScheme].tint : Colors[colorScheme].text,
        }}
        value={props.value}
        placeholder="0"
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        {...props}
      />
    </View>
  );
}
