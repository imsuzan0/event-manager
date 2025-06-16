import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI);
    console.log(`MongoDB Connected:${conn.connection.host}`);
  } catch (err) {
    console.error("Error in db connection", err);
    process.exit(1);
  }
};

export default connectDB;
