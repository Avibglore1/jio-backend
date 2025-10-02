import mongoose from "mongoose";
import express from "express";
const app = express();
import dotenv from "dotenv"
import cookieParser from "cookie-parser";
import cors from 'cors';
app.use(cors());




dotenv.config();
/***********db connection************* */
const dbLink = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}
@cluster0.lvlbp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.connect(dbLink).then(function(connection){
    console.log('connected to db')
}).catch(err =>console.log(err))

/*********************************** */

app.use(express.json());
app.use(cookieParser());

import {AuthRouter} from "./Routers/AuthRouter.js";
import {MovieRouter} from "./Routers/MovieRouter.js";
import {TvShowsRouter} from "./Routers/TvRouter.js";
import {DiscoverRouter} from "./Routers/DiscoverRouter.js";
import {UserRouter} from "./Routers/UserRouter.js";
import {VideoRouter} from "./Routers/VideoRouter.js";
import {PaymentRouter} from "./Routers/PaymentRouter.js";

app.use("/api/auth", AuthRouter);
app.use("/api/movies", MovieRouter);
app.use("/api/tv", TvShowsRouter);
app.use("/api/discover", DiscoverRouter);
app.use("/api/user", UserRouter);
app.use("/api/video", VideoRouter);
app.use("/api/payment", PaymentRouter);

app.listen(3001, function(){
    console.log('Server started on port 3001');
})