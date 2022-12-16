import { useEffect, useState } from "react";
import { FlatList, RefreshControl, useColorScheme } from "react-native";
import styled from "@emotion/native";
import Swiper from "react-native-swiper";
import { SCREEN_HEIGHT } from "../utils";
import Loader from "../components/Loader";
import Slide from "../components/Slide";
import VCard from "../components/VCard";
import HCard from "../components/HCard";
import { useQuery, useQueryClient } from "react-query";
import { getNowPlaying, getTopRated, getUpcoming } from "../api";

const Container = styled.ScrollView``;

const View = styled.View`
  margin-bottom: 30px;
`;

const ListTitle = styled.Text`
  margin-left: 20px;
  font-size: 20px;
  font-weight: 500;
  color: ${(props) => props.theme.color.listTitle};
`;

const HSeperator = styled.View`
  width: 15px;
`;
const VSeperator = styled.View`
  height: 15px;
`;

export default function Movies() {
  const [refreshing, setRefreshing] = useState(false);
  const queryClinet = useQueryClient();
  const { data: nowPlayingMovies, isLoading: isLoadingNowPlaying } = useQuery(
    ["movie", "nowPlaying"],
    getNowPlaying
  );
  const { data: topRatedMovies, isLoading: isLoadingTopRated } = useQuery(
    ["movie", "topRated"],
    getTopRated
  );
  const { data: upcomingMovies, isLoading: isLoadingUpcoming } = useQuery(
    ["movie", "upComing"],
    getUpcoming
  );

  const isLoading =
    isLoadingNowPlaying || isLoadingTopRated || isLoadingUpcoming;

  const onRefresh = async () => {
    setRefreshing(true);
    await queryClinet.refetchQueries(["movie"]);
    setRefreshing(false);
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <FlatList
      refreshing={refreshing}
      onRefresh={onRefresh}
      ListHeaderComponent={
        <View>
          <Swiper
            autoplay
            showsPagination={false}
            loop
            containerStyle={{
              width: "100%",
              height: SCREEN_HEIGHT / 3,
              marginBottom: 15,
            }}
          >
            {nowPlayingMovies.results.map((movie) => (
              <Slide key={movie.id} movie={movie} />
            ))}
          </Swiper>
          <ListTitle>Top Rated Movies</ListTitle>
          <FlatList
            horizontal
            ItemSeparatorComponent={HSeperator}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 20,
              paddingTop: 15,
              marginBottom: 30,
            }}
            data={topRatedMovies.results}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <VCard movie={item} />}
          />
          <ListTitle>Upcoming Movies</ListTitle>
        </View>
      }
      data={upcomingMovies.results}
      keyExtractor={(item) => item.id}
      ItemSeparatorComponent={VSeperator}
      renderItem={({ item }) => <HCard movie={item} />}
    />
  );
}
