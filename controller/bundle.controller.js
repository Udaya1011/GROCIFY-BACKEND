import Bundle from "../models/bundle.model.js";

// Get all bundles
export const getBundles = async (req, res) => {
    try {
        const bundles = await Bundle.find({});
        res.json({ success: true, bundles });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};
