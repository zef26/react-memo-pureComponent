import { useHttp } from "../hooks/http.hook";


const useMarvelService = () => {
  const { loading, request, error, clearError } = useHttp();

  // Определяем API-базу
  const isLocalhost = window.location.hostname === "localhost";
  const _apiBase = isLocalhost
    ? "" // Пусть CRA proxy из package.json перехватывает
    : "https://marvel-server-zeta.vercel.app";

  const _apiKey = "apikey=d4eecb0c66dedbfae4eab45d312fc1df";
  const _baseOffset = 0;

  const getAllCharacters = async (offset = _baseOffset) => {
    const res = await request(
      `${_apiBase}/characters?limit=9&offset=&${_apiKey}`
    );
    return res.data.results.map(_transformCharacter);
  };

  const getCharacter = async (id) => {
    const res = await request(`${_apiBase}/characters/${id}?${_apiKey}`);
    return _transformCharacter(res.data.results[0]);
  };

  const getAllComics = async (offset = 0) => {
    const res = await request(
      `${_apiBase}/comics?orderBy=issueNumber&limit=8&offset=${offset}&${_apiKey}`
    );
    return res.data.results.map(_transformComics);
  };

  const getComic = async (id) => {
    const res = await request(`${_apiBase}/comics/${id}?${_apiKey}`);
    return _transformComics(res.data.results[0]);
  };

  const _transformCharacter = (char) => ({
    id: char.id,
    name: char.name,
    description: char.description
      ? `${char.description.slice(0, 210)}...`
      : "There is no description for this character",
    thumbnail: char.thumbnail.path + "." + char.thumbnail.extension,
    homepage: char.urls[0].url,
    wiki: char.urls[1].url,
    comics: char.comics.items,
  });

  const _transformComics = (comics) => ({
    id: comics.id,
    title: comics.title,
    description: comics.description || "There is no description",
    pageCount: comics.pageCount
      ? `${comics.pageCount} p.`
      : "No information about the number of pages",
    thumbnail: comics.thumbnail.path + "." + comics.thumbnail.extension,
    language: comics.textObjects[0]?.language || "en-us",
    price: comics.prices[0].price
      ? `${comics.prices[0].price}$`
      : "not available",
  });

  return {
    loading,
    error,
    clearError,
    getAllCharacters,
    getCharacter,
    getAllComics,
    getComic,
  };
};

export default useMarvelService;
