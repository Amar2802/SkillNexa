import mongoose from "mongoose";

const promptSchema = new mongoose.Schema(
  {
    key: { type: String, unique: true, required: true, index: true },
    title: { type: String, required: true },
    content: { type: String, required: true }
  },
  { timestamps: true }
);

export default mongoose.model("Prompt", promptSchema);
