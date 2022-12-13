import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

export default function Movies({ navigation: { navigate } }) {
  return (
    <TouchableOpacity onPress={() => navigate("Stack", { screen: "Detail" })}>
      <Text>Movies</Text>
    </TouchableOpacity>
  );
}
