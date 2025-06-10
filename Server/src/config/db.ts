import mongoose from "mongoose";
import { MONGO_ATLAS_URI } from "./env";

async function connectToDB() {
  try {
    await mongoose.connect(MONGO_ATLAS_URI);
    console.log("Connected to MongoDB with Mongoose");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
}

export default connectToDB;
