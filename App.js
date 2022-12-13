import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from "@react-navigation/native";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, useColorScheme, View } from "react-native";
import Root from "./navigation/Root";

import Detail from "./screens/Detail";

export default function App() {
  const isDark = useColorScheme() === "dark";
  return (
    <NavigationContainer theme={isDark ? DarkTheme : DefaultTheme}>
      <Root />
    </NavigationContainer>
  );
}
