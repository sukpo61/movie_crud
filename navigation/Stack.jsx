import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Detail from "../screens/Detail";
import { Text, TouchableOpacity, useColorScheme } from "react-native";
import { GREEN_COLOR, YELLOW_COLOR } from "../colors";
import Login from "../screens/Login";
import Review from "../screens/Review";
import { authService } from "../firebase";
import { signOut } from "firebase/auth";
import Reviewedit from "../screens/Reviewedit";

const NativeStack = createNativeStackNavigator();

export default function Stack({
  navigation: { goBack, navigate, setOptions },
}) {
  const isDark = useColorScheme() === "dark";

  const handleAuth = () => {
    if (!!authService.currentUser?.uid) {
      // 로그아웃 요청
      signOut(authService)
        .then(() => {
          console.log("로그아웃 성공");
          setOptions({ headerRight: null });
        })
        .catch((err) => alert(err));
    } else {
      // 로그인 화면으로
      navigate("Login");
    }
  };
  return (
    <NativeStack.Navigator
      screenOptions={{
        headerTitleAlign: "center",
        headerLeft: () => (
          <TouchableOpacity onPress={() => goBack()}>
            <Text style={{ color: isDark ? YELLOW_COLOR : GREEN_COLOR }}>
              뒤로
            </Text>
          </TouchableOpacity>
        ),
        headerRight: () => {
          return (
            <TouchableOpacity onPress={handleAuth}>
              <Text style={{ color: isDark ? YELLOW_COLOR : GREEN_COLOR }}>
                {authService.currentUser ? "로그아웃" : "로그인"}
              </Text>
            </TouchableOpacity>
          );
        },
        headerTintColor: isDark ? YELLOW_COLOR : GREEN_COLOR,
      }}
    >
      <NativeStack.Screen name="Detail" component={Detail} />
      <NativeStack.Screen name="Login" component={Login} />
      <NativeStack.Screen name="Review" component={Review} />
      <NativeStack.Screen name="Reviewedit" component={Reviewedit} />
    </NativeStack.Navigator>
  );
}
