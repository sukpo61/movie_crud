import React, { useEffect, useState } from "react";
import { Linking, StyleSheet, useColorScheme } from "react-native";
import styled from "@emotion/native";
import { getImgPath, SCREEN_WIDTH } from "../utils";
import { SCREEN_HEIGHT } from "../utils";
import { LinearGradient } from "expo-linear-gradient";
import { AntDesign } from "@expo/vector-icons";
import { useQuery } from "react-query";
import { getDetail } from "../api";
import Loader from "../components/Loader";
import Vote from "../components/Vote";
import {
  addDoc,
  collection,
  getDocs,
  onSnapshot,
  query,
} from "firebase/firestore";
import { dbService } from "../firebase";

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
const Reviews = styled.ScrollView``;
const Column = styled.View`
  justify-content: space-between;
  border-width: 1px;
  border-color: ${(props) => props.theme.color.title};
  width: ${SCREEN_WIDTH / 2.5 + "px"};
  border-radius: 10px;
  padding: 10px;
  height: 250px;
`;
const AbovePart = styled.View``;
const ReviewDate = styled.Text`
  color: ${(props) => props.theme.color.title};
  margin-bottom: 10px;
`;
const ReviewTitle = styled.Text`
  color: ${(props) => props.theme.color.title};
  margin-bottom: 10px;
`;
const ReviewContents = styled.Text`
  color: ${(props) => props.theme.color.overview};
`;
const SectionTitle = styled.Text`
  color: ${(props) => props.theme.color.listTitle};
  font-size: 30px;
  margin-top: 20px;
  margin-left: 20px;
  margin-bottom: 20px;
`;
const AddReview = styled.TouchableOpacity``;
const TempText = styled.Text`
  color: ${(props) => props.theme.color.title};
`;
export default function Detail({
  route: {
    params: { movie },
  },
}) {
  const [reviews, setReviews] = useState([]);
  const isDark = useColorScheme() === "dark";
  const openYoutube = async (key) => {
    const url = `https://www.youtube.com/watch?v=${key}`;
    await Linking.openURL(url);
  };

  const { data, isLoading } = useQuery(["movie", movie.id], getDetail);

  const addReview = async () => {
    await addDoc(collection(dbService, "reviews"), {
      title: "리뷰제목",
      contents: "리뷰내용",
      createdAt: Date.now(),
      rating: 8.5,
      userId: "user1",
      movieId: movie.id,
    });
  };

  // useEffect(() => {
  //   const getReviews = async () => {
  //     const q = query(
  //       collection(dbService, "reviews")
  //       // orderBy("createdAt", "desc")
  //     );
  //     const querySnapshot = await getDocs(q);
  //     console.log("querySnapshot:", querySnapshot);
  //   };
  //   getReviews();
  // }, []);

  useEffect(() => {
    const q = query(
      collection(dbService, "reviews")
      // orderBy("createdAt", "desc")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newReviews = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setReviews(newReviews);
    });
    return () => unsubscribe();
  }, []);

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
      <SectionTitle>Reviews</SectionTitle>
      <AddReview onPress={addReview}>
        <TempText>Add Review!</TempText>
      </AddReview>
      <Reviews
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 50 }}
      >
        {reviews.map((review) => {
          if (review.movieId === movie.id) {
            return (
              <Column key={review.id}>
                <AbovePart>
                  <ReviewDate>
                    {new Date(review.createdAt).toLocaleDateString("kr")}
                  </ReviewDate>
                  <ReviewTitle>{review.title}</ReviewTitle>
                  <ReviewContents>{review.contents}</ReviewContents>
                </AbovePart>
                <Vote vote_average={8.3} />
              </Column>
            );
          }
        })}
      </Reviews>
    </Container>
  );
}
