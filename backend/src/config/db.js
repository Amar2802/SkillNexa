import mongoose from "mongoose";

const connectDB = async () => {
  const mongoUri = String(process.env.MONGO_URI || "").trim();

  if (!mongoUri) {
    throw new Error("MONGO_URI is missing. Set it in the environment before starting the backend.");
  }

  await mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: 10000
  });
};

export default connectDB;
