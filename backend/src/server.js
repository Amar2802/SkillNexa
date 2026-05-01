import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./config/db.js";
import { syncSeedQuestions } from "./controllers/userController.js";

dotenv.config();

const start = async () => {
  await connectDB();

  try {
    await syncSeedQuestions();
  } catch (error) {
    console.error("Startup question sync skipped:", error?.message || error);
  }

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
};
start().catch((error) => {
  console.error(error?.message || error);
  process.exit(1);
});
