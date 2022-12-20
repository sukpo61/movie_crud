import { useState, useEffect, useCallback } from "react";
import { View, Text, useColorScheme, FlatList } from "react-native";
import styled from "@emotion/native";
import { authService, dbService } from "../firebase";
import {
  collection,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import Vote from "../components/Vote";
import { useFocusEffect } from "@react-navigation/native";

const Container = styled.ScrollView`
  padding: 20px;
`;

const ListTitle = styled.Text`
  font-size: 20px;
  font-weight: 500;
  color: ${(props) => props.theme.color.listTitle};
  margin-bottom: 20px;
`;
const ReviewWrapper = styled.TouchableOpacity`
  padding: 10px 15px;
  border-radius: 5px;
  border-width: 1px;
  border-color: ${(props) => props.theme.color.title};
`;
const Title = styled.Text`
  color: ${(props) => props.theme.color.title};
  font-size: 20px;
`;

const Contents = styled(Title)`
  margin: 10px 0;
  height: 50px;
`;

const Row = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
`;

const ReviewAt = styled.Text`
  font-size: 14px;
  color: ${(props) => props.theme.color.title};
`;
const VSeperator = styled.View`
  height: 10px;
`;

export default function My({ navigation: { navigate, reset } }) {
  const [reviews, setReviews] = useState([]);

  const goToReview = (theReview) => {
    navigate("Stack", {
      screen: "Review",
      params: { review: theReview, from: "My" },
    });
  };
  useFocusEffect(
    useCallback(() => {
      if (!authService.currentUser) {
        // 비로그인 상태
        // navigate("Stack", { screen: "Login" });
        reset({
          index: 1,
          routes: [
            {
              name: "Tabs",
              params: {
                screen: "Movies",
              },
            },
            {
              name: "Stack",
              params: {
                screen: "Login",
              },
            },
          ],
        });
        return;
      }

      const q = query(
        collection(dbService, "reviews"),
        orderBy("createdAt", "desc"),
        where("userId", "==", authService.currentUser?.uid)
      );
      const unsubcribe = onSnapshot(q, (snapshot) => {
        const newReviews = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setReviews(newReviews);
      });
      return unsubcribe;
    }, [])
  );

  return (
    <FlatList
      contentContainerStyle={{ padding: 20 }}
      data={reviews}
      ItemSeparatorComponent={VSeperator}
      ListHeaderComponent={<ListTitle>My Reviews</ListTitle>}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <ReviewWrapper onPress={() => goToReview(item)}>
          <Title>{item.title}</Title>
          <Contents numberOfLines={2}>{item.contents}</Contents>
          <Row>
            <Vote vote_average={item.rating} />
            <ReviewAt>
              {new Date(item.createdAt).toLocaleDateString("kr")}
            </ReviewAt>
          </Row>
        </ReviewWrapper>
      )}
    />
  );
}
