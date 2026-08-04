import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { FIELD_OPTIONS } from "../utils/prepFields.js";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, required: true, maxlength: 80 },
    email: { type: String, unique: true, trim: true, lowercase: true, required: true },
    password: { type: String, default: "" },
    googleId: String,
    avatar: String,
    targetField: { type: String, enum: FIELD_OPTIONS, default: "Software" },
    interests: [String],
    bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }],
    completedRoadmapTopics: [{ type: String, default: [] }],
    recentlyViewed: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question", default: [] }],
    role: { type: String, enum: ["user", "admin"], default: "user" },
    streakCount: { type: Number, default: 0 },
    lastActiveDate: { type: String, default: "" },
    progress: {
      testsTaken: { type: Number, default: 0 },
      accuracy: { type: Number, default: 0 },
      weakTopics: [String],
      recommendedTopics: [String]
    },
    passwordResetOtp: String,
    passwordResetOtpHash: String,
    passwordResetOtpExpiresAt: Date,
    refreshTokenHash: String,
    refreshTokenExpiresAt: Date,
    refreshSessionId: String
  },
  { timestamps: true }
);

userSchema.pre("save", async function hashPassword(next) {
  if (!this.isModified("password") || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

export default mongoose.model("User", userSchema);
