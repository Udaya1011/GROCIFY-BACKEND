import mongoose from "mongoose";
import Product from "./models/product.model.js";
import dotenv from "dotenv";
import { 
    dummyProducts, 
    noodlesPastaProducts, 
    ketchupDipsSpreadsProducts, 
    chocolateSweetsProducts, 
    picklesChutneyProducts, 
    readyToCookProducts, 
    masalasSpicesProducts, 
    breakfastEssentials, 
    bakingEssentialsProducts, 
    dalPulsesProducts, 
    dryFruitsProducts, 
    snacksProducts, 
    detergentProducts, 
    householdCareProducts, 
    teaCoffeeProducts 
} from "../client/src/assets/assets.js";

dotenv.config();

const syncProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const allProducts = [
        ...dummyProducts,
        ...noodlesPastaProducts,
        ...ketchupDipsSpreadsProducts,
        ...chocolateSweetsProducts,
        ...picklesChutneyProducts,
        ...readyToCookProducts,
        ...masalasSpicesProducts,
        ...breakfastEssentials,
        ...bakingEssentialsProducts,
        ...dalPulsesProducts,
        ...dryFruitsProducts,
        ...snacksProducts,
        ...detergentProducts,
        ...householdCareProducts,
        ...teaCoffeeProducts
    ];

    console.log(`Starting sync for ${allProducts.length} products...`);

    let updated = 0;
    let created = 0;

    for (const p of allProducts) {
        // Clean product data for DB
        const productData = {
            _id: p._id,
            name: p.name,
            description: Array.isArray(p.description) ? p.description : [p.description],
            price: p.price,
            offerPrice: p.offerPrice,
            image: Array.isArray(p.image) ? p.image.map(img => typeof img === 'string' ? img.split('/').pop() : 'placeholder.png') : ['placeholder.png'],
            category: p.category,
            inStock: p.inStock ?? true,
            stock: p.stock ?? 100
        };

        const existing = await Product.findById(p._id);
        if (existing) {
            await Product.findByIdAndUpdate(p._id, productData);
            updated++;
        } else {
            await Product.create(productData);
            created++;
        }
    }

    console.log(`Sync Complete! Created: ${created}, Updated: ${updated}`);
    process.exit(0);
  } catch (error) {
    console.error("Error syncing products:", error);
    process.exit(1);
  }
};

syncProducts();
