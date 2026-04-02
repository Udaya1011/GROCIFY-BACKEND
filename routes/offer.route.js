import express from "express";
import { getSmartOffers } from "../controller/offer.controller.js";
import authUser from "../middlewares/authUser.js";

const offerRouter = express.Router();

offerRouter.get("/smart", authUser, getSmartOffers);

export default offerRouter;
