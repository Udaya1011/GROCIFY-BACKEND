import mongoose from "mongoose";
const orderSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, ref: "User" },
    items: [
      {
        product: { type: String, required: true, ref: "Product" },
        quantity: { type: Number, required: true },
        sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "Seller", default: null },
      },
    ],
    amount: { type: Number, required: true },
    address: { type: String, required: true, ref: "Address" },
    status: { type: String, default: "Order Placed" },
    paymentType: { type: String, required: true },
    isPaid: { type: Boolean, required: true, default: false },
    deliveryRating: {
      speed: { type: Number, min: 1, max: 5 },
      behavior: { type: Number, min: 1, max: 5 },
      comment: { type: String },
      isRated: { type: Boolean, default: false },
    },
    isPlasticFree: { type: Boolean, default: false },
    bringOwnBag: { type: Boolean, default: false },
    deliveryBoyId: { type: mongoose.Schema.Types.ObjectId, ref: "DeliveryBoy", default: null },
  },
  { timestamps: true }
);
const Order = mongoose.model("Order", orderSchema);
export default Order;
