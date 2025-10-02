import express from "express";
export const VideoRouter = express.Router();
import {
    getVideoStream,
    getAllVideos,
} from "../controllers/VideoController.js";
/***********routes**************/

VideoRouter.get("/", getAllVideos);
VideoRouter.get("/watch", getVideoStream);
