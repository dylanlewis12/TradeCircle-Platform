import mongoose from "mongoose";

const db = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected with Mongoose");
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }
};

export default db;
