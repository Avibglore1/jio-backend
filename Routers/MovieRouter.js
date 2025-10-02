import express from "express";
import {
    getActionMovies,
    getComedyMovies,
    getHorrorMovies,
    getMovieDetails,
    getRomanceMovies,
    getAnimeMovies,
} from "../controllers/movieController.js";

export const MovieRouter = express.Router();

MovieRouter.get("/action", getActionMovies);
MovieRouter.get("/comedy", getComedyMovies);
MovieRouter.get("/horror", getHorrorMovies);
MovieRouter.get("/romance", getRomanceMovies);
MovieRouter.get("/anime", getAnimeMovies);
MovieRouter.get("/details", getMovieDetails);

