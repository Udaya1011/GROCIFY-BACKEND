import mongoose from "mongoose";

const reminderSchema = new mongoose.Schema({
    userId: {
        type: String, // Clerk or similar ID usually string, but if ObjectId use mongoose.Schema.Types.ObjectId
        required: true,
        ref: "User",
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Product",
    },
    frequency: {
        type: String,
        enum: ["Daily", "Weekly", "Monthly"],
        required: true,
    },
    lastReminded: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });

const Reminder = mongoose.model("Reminder", reminderSchema);
export default Reminder;
