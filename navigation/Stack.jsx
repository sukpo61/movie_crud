import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Detail from "../screens/Detail";
import { Text, TouchableOpacity, useColorScheme } from "react-native";
import { GREEN_COLOR, YELLOW_COLOR } from "../colors";

const NativeStack = createNativeStackNavigator();

export default function Stack({ navigation: { goBack } }) {
  const isDark = useColorScheme() === "dark";
  return (
    <NativeStack.Navigator
      screenOptions={{
        headerLeft: () => (
          <TouchableOpacity onPress={() => goBack()}>
            <Text style={{ color: isDark ? YELLOW_COLOR : GREEN_COLORd }}>
              뒤로
            </Text>
          </TouchableOpacity>
        ),
        headerTintColor: isDark ? YELLOW_COLOR : GREEN_COLOR,
      }}
    >
      <NativeStack.Screen name="Detail" component={Detail} />
    </NativeStack.Navigator>
  );
}
