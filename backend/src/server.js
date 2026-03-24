import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./config/db.js";
import { syncSeedQuestions } from "./controllers/userController.js";

dotenv.config();

const start = async () => {
  await connectDB();
  await syncSeedQuestions();

  app.listen(process.env.PORT || 5000, () => {
    console.log(`Server running on port ${process.env.PORT || 5000}`);
  });
};

start().catch((error) => {
  console.error(error);
  process.exit(1);
});
