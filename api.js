const BASE_URL = "https://api.themoviedb.org/3/movie";

const API_KEY = "558a876e694085f8a052d267914acde2";

export const getNowPlaying = () =>
  fetch(`${BASE_URL}/now_playing?api_key=${API_KEY}&page=1`).then((res) =>
    res.json()
  );

export const getTopRated = ({ pageParam }) =>
  fetch(`${BASE_URL}/top_rated?api_key=${API_KEY}&page=${pageParam}`).then(
    (res) => res.json()
  );

export const getUpcoming = ({ pageParam }) =>
  fetch(`${BASE_URL}/upcoming?api_key=${API_KEY}&page=${pageParam}`).then(
    (res) => res.json()
  );

export const getDetail = ({ queryKey }) => {
  const [_, movieId] = queryKey;
  return fetch(
    `${BASE_URL}/${movieId}?api_key=${API_KEY}&append_to_response=videos`
  ).then((res) => res.json());
};
