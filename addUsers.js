import mongoose from "mongoose";
import User from "./models/user.model.js";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

dotenv.config();

// Add the users you want to restore here
const usersToAdd = [
    {
        name: "Anisha",
        email: "anisha@gmail.com",
        password: "password123",
    },
    {
        name: "Sudha",
        email: "sudha@gmail.com",
        password: "password123",
    },
    {
        name: "Vino",
        email: "vino@gmail.com",
        password: "password123",
    },
    {
        name: "Shreeja",
        email: "shreeja@gmail.com",
        password: "password123",
    },
];

const addUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB...");

        if (usersToAdd.length === 0) {
            console.log("No users to add. Please edit the 'usersToAdd' array in addUsers.js");
            process.exit(0);
        }

        console.log(`Attempting to add ${usersToAdd.length} users...`);

        for (const user of usersToAdd) {
            const existingUser = await User.findOne({ email: user.email });
            if (existingUser) {
                console.log(`User already exists: ${user.email} (Skipping)`);
                continue;
            }

            const hashedPassword = await bcrypt.hash(user.password, 10);
            const newUser = new User({
                ...user,
                password: hashedPassword,
                cartItems: {},
            });
            await newUser.save();
            console.log(`Added user: ${user.email}`);
        }

        console.log("Done.");
        process.exit(0);
    } catch (error) {
        console.error("Error adding users:", error);
        process.exit(1);
    }
};

addUsers();
