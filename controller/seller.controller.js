import Seller from "../models/seller.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// register seller: /api/seller/register
export const registerSeller = async (req, res) => {
    try {
        const { name, email, password, shopName, phone } = req.body;

        if (!name || !email || !password || !shopName || !phone) {
            return res.status(400).json({
                message: "Please fill all the fields",
                success: false
            });
        }

        const existingSeller = await Seller.findOne({ email });
        if (existingSeller) {
            return res.status(400).json({
                message: "Seller already exists with this email",
                success: false
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const seller = new Seller({
            name,
            email,
            password: hashedPassword,
            shopName,
            phone,
            status: "pending", // Requires admin approval
        });

        await seller.save();

        res.status(201).json({
            message: "Registration successful! Please wait for admin approval.",
            success: true,
        });
    } catch (error) {
        console.error("Error in registerSeller:", error);
        res.status(500).json({ message: "Internal server error", success: false });
    }
};

// login seller: /api/seller/login
export const loginSeller = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Please fill all the fields",
                success: false
            });
        }

        const seller = await Seller.findOne({ email });
        if (!seller) {
            return res.status(400).json({
                message: "Seller does not exist",
                success: false
            });
        }

        if (seller.status === "blocked") {
            return res.status(403).json({
                message: "Your account has been blocked. Please contact admin.",
                success: false
            });
        }

        if (seller.status === "pending") {
            return res.status(403).json({
                message: "Your account is pending approval. Please wait for admin approval.",
                success: false
            });
        }

        const isMatch = await bcrypt.compare(password, seller.password);
        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid credentials",
                success: false
            });
        }

        const token = jwt.sign({ id: seller._id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });

        res.cookie("sellerToken", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "Strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(200).json({
            message: "Logged in successfully",
            success: true,
            seller: {
                name: seller.name,
                email: seller.email,
                shopName: seller.shopName,
            },
        });
    } catch (error) {
        console.error("Error in loginSeller:", error);
        res.status(500).json({ message: "Internal server error", success: false });
    }
};

// check seller auth: /api/seller/is-auth
export const checkAuth = async (req, res) => {
    try {
        const sellerId = req.seller;
        const seller = await Seller.findById(sellerId).select("-password");

        if (!seller) {
            return res.status(404).json({
                message: "Seller not found",
                success: false
            });
        }

        res.status(200).json({
            success: true,
            seller,
        });
    } catch (error) {
        console.error("Error in checkAuth:", error);
        res.status(500).json({ message: "Internal server error", success: false });
    }
};

// logout seller: /api/seller/logout
export const logoutSeller = async (req, res) => {
    try {
        res.clearCookie("sellerToken", {
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
        res.status(500).json({ message: "Internal server error", success: false });
    }
};

// get seller profile: /api/seller/profile
export const getProfile = async (req, res) => {
    try {
        const sellerId = req.seller;
        const seller = await Seller.findById(sellerId).select("-password");

        if (!seller) {
            return res.status(404).json({
                message: "Seller not found",
                success: false
            });
        }

        res.status(200).json({
            success: true,
            seller,
        });
    } catch (error) {
        console.error("Error in getProfile:", error);
        res.status(500).json({ message: "Internal server error", success: false });
    }
};

// update seller profile: /api/seller/profile
export const updateProfile = async (req, res) => {
    try {
        const sellerId = req.seller;
        const { name, shopName, phone } = req.body;

        const seller = await Seller.findById(sellerId);
        if (!seller) {
            return res.status(404).json({
                message: "Seller not found",
                success: false
            });
        }

        if (name) seller.name = name;
        if (shopName) seller.shopName = shopName;
        if (phone) seller.phone = phone;

        await seller.save();

        res.status(200).json({
            message: "Profile updated successfully",
            success: true,
            seller: {
                name: seller.name,
                email: seller.email,
                shopName: seller.shopName,
                phone: seller.phone,
            },
        });
    } catch (error) {
        console.error("Error in updateProfile:", error);
        res.status(500).json({ message: "Internal server error", success: false });
    }
};
