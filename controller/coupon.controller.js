import Coupon from "../models/coupon.model.js";

// Get active coupons (for users)
export const getCoupons = async (req, res) => {
    try {
        const coupons = await Coupon.find({ isActive: true, expiryDate: { $gt: new Date() } });
        res.json({ success: true, coupons });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Get all coupons (for admin)
export const getAllCoupons = async (req, res) => {
    try {
        const coupons = await Coupon.find({}).sort({ expiryDate: -1 });
        res.json({ success: true, coupons });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Create coupon
export const createCoupon = async (req, res) => {
    try {
        const { code, description, discountType, discountValue, minAmount, expiryDate } = req.body;
        const coupon = new Coupon({ code, description, discountType, discountValue, minAmount, expiryDate });
        await coupon.save();
        res.json({ success: true, message: "Coupon created successfully", coupon });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Update coupon
export const updateCoupon = async (req, res) => {
    try {
        const { id, ...updateData } = req.body;
        const coupon = await Coupon.findByIdAndUpdate(id, updateData, { new: true });
        res.json({ success: true, message: "Coupon updated successfully", coupon });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Delete coupon
export const deleteCoupon = async (req, res) => {
    try {
        const { id } = req.body;
        await Coupon.findByIdAndDelete(id);
        res.json({ success: true, message: "Coupon deleted successfully" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};
