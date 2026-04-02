import express from "express";
import { getCoupons, getAllCoupons, createCoupon, updateCoupon, deleteCoupon } from "../controller/coupon.controller.js";
import authUser from "../middlewares/authUser.js";
import { authAdmin } from "../middlewares/authAdmin.js";

const couponRouter = express.Router();

couponRouter.get("/list", getCoupons); // Public/User (still needs authUser if implemented that way)
couponRouter.get("/all", authAdmin, getAllCoupons);
couponRouter.post("/create", authAdmin, createCoupon);
couponRouter.post("/update", authAdmin, updateCoupon);
couponRouter.post("/delete", authAdmin, deleteCoupon);

export default couponRouter;
