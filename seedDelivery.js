import mongoose from "mongoose";
import DeliveryBoy from "./models/deliveryBoy.model.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
dotenv.config();

const seedDelivery = async () => {
    try {
        const mongoUri = process.env.MONGO_URI;
        if (!mongoUri) {
            console.error("MONGO_URI not found in .env");
            process.exit(1);
        }
        await mongoose.connect(mongoUri);
        console.log("Connected to DB");

        const deliveryBoysData = [
            { name: "Arul Selvan", email: "delivery@test.com", phone: "9876543210" },
            { name: "Kumar Raja", email: "kumar@test.com", phone: "9876543211" },
            { name: "Karthik Deepan", email: "karthik@test.com", phone: "9876543212" },
            { name: "Selvam Mani", email: "selvam@test.com", phone: "9876543213" },
            { name: "Raj Pandian", email: "raj@test.com", phone: "9876543214" }
        ];

        const hashedPassword = await bcrypt.hash("password123", 10);

        for (const data of deliveryBoysData) {
            // Remove if exists to avoid duplicates during re-seeding
            await DeliveryBoy.deleteOne({ email: data.email });

            const deliveryBoy = new DeliveryBoy({
                ...data,
                password: hashedPassword,
                status: "active"
            });
            await deliveryBoy.save();
            console.log(`Seeded: ${data.name} (${data.email})`);
        }

        console.log("Successfully seeded 5 Delivery Boys with password: password123");
        process.exit(0);
    } catch (error) {
        console.error("Error seeding delivery boys:", error);
        process.exit(1);
    }
};

seedDelivery();
