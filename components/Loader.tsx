import React from "react";
import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";
import { View } from "./Themed";

interface iLoader {
  progress: number;
}

export default function Loader(props: iLoader) {
  const colorScheme = useColorScheme();
  return (
    <View
      style={{
        height: 4,
        marginBottom: 10,
        width: `${props.progress}%`,
        alignSelf: "flex-start",
        backgroundColor: Colors[colorScheme].tint,
      }}
    />
  );
}
