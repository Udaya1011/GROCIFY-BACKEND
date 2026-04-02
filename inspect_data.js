import mongoose from "mongoose";
import Order from "./models/order.model.js";
import User from "./models/user.model.js";
import dotenv from "dotenv";

dotenv.config();

const inspectData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const users = await User.find({}).lean();
    console.log("\n--- Users ---");
    users.forEach(u => console.log(`ID: ${u._id} (${typeof u._id}), Email: ${u.email}`));

    const orders = await Order.find({}).lean();
    console.log("\n--- Orders ---");
    orders.forEach(o => {
      console.log(`Order ID: ${o._id}, UserID in Order: ${o.userId} (${typeof o.userId}), Amount: ${o.amount}`);
    });

    // Check if any orders match any user
    console.log("\n--- Matching Check ---");
    orders.forEach(o => {
        const match = users.find(u => u._id.toString() === o.userId.toString());
        if (match) {
            console.log(`Order ${o._id} matches user ${match.email}`);
        } else {
            console.log(`Order ${o._id} has NO matching user for ID ${o.userId}`);
        }
    });

    process.exit(0);
  } catch (error) {
    console.error("Error inspecting data:", error);
    process.exit(1);
  }
};

inspectData();
