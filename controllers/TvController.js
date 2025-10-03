import { tmdbApi, TMDB_ENDPOINT } from "../services/tmdb.services.js";

export const getActionTvShows = async (req, res) => {
  try {
    const { data } = await tmdbApi.get(TMDB_ENDPOINT.fetchActionTvShows);
    data.results.forEach((item) => (item.media_type = "tv"));
    res.status(200).json({ status: "success", response: data });
  } catch (err) {
    res.status(500).json({ message: err.message, status: "failure" });
  }
};

export const getComedyTvShows = async (req, res) => {
  try {
    const { data } = await tmdbApi.get(TMDB_ENDPOINT.fetchComedyTvShows);
    data.results.forEach((item) => (item.media_type = "tv"));
    res.status(200).json({ status: "success", response: data });
  } catch (err) {
    res.status(500).json({ message: err.message, status: "failure" });
  }
};

export const getMysteryTvShows = async (req, res) => {
  try {
    const { data } = await tmdbApi.get(TMDB_ENDPOINT.fetchMysteryTvShows);
    data.results.forEach((item) => (item.media_type = "tv"));
    res.status(200).json({ status: "success", response: data });
  } catch (err) {
    res.status(500).json({ message: err.message, status: "failure" });
  }
};

export const getDramaTvShows = async (req, res) => {
  try {
    const { data } = await tmdbApi.get(TMDB_ENDPOINT.fetchDramaTvShows);
    data.results.forEach((item) => (item.media_type = "tv"));
    res.status(200).json({ status: "success", response: data });
  } catch (err) {
    res.status(500).json({ message: err.message, status: "failure" });
  }
};

export const getCrimeTvShows = async (req, res) => {
  try {
    const { data } = await tmdbApi.get(TMDB_ENDPOINT.fetchCrimeTvShows);
    data.results.forEach((item) => (item.media_type = "tv"));
    res.status(200).json({ status: "success", response: data });
  } catch (err) {
    res.status(500).json({ message: err.message, status: "failure" });
  }
};

export const getTvShowDetails = async (req, res) => {
  try {
    const { id } = req.query;
    if (!id) throw new Error("Video Id is not defined");

    const { data } = await tmdbApi.get(TMDB_ENDPOINT.fetchTvShowVideos(id));
    res.status(200).json({ status: "success", response: data });
  } catch (err) {
    console.log("err", err);
    res.status(500).json({ message: err.message, status: "failure" });
  }
};
