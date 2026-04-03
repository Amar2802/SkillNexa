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

const parseOrigins = (value) => String(value || "")
  .split(/[,\s]+/)
  .map((origin) => origin.trim().replace(/^['\"]|['\"]$/g, ""))
  .filter(Boolean);

const configuredOrigins = parseOrigins(process.env.CLIENT_URL);
const allowedOrigins = new Set([
  "http://localhost:5173",
  "https://skill-nexa-u1x3.vercel.app",
  ...configuredOrigins
]);

const primaryClientUrl = configuredOrigins[0] || "https://skill-nexa-u1x3.vercel.app";

app.use(cors({
  origin(origin, callback) {
    if (!origin) return callback(null, true);

    if (allowedOrigins.has(origin)) {
      return callback(null, true);
    }

    if (/^https:\/\/[a-z0-9-]+\.vercel\.app$/i.test(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`CORS blocked for origin ${origin}`));
  },
  credentials: true
}));
app.use(express.json({ limit: "2mb" }));
app.use(morgan("dev"));
app.use(passport.initialize());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, clientUrl: primaryClientUrl, allowedOrigins: [...allowedOrigins] });
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
