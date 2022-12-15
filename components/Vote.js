import React from "react";
import styled from "@emotion/native";

const Rating = styled.Text`
  color: ${(props) => props.theme.color.overviewOnImg};
  margin-top: 5px;
  margin-bottom: 5px;
`;

export default function Vote({ vote_average }) {
  return <Rating>⭐️{vote_average}/10</Rating>;
}
