import mongoose from "mongoose";
import User from "./models/user.model.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const seedUser = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const email = "testuser@gmail.com";
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("User already exists");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash("password123", 10);
    const user = new User({
      name: "Test User",
      email,
      password: hashedPassword,
      mobile: "1234567890",
    });

    await user.save();
    console.log("Test user seeded successfully");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding user:", error);
    process.exit(1);
  }
};

seedUser();
