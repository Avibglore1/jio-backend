import { tmdbApi, TMDB_ENDPOINT } from "../services/tmdb.services.js";

export const getNowPlaying = async (req, res) => {
  try {
    const data = await tmdbApi.get(TMDB_ENDPOINT.fetchNowPlaying);
    res.status(200).json({ status: "success", response: data });
  } catch (err) {
    res.status(500).json({ status: "failure", message: err.message });
  }
};

export const getTrending = async (req, res) => {
  try {
    const data = await tmdbApi.get(TMDB_ENDPOINT.fetchTrending);
    res.status(200).json({ status: "success", response: data });
  } catch (err) {
    res.status(500).json({ status: "failure", message: err.message });
  }
};

export const getTopRated = async (req, res) => {
  try {
    const data = await tmdbApi.get(TMDB_ENDPOINT.fetchTopRated);
    res.status(200).json({ status: "success", response: data });
  } catch (err) {
    res.status(500).json({ status: "failure", message: err.message });
  }
};

export const getUpcoming = async (req, res) => {
  try {
    const data = await tmdbApi.get(TMDB_ENDPOINT.fetchUpcoming);
    res.status(200).json({ status: "success", response: data });
  } catch (err) {
    res.status(500).json({ status: "failure", message: err.message });
  }
};
