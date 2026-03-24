import mongoose from "mongoose";

const resultSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    test: { type: mongoose.Schema.Types.ObjectId, ref: "Test" },
    answers: [
      {
        question: { type: mongoose.Schema.Types.ObjectId, ref: "Question" },
        submittedAnswer: mongoose.Schema.Types.Mixed,
        isCorrect: Boolean,
        score: Number,
        timeSpent: Number,
        feedback: String
      }
    ],
    score: Number,
    accuracy: Number,
    weakTopics: [String],
    strengths: [String],
    totalTimeSpent: Number
  },
  { timestamps: true }
);

export default mongoose.model("Result", resultSchema);
