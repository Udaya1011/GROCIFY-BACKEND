import Notification from "../models/notification.model.js";

// Get user notifications
export const getNotifications = async (req, res) => {
    try {
        const { userId } = req.body;
        const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });
        res.json({ success: true, notifications });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Mark notification as read
export const markAsRead = async (req, res) => {
    try {
        const { notificationId } = req.body;
        await Notification.findByIdAndUpdate(notificationId, { read: true });
        res.json({ success: true, message: "Marked as read" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};
