import mongoose from "mongoose";

const DB_NAME = "skillnexa";

const normalizeMongoUri = (mongoUri) => {
  const match = String(mongoUri || "").match(/^(mongodb(?:\+srv)?:\/\/[^/]+)(\/[^?]*)?(\?.*)?$/i);
  if (!match) {
    return { uri: mongoUri, dbName: DB_NAME };
  }

  const [, origin, , query = ""] = match;
  return {
    uri: `${origin}/${DB_NAME}${query}`,
    dbName: DB_NAME
  };
};

const connectDB = async () => {
  const mongoUri = String(process.env.MONGO_URI || "").trim();

  if (!mongoUri) {
    throw new Error("MONGO_URI is missing. Set it in the environment before starting the backend.");
  }

  const { uri, dbName } = normalizeMongoUri(mongoUri);
  console.log(`Resolved MongoDB database: ${dbName}`);

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000
    });
  } catch (error) {
    const message = String(error?.message || error);
    if (/querySrv/i.test(message)) {
      throw new Error(
        `${message}\n\nMongoDB Atlas SRV DNS lookup failed. Try: (1) check internet, VPN, and firewall; (2) switch DNS to 8.8.8.8 or 1.1.1.1; (3) use Atlas "standard connection string" instead of mongodb+srv; or (4) for local dev set MONGO_URI=mongodb://127.0.0.1:27017/skillnexa`
      );
    }
    throw error;
  }
};

export default connectDB;
