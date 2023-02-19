import { FontAwesome } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import { Keyboard, StatusBar, TouchableOpacity } from "react-native";
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
} from "firebase/auth";

import { BoldText, Text, TextInput, View } from "../components/Themed";
import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";

import validateEmail from "../utils/validateEmail";
import Container from "../components/Container";
import { authStyles } from "../themes";

export default function Login() {
  const colorScheme = useColorScheme();
  const auth = getAuth();
  const [register, setRegister] = useState(false);
  const [creds, setCreds] = useState<{
    email: string;
    password: string;
    error: string | null;
  }>({
    email: "",
    password: "",
    error: null,
  });
  const [sent, setSent] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [forgot, setForgot] = useState<boolean>(false);

  const [emailValidate, setEmailValidate] = useState<boolean>(false);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true); // or some other action
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false); // or some other action
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  useEffect(() => {
    if (creds.email.length > 5) {
      setEmailValidate(validateEmail(creds.email));
    } else {
      setEmailValidate(false);
    }
  }, [creds.email]);

  async function authorize() {
    if (creds.email === "" || (!forgot && creds.password === "")) {
      setCreds({
        ...creds,
        error: "Email and password are mandatory.",
      });
      return;
    }

    setLoading(true);
    if (forgot) {
      // send password change request
      await sendPasswordResetEmail(auth, creds.email)
        .then(() => setSent(true))
        .catch((err) => alert(err));
    } else {
      if (!register) {
        // login with email pass
        await signInWithEmailAndPassword(
          auth,
          creds.email,
          creds.password
        ).catch((error) => {
          setCreds({
            ...creds,
            error: error,
          });
        });
      } else {
        // register with email pass
        await createUserWithEmailAndPassword(
          auth,
          creds.email,
          creds.password
        ).catch((error) => {
          setCreds({
            ...creds,
            error: error,
          });
        });
      }
    }
    setLoading(false);
  }

  useEffect(() => {
    setTimeout(() => {
      setSent(false);
      setCreds({ password: "", email: "", error: null });
      setForgot(false);
    }, 5000);
  }, [sent]);

  return (
    <Container centered>
      <StatusBar backgroundColor={Colors[colorScheme].background} />
      {forgot && (
        <View style={authStyles.back}>
          <TouchableOpacity onPress={() => setForgot(false)}>
            <FontAwesome
              name="chevron-left"
              color={Colors[colorScheme].tint}
              size={20}
            />
          </TouchableOpacity>
        </View>
      )}
      <BoldText style={authStyles.welcome}>
        {forgot
          ? "Forgot Password"
          : register
          ? "Create account"
          : "Welcome Back"}
      </BoldText>
      {sent ? (
        <Text style={authStyles.title}>
          If your account is registered with us, you will recieve a email to
          reset password shortly...
        </Text>
      ) : (
        <>
          <Text style={authStyles.title}>
            {forgot
              ? "Enter email linked with your account to recieve link to change password"
              : register
              ? " Create your account with new credentials"
              : "Log into your account with your credentials"}
          </Text>

          <TextInput
            placeholder="email address"
            value={creds.email}
            onChangeText={(text) =>
              setCreds({ ...creds, email: text, error: null })
            }
            icon="mail"
            validate={true}
            validated={emailValidate}
            textContentType="emailAddress"
          />
          {!forgot && (
            <TextInput
              placeholder="password"
              secureTextEntry={true}
              value={creds.password}
              onChangeText={(text) =>
                setCreds({ ...creds, password: text, error: null })
              }
              icon="lock"
              validate={false}
              textContentType="password"
            />
          )}
          {creds.error && <Text style={authStyles.error}>{creds.error}</Text>}
        </>
      )}
      <View
        style={{
          ...authStyles.forgot,
          display: forgot ? "none" : "flex",
        }}
      >
        <View style={authStyles.row}>
          <TouchableOpacity>
            <FontAwesome
              name="check-square"
              color={Colors[colorScheme].tint}
              size={20}
              style={{ marginRight: 10 }}
            />
          </TouchableOpacity>
          <Text>Remember me</Text>
        </View>
        <TouchableOpacity
          onPress={() => setForgot(true)}
          style={{ display: register ? "none" : "flex" }}
        >
          <Text style={{ color: Colors[colorScheme].tint }}>
            Forgot password
          </Text>
        </TouchableOpacity>
      </View>
      {!isKeyboardVisible && (
        <View
          style={{
            width: "100%",
            position: "absolute",
            bottom: 0,
            marginBottom: 20,
          }}
        >
          <TouchableOpacity
            onPress={authorize}
            style={{
              ...authStyles.btn,
              backgroundColor: emailValidate
                ? Colors[colorScheme].tint
                : Colors[colorScheme].tabIconDefault,
            }}
            disabled={!emailValidate || loading}
          >
            <Text style={{ color: "white" }}>
              {loading ? "Loading..." : "Verify credentials"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setForgot(false);
              setRegister(!register);
            }}
            style={authStyles.btn}
          >
            <Text style={{ color: Colors[colorScheme].tint }}>
              {register ? "Log into your account" : "Create a new account"}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </Container>
  );
}
