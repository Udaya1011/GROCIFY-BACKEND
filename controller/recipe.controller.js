import Recipe from "../models/recipe.model.js";

// Get all recipes
export const getRecipes = async (req, res) => {
    try {
        const recipes = await Recipe.find({});
        res.status(200).json({ success: true, recipes });
    } catch (error) {
        console.error("Error fetching recipes:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

// Seed Recipes (Admin/Dev helper)
export const seedRecipes = async (req, res) => {
    try {
        const sampleRecipes = [
            {
                name: "Sambar",
                image: "sambar.png",
                description: "Traditional South Indian lentil stew with vegetables.",
                cookingTime: "45 mins",
                ingredients: [
                    { productName: "Toor Dal" }, // Not in stock but kept for recipe completeness
                    { productName: "Tomato 1 kg" },
                    { productName: "Onion 500g" },
                    { productName: "Drumstick" }, // Not in stock
                ]
            },
            {
                name: "Pasta Arrabiata",
                image: "pasta_arrabiata.png",
                description: "Spicy Italian pasta with tomato sauce.",
                cookingTime: "30 mins",
                ingredients: [
                    { productName: "Pasta" },
                    { productName: "Tomato 1 kg" },
                    { productName: "Garlic (100g)" },
                    { productName: "Green Chilli (100g)" } // Substitute for chilli flakes
                ]
            },
            {
                name: "Veg Fried Rice",
                image: "veg_fried_rice.png",
                description: "Classic Indo-Chinese fried rice with veggies.",
                cookingTime: "20 mins",
                ingredients: [
                    { productName: "Basmati Rice 5kg" },
                    { productName: "Carrot 500g" },
                    { productName: "Cabbage (1 pc)" },
                    { productName: "Green Chilli (100g)" },
                    { productName: "Onion 500g" }
                ]
            },
            {
                name: "Veg Biryani",
                image: "veg_biryani.png",
                description: "Aromatic basmati rice cooked with mixed vegetables and spices.",
                cookingTime: "60 mins",
                ingredients: [
                    { productName: "Basmati Rice 5kg" },
                    { productName: "Carrot 500g" },
                    { productName: "Potato 500g" },
                    { productName: "Onion 500g" },
                    { productName: "Tomato 1 kg" },
                    { productName: "Ginger (200g)" },
                    { productName: "Garlic (100g)" },
                    { productName: "Green Chilli (100g)" }
                ]
            },
            {
                name: "Veg Grilled Sandwich",
                image: "veg_sandwich.png",
                description: "Crispy grilled sandwich loaded with fresh vegetables and cheese.",
                cookingTime: "15 mins",
                ingredients: [
                    { productName: "Brown Bread 400g" },
                    { productName: "Cheese 200g" },
                    { productName: "Tomato 1 kg" },
                    { productName: "Cucumber (1kg)" },
                    { productName: "Onion 500g" }
                ]
            },
            {
                name: "Veg Pulav",
                image: "veg_pulav.png",
                description: "Light and flavorful one-pot rice dish with mild spices.",
                cookingTime: "40 mins",
                ingredients: [
                    { productName: "Basmati Rice 5kg" },
                    { productName: "Carrot 500g" },
                    { productName: "Green Chilli (100g)" },
                    { productName: "Onion 500g" },
                    { productName: "Ginger (200g)" }
                ]
            },
            {
                name: "Paneer Butter Masala",
                image: "paneer_butter_masala.png",
                description: "Rich and creamy curry made with paneer, spices, onions, tomatoes, and butter.",
                cookingTime: "45 mins",
                ingredients: [
                    { productName: "Paneer 200g" },
                    { productName: "Tomato 1 kg" },
                    { productName: "Onion 500g" },
                    { productName: "Ginger (200g)" },
                    { productName: "Garlic (100g)" },
                    { productName: "Amul Milk 1L" } // Using milk for richness
                ]
            },
            {
                name: "Aloo Gobi",
                image: "aloo_gobi.png",
                description: "Classic dry curry made with potatoes and cauliflower.",
                cookingTime: "30 mins",
                ingredients: [
                    { productName: "Potato 500g" },
                    { productName: "Cauliflower (1 pc)" },
                    { productName: "Ginger (200g)" },
                    { productName: "Green Chilli (100g)" },
                    { productName: "Tomato 1 kg" }
                ]
            },
            {
                name: "Fruit Salad",
                image: "fruit_salad.png",
                description: "Refreshing mix of seasonal fruits.",
                cookingTime: "10 mins",
                ingredients: [
                    { productName: "Apple 1 kg" },
                    { productName: "Banana 1 kg" },
                    { productName: "Grapes 500g" },
                    { productName: "Mango 1 kg" }
                ]
            }
        ];

        // Clear existing to avoid duplicates on re-seed
        await Recipe.deleteMany({});

        await Recipe.insertMany(sampleRecipes);
        res.status(201).json({ success: true, message: "Recipes seeded successfully!" });
    } catch (error) {
        console.error("Error seeding recipes:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};
