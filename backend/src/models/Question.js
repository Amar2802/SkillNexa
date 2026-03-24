import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    title: String,
    category: { type: String, enum: ["DSA", "Aptitude", "HR", "Core Subjects"] },
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
