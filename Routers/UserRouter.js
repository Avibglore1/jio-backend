import express from "express";
export const UserRouter = express.Router();
import {
    getCurrentUser,
    getUserWishlist,
    addToWishlist
} from "./../controllers/UserController.js";
/***********routes**************/

UserRouter.get("/", getCurrentUser);
UserRouter.get("/getWishlist", getUserWishlist);
UserRouter.get("/addToWishlist", addToWishlist);
