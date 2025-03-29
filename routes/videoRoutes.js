import express from 'express'
const VideoRouter = express.Router();
import { getVideoStream, getAllVideos } from '../controllers/videocontroller.js';


VideoRouter.get("/", getAllVideos);
VideoRouter.get("/watch", getVideoStream);
export default VideoRouter