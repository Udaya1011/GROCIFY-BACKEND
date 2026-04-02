import express from "express";
import { addToWishlist, removeFromWishlist, getWishlist } from "../controller/wishlist.controller.js";
import authUser from "../middlewares/authUser.js";

const wishlistRouter = express.Router();

wishlistRouter.post("/add", authUser, addToWishlist);
wishlistRouter.post("/remove", authUser, removeFromWishlist);
wishlistRouter.get("/get", authUser, getWishlist);

export default wishlistRouter;
