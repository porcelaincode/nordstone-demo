import { StatusBar, StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    marginTop: StatusBar.currentHeight,
    padding: 10,
    paddingTop: 15,
  },
  button: {
    width: "100%",
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  uploadBtn: {
    position: "absolute",
    bottom: 0,
    right: 0,
    padding: 20,
    borderRadius: 40,
    margin: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    fontSize: 14,
    color: "#2e78b7",
  },
  nav: {
    width: "100%",
    flexDirection: "row",
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "space-between",
  },
});

export const authStyles = StyleSheet.create({
  back: {
    top: 0,
    marginTop: StatusBar.currentHeight,
    paddingVertical: 20,
    position: "absolute",
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
  },
  welcome: {
    fontSize: 28,
    marginBottom: 5,
  },
  title: {
    marginBottom: 20,
    width: "100%",
    alignSelf: "center",
    textAlign: "center",
    color: "grey",
  },
  forgot: {
    width: "100%",
    marginVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  btn: {
    paddingVertical: 10,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    borderRadius: 5,
  },
  error: {
    color: "red",
    fontSize: 16,
    alignSelf: "flex-start",
  },
});
