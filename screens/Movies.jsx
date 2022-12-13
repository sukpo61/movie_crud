import React from "react";
import { View, Text, TouchableOpacity, useColorScheme } from "react-native";

export default function Movies({ navigation: { navigate } }) {
  const isDark = useColorScheme() === "dark";
  return (
    <TouchableOpacity onPress={() => navigate("Stack", { screen: "Detail" })}>
      <Text style={{ color: isDark ? "white" : "black" }}>Movies</Text>
    </TouchableOpacity>
  );
}
