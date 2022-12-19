import { useEffect, useState } from "react";
import { FlatList, RefreshControl, useColorScheme } from "react-native";
import styled from "@emotion/native";
import Swiper from "react-native-swiper";
import { SCREEN_HEIGHT } from "../utils";
import Loader from "../components/Loader";
import Slide from "../components/Slide";
import VCard from "../components/VCard";
import HCard from "../components/HCard";
import { useInfiniteQuery, useQuery, useQueryClient } from "react-query";
import { getNowPlaying, getTopRated, getUpcoming } from "../api";
// import { onAuthStateChanged } from "firebase/auth";
import { authService } from "../firebase";

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
  const {
    data: topRatedMovies,
    isLoading: isLoadingTopRated,
    hasNextPage: hasNextTopRatedPage,
    fetchNextPage: fetchNextTopRated,
  } = useInfiniteQuery(["movie", "topRated"], getTopRated, {
    getNextPageParam: (lastPage) => {
      const nextPage = lastPage.page + 1;
      if (nextPage < lastPage.total_pages) {
        return nextPage;
      }
    },
  });
  const {
    data: upcomingMovies,
    isLoading: isLoadingUpcoming,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery(["movie", "upComing"], getUpcoming, {
    getNextPageParam: (lastPage) => {
      const nextPage = lastPage.page + 1;
      if (nextPage < lastPage.total_pages) {
        return nextPage;
      }
    },
  });

  const isLoading =
    isLoadingNowPlaying || isLoadingTopRated || isLoadingUpcoming;

  const onRefresh = async () => {
    setRefreshing(true);
    await queryClinet.refetchQueries(["movie"]);
    setRefreshing(false);
  };

  const loadMore = async () => {
    if (hasNextPage) {
      await fetchNextPage();
    }
  };

  const loadMoreTopRated = async () => {
    if (hasNextTopRatedPage) {
      await fetchNextTopRated();
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <FlatList
      onEndReached={loadMore}
      // onEndReachedThreshold={1}
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
            onEndReached={loadMoreTopRated}
            horizontal
            ItemSeparatorComponent={HSeperator}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 20,
              paddingTop: 15,
              marginBottom: 30,
            }}
            data={topRatedMovies.pages.map((page) => page.results).flat()}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <VCard movie={item} />}
          />
          <ListTitle>Upcoming Movies</ListTitle>
        </View>
      }
      data={upcomingMovies.pages.map((page) => page.results).flat()}
      keyExtractor={(item) => item.id}
      ItemSeparatorComponent={VSeperator}
      renderItem={({ item }) => <HCard movie={item} />}
    />
  );
}
