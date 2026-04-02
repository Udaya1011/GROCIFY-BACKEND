import mongoose from "mongoose";
import User from "./models/user.model.js";
import dotenv from "dotenv";

dotenv.config();

const verifyUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB for verification...");
        console.log("Database Name:", mongoose.connection.name);

        const users = await User.find({}, 'name email');
        console.log("-----------------------------------");
        console.log(`Found ${users.length} users in 'users' collection:`);
        console.log("-----------------------------------");
        users.forEach(u => console.log(`- ${u.name} (${u.email})`));
        console.log("-----------------------------------");

        process.exit(0);
    } catch (error) {
        console.error("Error verifying users:", error);
        process.exit(1);
    }
};

verifyUsers();
