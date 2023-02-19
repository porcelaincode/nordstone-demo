/**
 * Learn more about Light and Dark modes:
 * https://docs.expo.io/guides/color-schemes/
 */

import {
  Text as DefaultText,
  View as DefaultView,
  TextInput as DefaultTextInput,
} from "react-native";

import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";

import {
  useFonts,
  Inter_400Regular,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import { Orbitron_400Regular } from "@expo-google-fonts/orbitron";

import { AntDesign } from "@expo/vector-icons";
import { useState } from "react";

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const theme = useColorScheme();
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}

type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};

interface ExtraTextProps {
  digital?: boolean;
}

export type TextProps = ThemeProps & DefaultText["props"] & ExtraTextProps;
export type ViewProps = ThemeProps & DefaultView["props"];

export function Text(props: TextProps) {
  let [fontsLoaded] = useFonts({
    Inter_400Regular,
    Orbitron_400Regular,
  });

  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");

  if (!fontsLoaded) {
    return null;
  } else {
    return (
      <DefaultText
        style={[
          {
            color,
            fontFamily: props.digital
              ? "Orbitron_400Regular"
              : "Inter_400Regular",
            fontSize: 18,
          },
          style,
        ]}
        {...otherProps}
      />
    );
  }
}

export function BoldText(props: TextProps) {
  let [fontsLoaded] = useFonts({
    Inter_700Bold,
  });

  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");

  if (!fontsLoaded) {
    return null;
  } else {
    return (
      <DefaultText
        style={[{ color, fontFamily: "Inter_700Bold", fontSize: 18 }, style]}
        {...otherProps}
      />
    );
  }
}

export function View(props: ViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "background"
  );

  return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
}

interface ExtraInputProps {
  icon?: React.ComponentProps<typeof AntDesign>["name"];
  validate?: boolean;
  validated?: boolean;
  full?: boolean;
}

export type InputProps = ThemeProps &
  DefaultTextInput["props"] &
  ExtraInputProps;

export function TextInput(props: InputProps) {
  const [focus, setFocus] = useState(props.autoFocus);
  const colorScheme = useColorScheme();

  let [fontsLoaded] = useFonts({
    Inter_400Regular,
  });

  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");

  if (!fontsLoaded) {
    return null;
  } else {
    return (
      <View
        style={{
          width: "100%",
          alignItems: "flex-start",
        }}
      >
        <View
          style={{
            width: "100%",
            padding: 10,
            paddingHorizontal: 15,
            borderWidth: 1,
            borderColor: focus
              ? props.validated
                ? Colors[colorScheme].tint
                : Colors[colorScheme].activeBackground
              : Colors[colorScheme].tabIconDefault,
            borderRadius: 5,
            flexDirection: "row",
            alignItems: "center",
            marginVertical: 10,
          }}
        >
          {props.icon && (
            <AntDesign
              name={props.icon}
              size={20}
              style={{ marginRight: 10 }}
              color={
                focus
                  ? props.validated
                    ? Colors[colorScheme].tint
                    : Colors[colorScheme].activeBackground
                  : Colors[colorScheme].tabIconDefault
              }
            />
          )}
          <DefaultTextInput
            cursorColor={Colors[colorScheme].tint}
            onFocus={() => setFocus(true)}
            onBlur={() => setFocus(false)}
            style={[
              { color, fontFamily: "Inter_400Regular", fontSize: 18, flex: 1 },
              style,
            ]}
            {...otherProps}
          />
          {/* {props.validate && (
          <AntDesign
          name={"check"}
          size={20}
          color={props.validated ? Colors[colorScheme].tint : "transparent"}
          />
        )} */}
        </View>
      </View>
    );
  }
}

export function DigitalTextInput(props: InputProps) {
  const colorScheme = useColorScheme();

  let [fontsLoaded] = useFonts({
    Orbitron_400Regular,
  });

  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");

  if (!fontsLoaded) {
    return null;
  } else {
    return (
      <DefaultTextInput
        cursorColor={Colors[colorScheme].tint}
        style={[
          { color, fontFamily: "Orbitron_400Regular", fontSize: 18, flex: 1 },
          style,
        ]}
        {...otherProps}
      />
    );
  }
}
