import jwt from "jsonwebtoken";

const authDeliveryBoy = async (req, res, next) => {
    const { deliveryToken } = req.cookies;
    if (!deliveryToken) {
        return res.status(401).json({ message: "Unauthorized", success: false });
    }
    try {
        const decoded = jwt.verify(deliveryToken, process.env.JWT_SECRET);
        req.deliveryBoy = decoded.id;
        next();
    } catch (error) {
        console.error("Error in authDeliveryBoy middleware:", error);
        return res.status(401).json({ message: "Invalid token", success: false });
    }
};

export default authDeliveryBoy;
