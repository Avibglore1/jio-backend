import express from "express";
import {
    getActionTvShows,
    getComedyTvShows,
    getCrimeTvShows,
    getDramaTvShows,
    getMysteryTvShows,
    getTvShowDetails,
} from "../controllers/TvController.js";

export const TvShowsRouter = express.Router();
TvShowsRouter.get("/action", getActionTvShows);
TvShowsRouter.get("/comedy", getComedyTvShows);
TvShowsRouter.get("/crime", getCrimeTvShows);
TvShowsRouter.get("/drama", getDramaTvShows);
TvShowsRouter.get("/mystery", getMysteryTvShows);
TvShowsRouter.get("/details", getTvShowDetails);

