import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from "@react-navigation/native";

import { useColorScheme } from "react-native";
import Root from "./navigation/Root";

export default function App() {
  const isDark = useColorScheme() === "dark";
  return (
    <NavigationContainer theme={isDark ? DarkTheme : DefaultTheme}>
      <Root />
    </NavigationContainer>
  );
}
