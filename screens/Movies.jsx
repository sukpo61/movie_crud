import { useEffect, useState } from "react";
import { useColorScheme } from "react-native";
import styled from "@emotion/native";
import Swiper from "react-native-swiper";
import { getImgPath, SCREEN_HEIGHT } from "../utils";
import Loader from "../components/Loader";
import Slide from "../components/Slide";
import Vote from "../components/Vote";
import { DARK_COLOR } from "../colors";

const Container = styled.ScrollView``;

const View = styled.View`
  margin-bottom: 15px;
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

const Poster = styled.Image`
  width: 120px;
  height: 170px;
  background-color: grey;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
`;
const Title = styled.Text`
  font-size: 13px;
  font-weight: 600;
  color: ${(props) => props.theme.color.titleOnImg};
`;

const VWrapper = styled.View`
  margin-right: 10px;
  background-color: ${DARK_COLOR};
  border-radius: 5px;
`;

const Column = styled.View`
  padding: 10px;
`;

const API_KEY = "558a876e694085f8a052d267914acde2";

export default function Movies() {
  const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const isDark = useColorScheme() === "dark";

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

  const getData = async () => {
    await Promise.all(getNowPlaying(), getTopRated());
    setIsLoading(false);
  };

  useEffect(() => {
    getData();
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Container>
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
            <VWrapper key={movie.id}>
              <Poster source={{ uri: getImgPath(movie.poster_path) }} />
              <Column>
                <Vote vote_average={movie.vote_average} />
                <Title>
                  {movie.title.slice(0, 11)}
                  {movie.title.length > 11 && "..."}
                </Title>
              </Column>
            </VWrapper>
          ))}
        </HViews>
      </View>
    </Container>
  );
}

<div>
  <div>
    <span></span>
  </div>
</div>;
