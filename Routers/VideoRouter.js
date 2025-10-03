import express from "express";
export const VideoRouter = express.Router();
import {
    getVideoStream,
    getAllVideos,
} from "../controllers/videocontroller.js";
/***********routes**************/

VideoRouter.get("/", getAllVideos);
VideoRouter.get("/watch", getVideoStream);
