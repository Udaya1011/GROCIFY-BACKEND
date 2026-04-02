import Reminder from "../models/reminder.model.js";
import Product from "../models/product.model.js";

// Create a new reminder
export const createReminder = async (req, res) => {
    try {
        const userId = req.user;
        const { productId, frequency } = req.body;

        if (!productId || !frequency) {
            return res.status(400).json({ success: false, message: "Missing details" });
        }

        // Check if already exists
        const existing = await Reminder.findOne({ userId, productId });
        if (existing) {
            existing.frequency = frequency;
            await existing.save();
            return res.status(200).json({ success: true, message: "Reminder updated!" });
        }

        await Reminder.create({
            userId,
            productId,
            frequency
        });

        res.status(201).json({ success: true, message: `Set ${frequency} reminder!` });
    } catch (error) {
        console.error("Error creating reminder:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// Check for due reminders (Simulated logic)
export const checkReminders = async (req, res) => {
    try {
        const userId = req.user;
        const reminders = await Reminder.find({ userId }).populate('productId');

        const dueReminders = [];
        const now = new Date();

        // Simulation: Just return everything for demo purposes, 
        // or filter by real logic if we had real cron jobs.
        // For this "Check", we will say something is due if it exists.

        reminders.forEach(rem => {
            if (rem.productId) {
                dueReminders.push({
                    productName: rem.productId.name,
                    frequency: rem.frequency,
                    message: `${rem.productId.name} stock might be low! (${rem.frequency})`
                })
            }
        });

        res.status(200).json({ success: true, reminders: dueReminders });

    } catch (error) {
        console.error("Error checking reminders:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
}
