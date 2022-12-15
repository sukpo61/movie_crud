import { useEffect, useState } from "react";
import { FlatList, RefreshControl, useColorScheme } from "react-native";
import styled from "@emotion/native";
import Swiper from "react-native-swiper";
import { SCREEN_HEIGHT } from "../utils";
import Loader from "../components/Loader";
import Slide from "../components/Slide";
import VCard from "../components/VCard";
import HCard from "../components/HCard";

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
const API_KEY = "558a876e694085f8a052d267914acde2";

export default function Movies() {
  const [refreshing, setRefreshing] = useState(false);
  const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const getNowPlaying = async () => {
    const baseUrl = "https://api.themoviedb.org/3/movie/now_playing";
    const { results } = await fetch(
      `${baseUrl}?api_key=${API_KEY}&page=1`
    ).then((res) => res.json());
    setNowPlayingMovies(results);
  };

  const getTopRated = async () => {
    const baseUrl = "https://api.themoviedb.org/3/movie/top_rated";
    const { results } = await fetch(
      `${baseUrl}?api_key=${API_KEY}&page=1`
    ).then((res) => res.json());
    setTopRatedMovies(results);
  };

  const getUpcoming = async () => {
    const baseUrl = "https://api.themoviedb.org/3/movie/upcoming";
    const { results } = await fetch(
      `${baseUrl}?api_key=${API_KEY}&page=1`
    ).then((res) => res.json());
    setUpcomingMovies(results);
  };

  const getData = async () => {
    await Promise.all([getNowPlaying(), getTopRated(), getUpcoming()]);
    setIsLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await getData();
    setRefreshing(false);
  };

  useEffect(() => {
    getData();
  }, []);

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
            {nowPlayingMovies.map((movie) => (
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
            data={topRatedMovies}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <VCard movie={item} />}
          />
          <ListTitle>Upcoming Movies</ListTitle>
        </View>
      }
      data={upcomingMovies}
      keyExtractor={(item) => item.id}
      ItemSeparatorComponent={VSeperator}
      renderItem={({ item }) => <HCard movie={item} />}
    />
  );
}
