import React from "react";
import { Linking, StyleSheet, Text, useColorScheme } from "react-native";
import styled from "@emotion/native";
import { getImgPath } from "../utils";
import { SCREEN_HEIGHT } from "../utils";
import { LinearGradient } from "expo-linear-gradient";
import { AntDesign } from "@expo/vector-icons";
import { useQuery } from "react-query";
import { getDetail } from "../api";
import Loader from "../components/Loader";

const Container = styled.ScrollView``;
const View = styled.View`
  height: ${SCREEN_HEIGHT / 4 + "px"};
  justify-content: flex-end;
`;
const BackdropImg = styled.Image`
  width: 100%;
  flex: 1;
`;
const Title = styled.Text`
  color: ${(props) => props.theme.color.title};
  font-size: 30px;
  font-weight: 600;
  margin-left: 20px;
`;
const Overview = styled.Text`
  color: ${(props) => props.theme.color.overview};
  font-size: 15px;
  font-weight: 400;
  padding: 20px;
  line-height: 20px;
`;
const Row = styled.TouchableOpacity`
  flex-direction: row;
  margin-bottom: 10px;
`;
const VideoName = styled.Text`
  color: ${(props) => props.theme.color.title};
  font-size: 16px;
  line-height: 24px;
  font-weight: 500;
  margin-left: 10px;
`;
const YoutubeList = styled.View`
  padding-left: 20px;
  padding-right: 20px;
`;

export default function Detail({
  route: {
    params: { movie },
  },
}) {
  const isDark = useColorScheme() === "dark";
  const openYoutube = async (key) => {
    const url = `https://www.youtube.com/watch?v=${key}`;
    await Linking.openURL(url);
  };

  const { data, isLoading } = useQuery(["movie", movie.id], getDetail);
  if (isLoading) {
    return <Loader />;
  }

  return (
    <Container>
      <View>
        <BackdropImg
          style={StyleSheet.absoluteFill}
          source={{ uri: getImgPath(movie.backdrop_path) }}
        />
        <LinearGradient
          style={StyleSheet.absoluteFill}
          colors={["transparent", "black"]}
        />
        <Title>{movie.title}</Title>
      </View>
      <Overview>{movie.overview}</Overview>
      <YoutubeList>
        {data?.videos?.results.map((video) => (
          <Row key={video.key} onPress={() => openYoutube(video.key)}>
            <AntDesign
              name="youtube"
              size={24}
              color={isDark ? "white" : "black"}
            />
            <VideoName>{video.name}</VideoName>
          </Row>
        ))}
      </YoutubeList>
    </Container>
  );
}
