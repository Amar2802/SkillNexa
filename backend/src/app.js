import express from "express";
import cors from "cors";
import morgan from "morgan";
import passport from "./config/passport.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import questionRoutes from "./routes/questionRoutes.js";
import testRoutes from "./routes/testRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import codeRoutes from "./routes/codeRoutes.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";

const app = express();

const rawClientUrl = process.env.CLIENT_URL || "http://localhost:5173";
const sanitizedClientUrl = rawClientUrl
  .split(/[\s,]+/)
  .map((value) => value.trim().replace(/^['\"]|['\"]$/g, ""))
  .find(Boolean) || "http://localhost:5173";

app.use(cors({ origin: sanitizedClientUrl, credentials: true }));
app.use(express.json({ limit: "2mb" }));
app.use(morgan("dev"));
app.use(passport.initialize());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, clientUrl: sanitizedClientUrl });
});

app.use("/api/auth", authRoutes);
app.use("/api", userRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/tests", testRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/code", codeRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
