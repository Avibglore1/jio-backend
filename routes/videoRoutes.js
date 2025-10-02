import express from 'express'
const VideoRouter = express.Router();
import { getVideoStream, getAllVideos } from '../controllers/VideoController.js';


VideoRouter.get("/", getAllVideos);
VideoRouter.get("/watch", getVideoStream);
export default VideoRouter