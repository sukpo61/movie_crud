import React from "react";
import { Text, TouchableOpacity, useColorScheme, View } from "react-native";
import styled from "@emotion/native";
import Swiper from "react-native-web-swiper";
import { SCREEN_HEIGHT } from "../utils";

const Container = styled.ScrollView``;

const StyledView = styled.View`
  flex: 1;
`;

export default function Movies({ navigation: { navigate } }) {
  const isDark = useColorScheme() === "dark";
  return (
    <Container>
      <Swiper
        controlsEnabled={false}
        timeout={1}
        loop
        containerStyle={{ height: SCREEN_HEIGHT / 3 }}
      >
        <StyledView style={{ backgroundColor: "red" }}></StyledView>
        <StyledView style={{ backgroundColor: "orange" }}></StyledView>
        <StyledView style={{ backgroundColor: "yellow" }}></StyledView>
        <StyledView style={{ backgroundColor: "green" }}></StyledView>
      </Swiper>
    </Container>
  );
}
