import mongoose from "mongoose";

const recipeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    image: { type: String, required: true }, // URL or filename
    description: { type: String, required: true },
    cookingTime: { type: String, required: true },
    ingredients: [
        {
            productName: { type: String, required: true }, // Name to match loosely with Product catalog
            quantity: { type: String, default: "1" }, // e.g., "500g", "1 packet" - just display text
        }
    ]
});

const Recipe = mongoose.model("Recipe", recipeSchema);
export default Recipe;
