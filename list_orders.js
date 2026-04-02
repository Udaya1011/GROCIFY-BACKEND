import mongoose from "mongoose";
import Order from "./models/order.model.js";
import dotenv from "dotenv";

dotenv.config();

const listOrders = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const orders = await Order.find({}).lean();
    console.log("Total orders in DB:", orders.length);
    orders.forEach(order => {
      console.log(`Order ID: ${order._id}, User: ${order.userId}, Amount: ${order.amount}, Paid: ${order.isPaid}, Type: ${order.paymentType}`);
    });

    process.exit(0);
  } catch (error) {
    console.error("Error listing orders:", error);
    process.exit(1);
  }
};

listOrders();
