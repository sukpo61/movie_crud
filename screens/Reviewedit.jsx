import { useState, useEffect } from "react";
import styled from "@emotion/native";
import { Rating } from "react-native-ratings";
import { TouchableOpacity, useColorScheme } from "react-native";
import { deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { dbService } from "../firebase";
import { GREEN_COLOR, YELLOW_COLOR } from "../colors";
import { AntDesign } from "@expo/vector-icons";
import { Alert } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useMutation } from "react-query";
import { deleteReview, editReview } from "../api";
import Loader from "../components/Loader";

const TitleEdit = styled.TextInput`
  width: 100%;
  background-color: white;
  margin-bottom: 20px;
  padding: 10px 15px;
`;
const ContentEdit = styled(TitleEdit)`
  min-height: 150px;
  margin-bottom: 50px;
`;

const Container = styled.ScrollView`
  padding: 20px;
`;

const SectionTitle = styled.Text`
  font-size: 30px;
  font-weight: 600;
  color: ${(props) => props.theme.color.title};
  margin-bottom: 15px;
`;

const EditButton = styled.TouchableOpacity`
  width: 100%;
  padding: 10px 15px;
  justify-content: center;
  align-items: center;
  background-color: ${(props) => props.theme.color.overview};
  border-width: 1px;
  border-color: ${(props) =>
    props.disabled ? "grey" : props.theme.color.title};
  border-radius: 10px;
  margin-bottom: 20px;
`;

const BtnTitle = styled.Text`
  color: ${(props) => (props.disabled ? "grey" : props.theme.color.title)};
  font-size: 20px;
  font-weight: 500;
`;

export default function Reviewedit({
  navigation,
  route: {
    params: { review, from },
  },
}) {
  const isDark = useColorScheme() === "dark";
  const [ratings, setRatings] = useState(0);
  const [newTitle, setNewTitle] = useState("");
  const [newContents, setNewContents] = useState("");

  const { isLoading: isLoadingDeleting, mutate: removeReview } = useMutation(
    ["deleteReview", review.id],
    (body) => deleteReview(body),
    {
      onSuccess: () => {
        console.log("삭제성공");
      },
      onError: (err) => {
        console.log("err in delete:", err);
      },
    }
  );

  const { isLoading: isLoadingEditing, mutate: reviseReview } = useMutation(
    ["editReview", review.id],
    (body) => editReview(body),
    {
      onSuccess: () => {
        console.log("수정성공");
      },
      onError: (err) => {
        console.log("err in edit:", err);
      },
    }
  );

  const onDelete = async () => {
    Alert.alert("리뷰 삭제", "정말 현재 리뷰를 삭제하시겠습니까?", [
      { text: "cancel", style: "destructive" },
      {
        text: "OK. Delete it.",
        onPress: async () => {
          try {
            // await deleteDoc(doc(dbService, "reviews", review.id));
            await removeReview(review.id);
            if (from === "Detail") {
              navigation.navigate("Detail", { movieId: review.movieId });
            } else if (from === "My") {
              navigation.navigate("Tabs", { screen: "My" });
            }
          } catch (err) {
            console.log("err:", err);
          }
        },
      },
    ]);
  };

  const onEditDone = () => {
    if (!ratings && !newTitle && !newContents) {
      // 입력값 3개 중 아무것도 입력없으면 그대로 원상복구
      alert("수정한 부분이 없습니다.");
      return;
    }

    // 입력값이 3개 중 하나라도 있으면 해당값만 patch할 수 있도록 객체 구성
    let editingObj = {};
    if (ratings) {
      Object.assign(editingObj, { rating: ratings });
    }
    if (newTitle) {
      Object.assign(editingObj, { title: newTitle });
    }
    if (newContents) {
      Object.assign(editingObj, { contents: newContents });
    }

    Alert.alert(
      "리뷰 수정",
      "이대로 리뷰 수정하시겠습니까? 입력한 부분만 수정됩니다.",
      [
        {
          text: "Cancel",
          style: "destructive",
        },
        {
          text: "OK. Edit it",
          onPress: async () => {
            try {
              // await updateDoc(doc(dbService, "reviews", review.id), editingObj);
              await reviseReview({ reviewId: review.id, editingObj });
              setNewContents("");
              setNewTitle("");
              setRatings(0);
              if (from === "Detail") {
                navigation.reset({
                  index: 1,
                  routes: [
                    {
                      name: "Detail",
                      params: { movieId: review.movieId },
                    },
                    {
                      name: "Review",
                      params: { review: { ...review, ...editingObj }, from },
                    },
                  ],
                });
              } else if (from === "My") {
                navigation.reset({
                  routes: [
                    {
                      name: "Tabs",
                      params: { screen: "My" },
                    },
                  ],
                });
              }
            } catch (err) {
              console.log("err:", err);
            }
          },
        },
      ]
    );
  };
  const getRatings = (rating) => {
    setRatings(rating);
  };

  const onChangeTitle = (text) => {
    setNewTitle(text);
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        return null;
      },
    });
  }, []);

  if (isLoadingDeleting || isLoadingEditing) {
    return <Loader />;
  }

  return (
    <Container>
      <EditButton
        disabled={!newContents && !newTitle && !ratings}
        onPress={onEditDone}
      >
        <BtnTitle disabled={!newContents && !newTitle && !ratings}>
          수정하기
        </BtnTitle>
      </EditButton>
      <EditButton onPress={onDelete}>
        <BtnTitle>삭제하기</BtnTitle>
      </EditButton>
      <SectionTitle>평점</SectionTitle>

      <Rating
        startingValue={review.rating}
        style={{
          alignItems: "flex-start",
          marginBottom: 20,
        }}
        onFinishRating={getRatings}
        ratingCount={10}
        imageSize={20}
        tintColor={isDark ? "black" : "#d2dae2"}
      />

      <SectionTitle>제목</SectionTitle>

      <TitleEdit
        value={newTitle}
        placeholderTextColor="#d2dae2"
        onChangeText={onChangeTitle}
        placeholder={review.title}
        maxLength={30}
      />

      <SectionTitle>내용</SectionTitle>

      <ContentEdit
        textAlignVertical="top"
        value={newContents}
        onChangeText={(text) => setNewContents(text)}
        multiline
        maxLength={300}
        placeholderTextColor="#d2dae2"
        placeholder={review.contents}
      />
    </Container>
  );
}
