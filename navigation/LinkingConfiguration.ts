/**
 * Learn more about deep linking with React Navigation
 * https://reactnavigation.org/docs/deep-linking
 * https://reactnavigation.org/docs/configuring-links
 */

import { LinkingOptions } from "@react-navigation/native";
import * as Linking from "expo-linking";

import { AuthStackParamList, RootStackParamList } from "../types";

export const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [Linking.createURL("/")],
  config: {
    screens: {
      Root: {
        screens: {
          TabOne: {
            screens: {
              TabOneScreen: "one",
            },
          },
          TabTwo: {
            screens: {
              TabTwoScreen: "two",
            },
          },
          TabThree: {
            screens: {
              TabThreeScreen: "three",
            },
          },
          TabFour: {
            screens: {
              TabFourScreen: "four",
            },
          },
        },
      },
      NotFound: "*",
    },
  },
};

export const authLinking: LinkingOptions<AuthStackParamList> = {
  prefixes: [Linking.createURL("/auth")],
  config: {
    screens: {
      Login: {
        screens: {
          LoginScreen: "login",
        },
      },
      Register: {
        screens: {
          RegisterScreen: "register",
        },
      },
    },
  },
};
