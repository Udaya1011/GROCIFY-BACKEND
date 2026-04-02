import mongoose from "mongoose";
import User from "./models/user.model.js";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

dotenv.config();

const dummyUsers = [
    {
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
    },
    {
        name: "Jane Smith",
        email: "jane@example.com",
        password: "password123",
    },
    {
        name: "Alice Johnson",
        email: "alice@example.com",
        password: "password123",
    },
    {
        name: "Bob Brown",
        email: "bob@example.com",
        password: "password123",
    },
    {
        name: "Charlie Davis",
        email: "charlie@example.com",
        password: "password123",
    },
];

const seedUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB for seeding users...");

        // Clear existing users
        console.log("Clearing existing users...");
        await User.deleteMany({});

        // Hash passwords and prepare users
        console.log("Hashing passwords and preparing data...");
        const usersWithHashedPasswords = await Promise.all(
            dummyUsers.map(async (user) => {
                const hashedPassword = await bcrypt.hash(user.password, 10);
                return {
                    ...user,
                    password: hashedPassword,
                    cartItems: {}, // Initialize empty cart
                };
            })
        );

        // Insert users
        await User.insertMany(usersWithHashedPasswords);
        console.log(`Successfully seeded ${usersWithHashedPasswords.length} users.`);

        console.log("Sample Credentials:");
        dummyUsers.forEach(u => console.log(`Email: ${u.email}, Password: ${u.password}`));

        process.exit(0);
    } catch (error) {
        console.error("Error seeding users:", error);
        process.exit(1);
    }
};

seedUsers();
