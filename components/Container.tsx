import React from "react";
import { ViewProps } from "react-native";
import { styles } from "../themes";
import { View } from "./Themed";

interface iContainerProps {
  centered?: boolean;
}

export default function Container(props: ViewProps & iContainerProps) {
  return (
    <View
      style={{
        ...styles.container,
        justifyContent: props.centered ? "center" : "flex-start",
      }}
    >
      {props.children}
    </View>
  );
}
