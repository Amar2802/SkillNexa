import mongoose from "mongoose";
import { FIELD_OPTIONS, FIELD_CATEGORY_MAP } from "../utils/prepFields.js";

const questionSchema = new mongoose.Schema(
  {
    title: String,
    field: { type: String, enum: FIELD_OPTIONS, default: "Software" },
    category: { type: String, enum: [...new Set(Object.values(FIELD_CATEGORY_MAP).flat())] },
    topic: String,
    difficulty: { type: String, enum: ["Easy", "Medium", "Hard"] },
    company: String,
    type: { type: String, enum: ["MCQ", "Coding", "Subjective"] },
    description: String,
    options: [String],
    correctAnswer: mongoose.Schema.Types.Mixed,
    explanation: String,
    starterCode: { type: Map, of: String, default: {} },
    tags: [String]
  },
  { timestamps: true }
);

export default mongoose.model("Question", questionSchema);
