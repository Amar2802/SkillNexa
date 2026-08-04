import mongoose from "mongoose";

const interviewSessionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    role: { type: String, default: "Software Engineer" },
    company: { type: String, default: "General" },
    difficulty: { type: String, enum: ["Easy", "Medium", "Hard"], default: "Medium" },
    domain: { type: String, default: "Mixed" },
    interviewType: { type: String, enum: ["Technical", "HR", "Mixed"], default: "Mixed" },
    mode: { type: String, enum: ["Voice", "Text"], default: "Text" },
    questions: [
      {
        questionId: String,
        round: String,
        question: String,
        category: String,
        difficulty: String,
        userAnswer: String,
        score: Number,
        feedback: String,
        idealAnswer: String,
        followUpQuestions: [String]
      }
    ],
    overallScore: { type: Number, default: 0 },
    communicationScore: { type: Number, default: 0 },
    technicalScore: { type: Number, default: 0 },
    confidenceScore: { type: Number, default: 0 },
    strengths: [{ type: String }],
    weaknesses: [{ type: String }],
    improvementAreas: [{ type: String }],
    suggestedTopics: [{ type: String }],
    suggestedQuestions: [{ type: String }]
  },
  { timestamps: true }
);

interviewSessionSchema.index({ user: 1, createdAt: -1 });

export default mongoose.model("InterviewSession", interviewSessionSchema);
