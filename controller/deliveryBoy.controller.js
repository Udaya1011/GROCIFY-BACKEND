import DeliveryBoy from "../models/deliveryBoy.model.js";
import Order from "../models/order.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Login Delivery Boy: /api/delivery/login
export const loginDeliveryBoy = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Please fill all fields" });
        }

        const deliveryBoy = await DeliveryBoy.findOne({ email });
        if (!deliveryBoy) {
            return res.status(400).json({ success: false, message: "Delivery Boy not found" });
        }

        const isMatch = await bcrypt.compare(password, deliveryBoy.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: deliveryBoy._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.cookie("deliveryToken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "Strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(200).json({
            success: true,
            message: "Logged in successfully",
            deliveryBoy: {
                name: deliveryBoy.name,
                email: deliveryBoy.email,
                phone: deliveryBoy.phone,
            },
        });
    } catch (error) {
        console.error("Error in loginDeliveryBoy:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// Get Assigned Orders: /api/delivery/orders
export const getAssignedOrders = async (req, res) => {
    try {
        const deliveryBoyId = req.deliveryBoy;
        const orders = await Order.find({ deliveryBoyId })
            .populate("items.product address userId")
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, orders });
    } catch (error) {
        console.error("Error in getAssignedOrders:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// Update Order Status: /api/delivery/status
export const updateOrderStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;
        const validStatuses = ["Picked Up", "On the Way", "Delivered"];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({ success: false, message: "Invalid status update" });
        }

        const order = await Order.findByIdAndUpdate(orderId, { status }, { new: true });
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        res.status(200).json({ success: true, message: `Status updated to ${status}` });
    } catch (error) {
        console.error("Error in updateOrderStatus:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// Check Auth: /api/delivery/is-auth
export const checkAuth = async (req, res) => {
    try {
        const deliveryBoy = await DeliveryBoy.findById(req.deliveryBoy).select("-password");
        res.status(200).json({ success: true, deliveryBoy });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// Logout: /api/delivery/logout
export const logoutDeliveryBoy = async (req, res) => {
    try {
        res.clearCookie("deliveryToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "Strict",
        });
        res.status(200).json({ success: true, message: "Logged out successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error" });
    }
};
// Update Profile: /api/delivery/profile
export const updateProfile = async (req, res) => {
    try {
        const { name, phone } = req.body;
        const deliveryBoy = await DeliveryBoy.findByIdAndUpdate(
            req.deliveryBoy,
            { name, phone },
            { new: true }
        ).select("-password");

        if (!deliveryBoy) {
            return res.status(404).json({ success: false, message: "Delivery Boy not found" });
        }

        res.status(200).json({ success: true, message: "Profile updated", deliveryBoy });
    } catch (error) {
        console.error("Error in updateProfile:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};
