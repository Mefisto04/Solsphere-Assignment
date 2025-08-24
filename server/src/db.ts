import mongoose from "mongoose";

export async function connectDb() {
    const uri = process.env.MONGO_URI;
    if (!uri) throw new Error("MONGO_URI is not set in environment");

    mongoose.set("strictQuery", true);
    await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
    });
    console.log("Connected to MongoDB");
}
