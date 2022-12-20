import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Movies from "../screens/Movies";
import My from "../screens/My";
import { GREEN_COLOR, YELLOW_COLOR } from "../colors";
import { useColorScheme } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";

const Tab = createBottomTabNavigator();

export default function Tabs() {
  const isDark = useColorScheme() === "dark";
  return (
    <Tab.Navigator
      screenOptions={{
        headerTintColor: isDark ? YELLOW_COLOR : GREEN_COLOR,
        tabBarActiveTintColor: isDark ? YELLOW_COLOR : GREEN_COLOR,
        tabBarLabelPosition: "beside-icon",
        headerTitleAlign: "center",
      }}
    >
      <Tab.Screen
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="local-movies" size={size} color={color} />
          ),
        }}
        name="Movies"
        component={Movies}
      />
      <Tab.Screen
        options={{
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="profile" size={size} color={color} />
          ),
        }}
        name="My"
        component={My}
      />
    </Tab.Navigator>
  );
}
