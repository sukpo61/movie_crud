import { useEffect } from "react";
import styled from "@emotion/native";
import { useColorScheme, TouchableOpacity } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { GREEN_COLOR, YELLOW_COLOR } from "../colors";
import { authService } from "../firebase";

export const Container = styled.ScrollView`
  padding: 20px;
`;

export const SectionTitle = styled.Text`
  font-size: 30px;
  font-weight: 600;
  color: ${(props) => props.theme.color.title};
  margin-bottom: 15px;
`;

export const Ratings = styled.Text`
  color: ${(props) => props.theme.color.overview};
  font-size: 20px;
  margin-bottom: 20px;
`;
export const Title = styled.Text`
  font-size: 20px;
  font-weight: 500;
  color: ${(props) => props.theme.color.overview};
  margin-bottom: 20px;
`;
export const Content = styled.Text`
  font-size: 20px;
  font-weight: 500;
  color: ${(props) => props.theme.color.overview};
  line-height: 30px;
`;

export default function Review({
  navigation,
  route: {
    params: { review, from },
  },
}) {
  const isDark = useColorScheme() === "dark";

  const onEdit = () => {
    navigation.navigate("Reviewedit", { review, from });
  };

  useEffect(() => {
    navigation.setOptions({
      headerLeft: null,
      headerRight: () => {
        if (authService.currentUser) {
          return (
            <TouchableOpacity onPress={onEdit}>
              <AntDesign
                name="edit"
                size={24}
                color={isDark ? YELLOW_COLOR : GREEN_COLOR}
              />
            </TouchableOpacity>
          );
        }
      },
    });
  }, []);

  return (
    <Container>
      <SectionTitle>평점</SectionTitle>

      <Ratings>⭐️ {review.rating} / 10</Ratings>

      <SectionTitle>제목</SectionTitle>

      <Title>{review.title}</Title>

      <SectionTitle>내용</SectionTitle>

      <Content>{review.contents}</Content>
    </Container>
  );
}
