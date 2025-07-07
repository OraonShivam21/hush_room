import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`Mongoose connected to ${connect.connection.host}`);
  } catch (error) {
    console.log("Mongoose connection error:", error);
  }
};
