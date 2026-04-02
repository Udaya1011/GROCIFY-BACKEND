import express from "express";
import {
    registerSeller,
    loginSeller,
    checkAuth,
    logoutSeller,
    getProfile,
    updateProfile,
} from "../controller/seller.controller.js";
import {
    getDashboardStats,
    getSellerProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    getSellerOrders,
    updateOrderStatus,
} from "../controller/seller.product.controller.js";
import { authSeller } from "../middlewares/authSeller.js";

const router = express.Router();

// Authentication routes
router.post("/register", registerSeller);
router.post("/login", loginSeller);
router.get("/is-auth", authSeller, checkAuth);
router.get("/logout", authSeller, logoutSeller);

// Profile routes
router.get("/profile", authSeller, getProfile);
router.put("/profile", authSeller, updateProfile);

// Dashboard stats
router.get("/stats", authSeller, getDashboardStats);

// Product management routes
router.get("/products", authSeller, getSellerProducts);
router.post("/products/add", authSeller, addProduct);
router.put("/products/:id", authSeller, updateProduct);
router.delete("/products/:id", authSeller, deleteProduct);

// Order management routes
router.get("/orders", authSeller, getSellerOrders);
router.put("/orders/:id/status", authSeller, updateOrderStatus);

export default router;
