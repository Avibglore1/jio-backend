import express from "express";
import {
    getUpcoming,
    getTopRated,
    getTrending,
    getNowPlaying,
} from "../controllers/DiscoverController.js";

export const DiscoverRouter = express.Router();

DiscoverRouter.get("/now-playing", getNowPlaying);
DiscoverRouter.get("/trending", getTrending);
DiscoverRouter.get("/upcoming", getUpcoming);
DiscoverRouter.get("/top-rated", getTopRated);

