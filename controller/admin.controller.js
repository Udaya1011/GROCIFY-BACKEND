import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import Seller from "../models/seller.model.js";
import DeliveryBoy from "../models/deliveryBoy.model.js";
import Order from "../models/order.model.js";
import bcrypt from "bcryptjs";

// admin login :/api/admin/login
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (
      password === process.env.ADMIN_PASSWORD &&
      email === process.env.ADMIN_EMAIL
    ) {
      const token = jwt.sign({ email }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
      res.cookie("adminToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "Strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      return res
        .status(200)
        .json({ message: "Login successful", success: true });
    } else {
      return res
        .status(400)
        .json({ message: "Invalid credentials", success: false });
    }
  } catch (error) {
    console.error("Error in adminLogin:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// check admin auth  : /api/admin/is-auth
export const checkAuth = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.error("Error in checkAuth:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// logout admin: /api/admin/logout
export const adminLogout = async (req, res) => {
  try {
    res.clearCookie("adminToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "Strict",
    });
    return res.status(200).json({
      message: "Logged out successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error in logout:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// get all users: /api/admin/users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    res.status(200).json({ success: true, users });
  } catch (error) {
    console.error("Error in getAllUsers:", error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

// get all sellers: /api/admin/sellers
export const getAllSellers = async (req, res) => {
  try {
    const sellers = await Seller.find({}).select("-password").sort({ createdAt: -1 });
    res.status(200).json({ success: true, sellers });
  } catch (error) {
    console.error("Error in getAllSellers:", error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

// approve seller: /api/admin/sellers/:id/approve
export const approveSeller = async (req, res) => {
  try {
    const { id } = req.params;
    const seller = await Seller.findById(id);

    if (!seller) {
      return res.status(404).json({ message: "Seller not found", success: false });
    }

    seller.status = "approved";
    await seller.save();

    res.status(200).json({
      message: "Seller approved successfully",
      success: true,
      seller
    });
  } catch (error) {
    console.error("Error in approveSeller:", error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

// block seller: /api/admin/sellers/:id/block
export const blockSeller = async (req, res) => {
  try {
    const { id } = req.params;
    const seller = await Seller.findById(id);

    if (!seller) {
      return res.status(404).json({ message: "Seller not found", success: false });
    }

    seller.status = "blocked";
    await seller.save();

    res.status(200).json({
      message: "Seller blocked successfully",
      success: true,
      seller
    });
  } catch (error) {
    console.error("Error in blockSeller:", error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

// Register Delivery Boy: /api/admin/delivery/register
export const registerDeliveryBoy = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password || !phone) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const existing = await DeliveryBoy.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: "Delivery Boy already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const deliveryBoy = new DeliveryBoy({
      name,
      email,
      password: hashedPassword,
      phone,
    });
    await deliveryBoy.save();

    res.status(201).json({ success: true, message: "Delivery Boy registered successfully" });
  } catch (error) {
    console.error("Error in registerDeliveryBoy:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Get All Delivery Boys: /api/admin/delivery/list
export const getAllDeliveryBoys = async (req, res) => {
  try {
    const deliveryBoys = await DeliveryBoy.find({}).select("-password");
    res.status(200).json({ success: true, deliveryBoys });
  } catch (error) {
    console.error("Error in getAllDeliveryBoys:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Assign Delivery Boy to Order: /api/admin/order/assign
export const assignOrder = async (req, res) => {
  try {
    const { orderId, deliveryBoyId } = req.body;
    const order = await Order.findByIdAndUpdate(
      orderId,
      { deliveryBoyId, status: "Order Confirmed" },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.status(200).json({ success: true, message: "Order assigned successfully" });
  } catch (error) {
    console.error("Error in assignOrder:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
