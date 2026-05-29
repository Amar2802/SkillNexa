import mongoose from "mongoose";

const answerEvaluationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    questionId: { type: String, default: "" },
    question: { type: String, required: true },
    userAnswer: { type: String, required: true },
    topic: { type: String, default: "General" },
    role: { type: String, default: "Software Engineer" },
    difficulty: { type: String, default: "Medium" },
    interviewType: { type: String, default: "practice" },
    module: { type: String, default: "practice" },
    score: { type: Number, default: 0 },
    technicalScore: { type: Number, default: 0 },
    communicationScore: { type: Number, default: 0 },
    clarityScore: { type: Number, default: 0 },
    problemSolvingScore: { type: Number, default: 0 },
    confidenceScore: { type: Number, default: 0 },
    completenessScore: { type: Number, default: 0 },
    industryReadinessScore: { type: Number, default: 0 },
    strengths: [{ type: String }],
    weaknesses: [{ type: String }],
    missedConcepts: [{ type: String }],
    suggestions: [{ type: String }],
    idealAnswer: { type: String, default: "" },
    recruiterFeedback: { type: String, default: "" },
    followUpQuestions: [{ type: String }],
    source: { type: String, default: "fallback" }
  },
  { timestamps: true }
);

answerEvaluationSchema.index({ user: 1, createdAt: -1 });
answerEvaluationSchema.index({ user: 1, topic: 1 });

export default mongoose.model("AnswerEvaluation", answerEvaluationSchema);
