import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { connectDB } from "./config/connectDB.js";
dotenv.config();
import userRoutes from "./routes/user.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import productRoutes from "./routes/product.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import addressRoutes from "./routes/address.routes.js";
import orderRoutes from "./routes/order.routes.js";
import issueRoutes from "./routes/issue.routes.js";
import sellerRoutes from "./routes/seller.routes.js";
import bundleRoutes from "./routes/bundle.routes.js";
import offerRoutes from "./routes/offer.route.js";
import reminderRoutes from "./routes/reminder.route.js";
import recipeRoutes from "./routes/recipe.route.js";
import wishlistRoutes from "./routes/wishlist.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import couponRoutes from "./routes/coupon.routes.js";
import deliveryBoyRoutes from "./routes/deliveryBoy.routes.js";

import { connectCloudinary } from "./config/cloudinary.js";

const app = express();

await connectCloudinary();
const allowedOrigins = [
  "http://localhost:5173", 
  "http://localhost:5174",
  "https://grocify-frontend.onrender.com"
];
//middlewares
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(cookieParser());
app.use(express.json());

// Api endpoints
app.use("/images", express.static("uploads"));
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/seller", sellerRoutes);
app.use("/api/product", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/address", addressRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/issue", issueRoutes);
app.use("/api/bundle", bundleRoutes);
app.use("/api/offer", offerRoutes);
app.use("/api/reminder", reminderRoutes);
app.use("/api/recipe", recipeRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/notification", notificationRoutes);
app.use("/api/coupon", couponRoutes);
app.use("/api/delivery", deliveryBoyRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port ${PORT}`);
});
