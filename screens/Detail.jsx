import React from "react";
import { View, Text, useColorScheme } from "react-native";

export default function Detail() {
  const isDark = useColorScheme() === "dark";
  return (
    <View>
      <Text style={{ color: isDark ? "white" : "black" }}>Detail</Text>
    </View>
  );
}
