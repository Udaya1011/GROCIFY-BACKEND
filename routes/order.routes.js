import express from "express";
import authUser from "../middlewares/authUser.js";
import {
  placeOrderCOD,
  placeOrderStripe,
  verifyStripe,
  getUserOrders,
  getAllOrders,
  placeOrderMock,
  rateOrder,
  seedUserOrder,
  updateStatus,
  getSalesStats
} from "../controller/order.controller.js";
import { authAdmin } from "../middlewares/authAdmin.js";

const router = express.Router();
router.post("/cod", authUser, placeOrderCOD);
router.post("/stripe", authUser, placeOrderStripe);
router.post("/verifyStripe", authUser, verifyStripe);
router.post("/mock", authUser, placeOrderMock);
router.post("/seed", authUser, seedUserOrder);
router.post("/rate", authUser, rateOrder);
router.get("/user", authUser, getUserOrders);
router.get("/admin", authAdmin, getAllOrders);
router.post("/status", authAdmin, updateStatus);
router.get("/analytics", authAdmin, getSalesStats);

export default router;
