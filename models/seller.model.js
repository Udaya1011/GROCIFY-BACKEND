import mongoose from "mongoose";

const sellerSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        shopName: {
            type: String,
            required: true,
        },
        phone: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ["pending", "approved", "blocked"],
            default: "pending",
        },
    },
    { timestamps: true }
);

const Seller = mongoose.model("Seller", sellerSchema);
export default Seller;
