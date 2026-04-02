import mongoose from "mongoose";

const bundleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    items: [
        {
            productName: { type: String, required: true },
            quantity: { type: Number, required: true, default: 1 },
        },
    ],
});

const Bundle = mongoose.model("Bundle", bundleSchema);
export default Bundle;
