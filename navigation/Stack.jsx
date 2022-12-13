import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Detail from "../screens/Detail";
import { Text, TouchableOpacity } from "react-native";

const NativeStack = createNativeStackNavigator();

export default function Stack({ navigation: { goBack } }) {
  return (
    <NativeStack.Navigator
      screenOptions={{
        headerLeft: () => (
          <TouchableOpacity onPress={() => goBack()}>
            <Text>뒤로</Text>
          </TouchableOpacity>
        ),
      }}
    >
      <NativeStack.Screen name="Detail" component={Detail} />
    </NativeStack.Navigator>
  );
}
