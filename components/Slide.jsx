import React from "react";
import styled from "@emotion/native";
import { StyleSheet } from "react-native";
import { getImgPath } from "../utils";
import { LinearGradient } from "expo-linear-gradient";
import Vote from "./Vote";
import { useNavigation } from "@react-navigation/native";

const StyledView = styled.View`
  flex: 1;
  justify-content: flex-end;
  padding: 10px;
`;

const BackgroundImg = styled.Image`
  flex: 1;
`;

const Row = styled.TouchableOpacity`
  flex: 1;
  flex-direction: row;
  align-items: flex-end;
`;

const Column = styled.View`
  width: 65%;
  margin-left: 10px;
`;

const Poster = styled.Image`
  width: 100px;
  height: 160px;
`;

const Title = styled.Text`
  font-size: 20px;
  font-weight: 600;
  color: ${(props) => props.theme.color.titleOnImg};
`;

const Overview = styled.Text`
  font-size: 12px;
  color: ${(props) => props.theme.color.overviewOnImg};
`;

const Rating = styled.Text`
  color: ${(props) => props.theme.color.overviewOnImg};
  margin-top: 5px;
  margin-bottom: 5px;
`;

export default function Slide({ movie }) {
  const { navigate } = useNavigation();
  const goToDetail = () => {
    navigate("Stack", { screen: "Detail", params: { movieId: movie.id } });
  };
  return (
    <StyledView>
      <BackgroundImg
        style={StyleSheet.absoluteFill}
        source={{ uri: getImgPath(movie.backdrop_path || "") }}
      />
      <LinearGradient
        style={StyleSheet.absoluteFill}
        colors={["transparent", "black"]}
      />
      <Row onPress={goToDetail}>
        <Poster source={{ uri: getImgPath(movie.poster_path) }} />
        <Column>
          <Title>{movie.title}</Title>
          <Vote vote_average={movie.vote_average} />
          <Overview>
            {movie.overview.slice(0, 150)}
            {movie.overview.length > 150 && "..."}
          </Overview>
        </Column>
      </Row>
    </StyledView>
  );
}
