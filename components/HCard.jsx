import React from "react";
import styled from "@emotion/native";
import { getImgPath } from "../utils";
import { useNavigation } from "@react-navigation/native";

const Row = styled.TouchableOpacity`
  flex-direction: row;
  margin-left: 20px;
`;
const Poster = styled.Image`
  width: 100px;
  height: 150px;
  background-color: grey;
  border-radius: 5px;
`;
const Title = styled.Text`
  font-size: 20px;
  font-weight: 500;
  color: ${(props) => props.theme.color.title};
`;

const Overview = styled.Text`
  font-size: 15px;
  line-height: 20px;
  font-weight: 500;
  color: ${(props) => props.theme.color.overview};
`;

const Column = styled.View`
  margin-left: 20px;
  width: 60%;
`;

const Release = styled.Text`
  font-size: 16px;
  font-weight: 300;
  color: ${(props) => props.theme.color.title};
  margin-top: 10px;
  margin-bottom: 10px;
`;

export default function HCard({ movie }) {
  const { navigate } = useNavigation();
  const goToDetail = () => {
    navigate("Stack", { screen: "Detail", params: { movieId: movie.id } });
  };

  return (
    <Row onPress={goToDetail}>
      <Poster source={{ uri: getImgPath(movie.poster_path) }} />
      <Column>
        <Title>{movie.title}</Title>
        <Release>{movie.release_date}</Release>
        <Overview>
          {movie.overview.slice(0, 70)}
          {movie.overview.length > 70 && "..."}
        </Overview>
      </Column>
    </Row>
  );
}
