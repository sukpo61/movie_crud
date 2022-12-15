import { useEffect, useState } from "react";
import { RefreshControl, useColorScheme } from "react-native";
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

const HViews = styled.ScrollView`
  padding-top: 15px;
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
    console.log("getData");
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
    <Container
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
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
      <View>
        <ListTitle>Top Rated Movies</ListTitle>
        <HViews
          contentContainerStyle={{ paddingHorizontal: 20 }}
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          {topRatedMovies.map((movie) => (
            <VCard key={movie.id} movie={movie} />
          ))}
        </HViews>
      </View>
      <View>
        <ListTitle>Upcoming Movies</ListTitle>
        <View style={{ padding: 20 }}>
          {upcomingMovies.map((movie) => (
            <HCard key={movie.id} movie={movie} />
          ))}
        </View>
      </View>
    </Container>
  );
}
