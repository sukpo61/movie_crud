import React from "react";
import { View, Text, useColorScheme } from "react-native";

export default function My() {
  const isDark = useColorScheme() === "dark";
  return (
    <View>
      <Text style={{ color: isDark ? "white" : "black" }}>My</Text>
    </View>
  );
}
