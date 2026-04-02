import express from "express";
import {
    loginDeliveryBoy,
    getAssignedOrders,
    updateOrderStatus,
    checkAuth,
    logoutDeliveryBoy,
    updateProfile,
} from "../controller/deliveryBoy.controller.js";
import authDeliveryBoy from "../middlewares/authDeliveryBoy.js";

const router = express.Router();

router.post("/login", loginDeliveryBoy);
router.get("/is-auth", authDeliveryBoy, checkAuth);
router.get("/logout", authDeliveryBoy, logoutDeliveryBoy);
router.get("/orders", authDeliveryBoy, getAssignedOrders);
router.post("/status", authDeliveryBoy, updateOrderStatus);
router.post("/profile", authDeliveryBoy, updateProfile);

export default router;
