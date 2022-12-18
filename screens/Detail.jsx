import React, { useEffect, useState } from "react";
import {
  FlatList,
  Linking,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import styled from "@emotion/native";
import { getImgPath, SCREEN_WIDTH } from "../utils";
import { SCREEN_HEIGHT } from "../utils";
import { LinearGradient } from "expo-linear-gradient";
import { AntDesign } from "@expo/vector-icons";
import { useQuery } from "react-query";
import { getDetail } from "../api";
import Loader from "../components/Loader";
import Vote from "../components/Vote";
import { Rating } from "react-native-ratings";
import {
  addDoc,
  collection,
  getDocs,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { dbService } from "../firebase";
import ReviewCard from "../components/ReviewCard";

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

const SectionTitle = styled.Text`
  color: ${(props) => props.theme.color.listTitle};
  font-size: 30px;
  margin-top: 20px;
  margin-left: 20px;
  margin-bottom: 20px;
`;
const AddReview = styled.TouchableOpacity`
  margin-left: 20px;
  margin-right: 20px;
  padding: 10px;
  margin-bottom: 20px;
  border-radius: 5px;
  border-width: 1px;
  align-items: center;
  border-color: ${(props) => props.theme.color.title};
`;
const TempText = styled.Text`
  font-size: 20px;
  color: ${(props) => props.theme.color.title};
`;
const Backdrop = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;
const Dialog = styled.KeyboardAvoidingView`
  background-color: ${(props) => props.theme.color.modalBg};
  width: 80%;
  height: 70%;
  padding: 20px;
  justify-content: space-between;
  border-radius: 5px;
`;
const ModalTitle = styled.Text`
  font-size: 20px;
  font-weight: 600;
  color: black;
  margin-bottom: 10px;
  margin-top: 10px;
`;
const TitleInput = styled.TextInput`
  padding: 10px;
  background-color: white;
  border-radius: 5px;
`;
const ContentInput = styled(TitleInput)`
  height: 300px;
`;
const ModalBtn = styled.Button``;
const InputWrapper = styled.View``;
const AddButton = styled.Button``;
const HSeprator = styled.View`
  width: 10px;
`;

export default function Detail({
  route: {
    params: { movie },
  },
}) {
  const [reviews, setReviews] = useState([]);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalContent, setModalContent] = useState("");
  const [ratings, setRatings] = useState(0);
  const isDark = useColorScheme() === "dark";
  const openYoutube = async (key) => {
    const url = `https://www.youtube.com/watch?v=${key}`;
    await Linking.openURL(url);
  };

  const { data, isLoading } = useQuery(["movie", movie.id], getDetail);

  const addReview = async () => {
    await addDoc(collection(dbService, "reviews"), {
      title: modalTitle,
      contents: modalContent,
      createdAt: Date.now(),
      rating: ratings,
      userId: "user1",
      movieId: movie.id,
    });
    setIsOpenModal(false);
    setModalTitle("");
    setModalContent("");
    setRatings(0);
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

  const getRatings = (rating) => {
    setRatings(rating);
  };

  useEffect(() => {
    const q = query(
      collection(dbService, "reviews"),
      orderBy("createdAt", "desc")
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
      <AddReview onPress={() => setIsOpenModal(true)}>
        <TempText>Add Review</TempText>
      </AddReview>
      <FlatList
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, marginBottom: 50 }}
        keyExtractor={(item) => item.id}
        horizontal
        data={reviews}
        ItemSeparatorComponent={HSeprator}
        renderItem={({ item }) => <ReviewCard review={item} />}
      />
      <Modal visible={isOpenModal} transparent animationType="slide">
        <Backdrop>
          <Dialog>
            <InputWrapper>
              <ModalTitle>평가</ModalTitle>
              <Rating
                startingValue={0}
                style={{
                  alignItems: "flex-start",
                }}
                onFinishRating={getRatings}
                ratingCount={10}
                imageSize={20}
                tintColor="#d2dae2"
              />
              <ModalTitle>제목</ModalTitle>
              <TitleInput
                value={modalTitle}
                onChangeText={(text) => setModalTitle(text)}
              />
              <ModalTitle>내용</ModalTitle>
              <ContentInput
                value={modalContent}
                onChangeText={(text) => setModalContent(text)}
                multiline
                maxLength={300}
              />
            </InputWrapper>
            <Row style={{ justifyContent: "space-between" }}>
              <ModalBtn onPress={() => setIsOpenModal(false)} title="Cancel" />
              <ModalBtn
                disabled={!ratings || !modalTitle || !modalContent}
                onPress={addReview}
                title="Add Review"
              />
            </Row>
          </Dialog>
        </Backdrop>
      </Modal>
    </Container>
  );
}
