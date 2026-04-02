import jwt from "jsonwebtoken";
import Seller from "../models/seller.model.js";

export const authSeller = async (req, res, next) => {
    const { sellerToken } = req.cookies;
    if (!sellerToken) {
        return res.status(401).json({ message: "Unauthorized", success: false });
    }
    try {
        const decoded = jwt.verify(sellerToken, process.env.JWT_SECRET);
        const seller = await Seller.findById(decoded.id).select("-password");

        if (!seller) {
            return res.status(401).json({ message: "Seller not found", success: false });
        }

        if (seller.status === "blocked") {
            return res.status(403).json({ message: "Your account has been blocked", success: false });
        }

        if (seller.status === "pending") {
            return res.status(403).json({ message: "Your account is pending approval", success: false });
        }

        req.seller = decoded.id;
        return next();
    } catch (error) {
        console.error("Error in authSeller middleware:", error);
        return res.status(401).json({ message: "Invalid token", success: false });
    }
};
