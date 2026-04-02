import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import Stripe from "stripe";
import dotenv from "dotenv";
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Place order COD: /api/order/place
export const placeOrderCOD = async (req, res) => {
  try {
    const userId = req.user;
    const { items, address, isPlasticFree, bringOwnBag } = req.body;
    if (!address || !items || items.length === 0) {
      return res
        .status(400)
        .json({ message: "Invalid order details", success: false });
    }
    // calculate amount using items;
    let amount = 0;
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (product) {
        amount += product.offerPrice * item.quantity;
      }
    }

    // Apply Eco-Friendly Discount
    if (bringOwnBag) {
      amount -= 10;
      if (amount < 0) amount = 0; // Prevent negative amount
    }

    // Add tex charfe 2%
    amount += Math.floor((amount * 2) / 100);

    // Add sellerId to each item
    const itemsWithSeller = await Promise.all(
      items.map(async (item) => {
        const product = await Product.findById(item.product);
        return {
          ...item,
          sellerId: product ? product.sellerId : null,
        };
      })
    );

    await Order.create({
      userId,
      items: itemsWithSeller,
      address,
      amount,
      paymentType: "COD",
      isPaid: false,
      isPlasticFree,
      bringOwnBag,
    });
    res
      .status(201)
      .json({ message: "Order placed successfully", success: true });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Place order Stripe: /api/order/stripe
export const placeOrderStripe = async (req, res) => {
  try {
    const userId = req.user;
    const { items, address, isPlasticFree, bringOwnBag } = req.body;
    const { origin } = req.headers;

    console.log("DEBUG: STRIPE_KEY loaded:", process.env.STRIPE_SECRET_KEY);
    console.log("DEBUG: Key Length:", process.env.STRIPE_SECRET_KEY ? process.env.STRIPE_SECRET_KEY.length : 0);

    if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY === "sk_test_...") {
      console.error("STRIPE_SECRET_KEY is missing or invalid in .env file");
      return res.status(500).json({
        success: false,
        message: "Stripe payment is not configured correctly. Please contact the administrator."
      });
    }

    const frontendOrigin = origin || "http://localhost:5173";

    if (!address || !items || items.length === 0) {
      return res
        .status(400)
        .json({ message: "Invalid order details", success: false });
    }

    // calculate amount using items;
    let amount = 0;
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (product) {
        amount += product.offerPrice * item.quantity;
      }
    }

    // Apply Eco-Friendly Discount
    if (bringOwnBag) {
      amount -= 10;
      if (amount < 0) amount = 0;
    }

    // Add tax charge 2%
    amount += Math.floor((amount * 2) / 100);

    // Add sellerId to each item
    const itemsWithSeller = await Promise.all(
      items.map(async (item) => {
        const product = await Product.findById(item.product);
        return {
          ...item,
          sellerId: product ? product.sellerId : null,
        };
      })
    );

    const newOrder = await Order.create({
      userId,
      items: itemsWithSeller,
      address,
      amount,
      paymentType: "Stripe",
      isPaid: false,
      isPlasticFree,
      bringOwnBag,
    });

    const line_items = await Promise.all(
      items.map(async (item) => {
        const product = await Product.findById(item.product);
        if (!product) {
          throw new Error(`Product not found: ${item.product}`);
        }
        return {
          price_data: {
            currency: "inr",
            product_data: {
              name: product.name,
            },
            unit_amount: Math.round(product.offerPrice * 100),
          },
          quantity: item.quantity,
        };
      })
    );

    // Add tax as a line item
    const taxAmount = Math.floor((amount * 2) / (100 + 2)); // Calculate tax from current total amount (which already includes 2%)
    // Actually, amount was calculated as: amount = base + (base * 0.02)
    // base = amount / 1.02
    // tax = base * 0.02
    const baseAmount = amount / 1.02;
    const taxValue = baseAmount * 0.02;

    line_items.push({
      price_data: {
        currency: "inr",
        product_data: {
          name: "Tax (2%)",
        },
        unit_amount: Math.round(taxValue * 100),
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      success_url: `${frontendOrigin}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${frontendOrigin}/verify?success=false&orderId=${newOrder._id}`,
      line_items,
      mode: "payment",
    });

    res.status(200).json({ success: true, session_url: session.url });
  } catch (error) {
    console.error("Error in placeOrderStripe:", error);
    res.status(500).json({ message: error.message, success: false });
  }
};

// Verify Stripe: /api/order/verifyStripe
export const verifyStripe = async (req, res) => {
  try {
    const { orderId, success } = req.body;
    if (success === "true") {
      await Order.findByIdAndUpdate(orderId, { isPaid: true });
      res.status(200).json({ success: true, message: "Order Paid" });
    } else {
      await Order.findByIdAndDelete(orderId);
      res.status(200).json({ success: false, message: "Payment Failed" });
    }
  } catch (error) {
    console.error("Error in verifyStripe:", error);
    res.status(500).json({ message: error.message, success: false });
  }
};

// oredr details for individual user :/api/order/user
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user;
    const orders = await Order.find({
      userId,
      $or: [{ paymentType: "COD" }, { isPaid: true }],
    })
      .populate("items.product address")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// get all orders for admin :/api/order/all
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      $or: [{ paymentType: "COD" }, { isPaid: true }],
    })
      .populate("items.product address")
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Mock Payment for testing: /api/order/mock
export const placeOrderMock = async (req, res) => {
  try {
    const userId = req.user;
    const { items, address, isPlasticFree, bringOwnBag } = req.body;
    if (!address || !items || items.length === 0) {
      return res
        .status(400)
        .json({ message: "Invalid order details", success: false });
    }
    // calculate amount using items;
    let amount = 0;
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (product) {
        amount += product.offerPrice * item.quantity;
      }
    }

    // Apply Eco-Friendly Discount
    if (bringOwnBag) {
      amount -= 10;
      if (amount < 0) amount = 0;
    }

    // Add tax charge 2%
    amount += Math.floor((amount * 2) / 100);

    // Add sellerId to each item
    const itemsWithSeller = await Promise.all(
      items.map(async (item) => {
        const product = await Product.findById(item.product);
        return {
          ...item,
          sellerId: product ? product.sellerId : null,
        };
      })
    );

    await Order.create({
      userId,
      items: itemsWithSeller,
      address,
      amount,
      paymentType: "Mock",
      isPaid: true,
      isPlasticFree,
      bringOwnBag,
    });

    res.status(201).json({ message: "Mock Payment Successful!", success: true });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Rate Order: /api/order/rate
export const rateOrder = async (req, res) => {
  try {
    const userId = req.user;
    const { orderId, speed, behavior, comment } = req.body;

    if (!orderId || !speed || !behavior) {
      return res.status(400).json({ success: false, message: "Missing rating details" });
    }

    const order = await Order.findOne({ _id: orderId, userId });

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    if (order.deliveryRating && order.deliveryRating.isRated) {
      return res.status(400).json({ success: false, message: "Order already rated" });
    }

    order.deliveryRating = {
      speed,
      behavior,
      comment,
      isRated: true,
    };

    await order.save();

    res.status(200).json({ success: true, message: "Rating submitted successfully" });
  } catch (error) {
    console.error("Error in rateOrder:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

import Address from "../models/address.model.js";

// Seed Sample Order for User: /api/order/seed
export const seedUserOrder = async (req, res) => {
  try {
    const userId = req.user;

    // 1. Check or Create Dummy Address
    let address = await Address.findOne({ userId });
    if (!address) {
      address = await Address.create({
        userId,
        firstName: "Test",
        lastName: "User",
        email: "test@grocify.com",
        street: "123 Sample St",
        city: "Demo City",
        state: "Demo State",
        landmark: "Near React",
        phone: "9999999999"
      });
    }

    // 2. Pick a random product
    const products = await Product.find({});
    if (products.length === 0) {
      return res.status(400).json({ success: false, message: "No products in DB to seed order" });
    }
    const randomProduct = products[Math.floor(Math.random() * products.length)];

    // 3. Create Delivered Order
    // Calculate amount
    const amount = randomProduct.offerPrice;
    const tax = Math.floor((amount * 2) / 100);
    const totalAmount = amount + tax;

    const order = await Order.create({
      userId,
      items: [{
        product: randomProduct._id,
        quantity: 1,
        sellerId: randomProduct.sellerId
      }],
      address: address._id,
      amount: totalAmount,
      paymentType: "Mock (Seeded)",
      status: "Delivered", // Important for rating
      isPaid: true
    });

    res.status(201).json({ success: true, message: "Sample order generated!", order });

  } catch (error) {
    console.error("Error seeding order:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Update Order Status: /api/order/status
export const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    await Order.findByIdAndUpdate(orderId, { status });
    res.json({ success: true, message: "Status Updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Sales Analytics: /api/order/analytics
export const getSalesStats = async (req, res) => {
  try {
    const orders = await Order.find({
      $or: [{ paymentType: "COD" }, { isPaid: true }],
    });

    const totalRevenue = orders.reduce((sum, order) => sum + order.amount, 0);
    const totalOrders = orders.length;
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Helper for grouping
    const groupDaily = {};
    const groupWeekly = {};
    const groupMonthly = {};

    orders.forEach(order => {
      const date = new Date(order.createdAt);

      // Daily (Last 30 days)
      const dayKey = date.toISOString().split('T')[0];
      groupDaily[dayKey] = (groupDaily[dayKey] || 0) + order.amount;

      // Weekly (Year-Week)
      const startOfYear = new Date(date.getFullYear(), 0, 1);
      const weekNum = Math.ceil((((date - startOfYear) / 86400000) + startOfYear.getDay() + 1) / 7);
      const weekKey = `${date.getFullYear()}-W${weekNum}`;
      groupWeekly[weekKey] = (groupWeekly[weekKey] || 0) + order.amount;

      // Monthly (Year-Month)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      groupMonthly[monthKey] = (groupMonthly[monthKey] || 0) + order.amount;
    });

    // Format for charts
    const formatData = (obj) => Object.entries(obj)
      .map(([key, value]) => ({ label: key, revenue: Math.floor(value * 100) / 100 }))
      .sort((a, b) => a.label.localeCompare(b.label));

    res.status(200).json({
      success: true,
      metrics: {
        totalRevenue: Math.floor(totalRevenue * 100) / 100,
        totalOrders,
        avgOrderValue: Math.floor(avgOrderValue * 100) / 100,
      },
      charts: {
        daily: formatData(groupDaily).slice(-30),
        weekly: formatData(groupWeekly).slice(-12),
        monthly: formatData(groupMonthly).slice(-12),
      }
    });
  } catch (error) {
    console.error("Error in getSalesStats:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
