import React from "react";
import styled from "@emotion/native";
import { DARK_COLOR } from "../colors";
import { getImgPath } from "../utils";
import Vote from "./Vote";
import { useNavigation } from "@react-navigation/native";

const Poster = styled.Image`
  width: 120px;
  height: 170px;
  background-color: grey;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
`;
const Title = styled.Text`
  font-size: 13px;
  font-weight: 600;
  color: ${(props) => props.theme.color.titleOnImg};
`;

const VWrapper = styled.TouchableOpacity`
  background-color: ${DARK_COLOR};
  border-radius: 5px;
`;

const Column = styled.View`
  padding: 10px;
`;

export default function VCard({ movie }) {
  const { navigate } = useNavigation();
  const goToDetail = () => {
    navigate("Stack", { screen: "Detail", params: { movieId: movie.id } });
  };
  return (
    <VWrapper onPress={goToDetail}>
      <Poster source={{ uri: getImgPath(movie.poster_path) }} />
      <Column>
        <Vote vote_average={movie.vote_average} />
        <Title>
          {movie.title.slice(0, 11)}
          {movie.title.length > 11 && "..."}
        </Title>
      </Column>
    </VWrapper>
  );
}
