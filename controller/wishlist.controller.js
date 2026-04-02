import User from "../models/user.model.js";

// Add to wishlist
export const addToWishlist = async (req, res) => {
    try {
        const userId = req.user;
        const { productId } = req.body;
        const user = await User.findById(userId);
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        if (!user.wishlist.includes(productId)) {
            user.wishlist.push(productId);
            await user.save();
        }

        res.json({ success: true, message: "Added to wishlist" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Remove from wishlist
export const removeFromWishlist = async (req, res) => {
    try {
        const userId = req.user;
        const { productId } = req.body;
        const user = await User.findById(userId);
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        user.wishlist = user.wishlist.filter((id) => id !== productId);
        await user.save();

        res.json({ success: true, message: "Removed from wishlist" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Get user wishlist
export const getWishlist = async (req, res) => {
    try {
        const userId = req.user;
        const user = await User.findById(userId);
        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        res.json({ success: true, wishlist: user.wishlist });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};
