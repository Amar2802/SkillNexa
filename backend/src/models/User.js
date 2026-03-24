import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,
    googleId: String,
    avatar: String,
    interests: [String],
    bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }],
    progress: {
      testsTaken: { type: Number, default: 0 },
      accuracy: { type: Number, default: 0 },
      weakTopics: [String],
      recommendedTopics: [String]
    }
  },
  { timestamps: true }
);

userSchema.pre("save", async function hashPassword(next) {
  if (!this.isModified("password") || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

export default mongoose.model("User", userSchema);
