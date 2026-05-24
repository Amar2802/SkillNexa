import "./loadEnv.js";
import app from "./app.js";
import connectDB from "./config/db.js";
import { syncSeedQuestions } from "./controllers/userController.js";
import { requireJwtSecret, requireRefreshJwtSecret } from "./utils/generateToken.js";

const start = async () => {
  requireJwtSecret();
  requireRefreshJwtSecret();
  console.log("Connecting to MongoDB...");
  await connectDB();
  console.log("MongoDB connected");

  try {
    console.log("Syncing seed questions...");
    await syncSeedQuestions();
    console.log("Seed question sync complete");
  } catch (error) {
    console.error("Startup question sync skipped:", error?.message || error);
  }

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
};
start().catch((error) => {
  console.error("Backend startup failed:", error?.message || error);
  process.exit(1);
});
