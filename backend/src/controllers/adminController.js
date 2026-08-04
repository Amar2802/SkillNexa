import User from "../models/User.js";
import Question from "../models/Question.js";
import AnswerEvaluation from "../models/AnswerEvaluation.js";
import Prompt from "../models/Prompt.js";

// List all users
export const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).sort({ createdAt: -1 }).select("-password -refreshTokenHash -passwordResetOtpHash").lean();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users" });
  }
};

// Toggle Admin Role
export const toggleUserAdmin = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (String(user._id) === String(req.user._id)) {
      return res.status(400).json({ message: "You cannot change your own admin role." });
    }

    user.role = user.role === "admin" ? "user" : "admin";
    await user.save();

    res.json({ message: `User role changed to ${user.role}`, role: user.role });
  } catch (error) {
    res.status(500).json({ message: "Error modifying user role" });
  }
};

// Delete User
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (String(user._id) === String(req.user._id)) {
      return res.status(400).json({ message: "You cannot delete your own admin account." });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user" });
  }
};

// Get Prompts
export const getPrompts = async (req, res) => {
  try {
    const prompts = await Prompt.find({}).sort({ key: 1 }).lean();
    res.json(prompts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching AI prompts" });
  }
};

// Update Prompt
export const updatePrompt = async (req, res) => {
  const { content } = req.body;
  if (!content) {
    return res.status(400).json({ message: "Prompt content is required" });
  }

  try {
    const prompt = await Prompt.findOneAndUpdate(
      { key: req.params.key },
      { content },
      { new: true, upsert: true }
    );
    res.json({ message: "Prompt updated successfully", prompt });
  } catch (error) {
    res.status(500).json({ message: "Error updating prompt" });
  }
};

// Admin Analytics Dashboard
export const getAdminAnalytics = async (req, res) => {
  try {
    const [totalUsers, totalQuestions, totalEvaluations, evaluationStats] = await Promise.all([
      User.countDocuments({}),
      Question.countDocuments({}),
      AnswerEvaluation.countDocuments({}),
      AnswerEvaluation.aggregate([
        {
          $group: {
            _id: null,
            averageScore: { $avg: "$score" }
          }
        }
      ])
    ]);

    // Query registration trend
    const recentUsersJoined = await User.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: -1 } },
      { $limit: 10 }
    ]);

    // Average score
    const avgScore = evaluationStats.length ? Math.round(evaluationStats[0].averageScore) : 0;

    res.json({
      totalUsers,
      totalQuestions,
      totalEvaluations,
      averageScore: avgScore,
      registrationTrend: recentUsersJoined.reverse()
    });
  } catch (error) {
    console.error("getAdminAnalytics error:", error.message || error);
    res.status(500).json({ message: "Error fetching admin analytics" });
  }
};

// Create a new question
export const createQuestion = async (req, res) => {
  const { title, field, category, topic, difficulty, company, type, description, options, correctAnswer, explanation, starterCode, tags } = req.body;
  
  if (!title || !category || !type || !description) {
    return res.status(400).json({ message: "Title, Category, Type, and Description are required" });
  }

  try {
    const question = await Question.create({
      title,
      field: field || "Software",
      category,
      topic: topic || "General",
      difficulty: difficulty || "Medium",
      company: company || "General",
      type,
      description,
      options: options || [],
      correctAnswer,
      explanation,
      starterCode: starterCode || {},
      tags: tags || []
    });
    res.status(201).json(question);
  } catch (error) {
    res.status(500).json({ message: "Error creating question" });
  }
};

// Update an existing question
export const updateQuestion = async (req, res) => {
  try {
    const question = await Question.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true }
    );
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }
    res.json(question);
  } catch (error) {
    res.status(500).json({ message: "Error updating question" });
  }
};

// Delete a question
export const deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findByIdAndDelete(req.params.id);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }
    res.json({ message: "Question deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting question" });
  }
};

export const seedDefaultPrompts = async () => {
  const defaults = [
    {
      key: "interview_generation",
      title: "AI Interview Questions Generation Prompt",
      content: `You are an expert interviewer simulating a realistic software interview loop.
Generate {{safeCount}} interview questions for these settings:
- Target role: {{role}}
- Focus area: {{focus}}
- Interview format: {{roundType}}
- Experience level: {{experienceLevel}}
- Target company: {{company}}

Use this round plan:
{{roundPlan}}

Return valid JSON only as an array of objects.
Each object must include these string fields:
- id
- round
- question
- category
- difficulty
- intent
- evaluationFocus
- followUpHint

Make the flow feel like a real hiring process with different rounds and realistic interviewer wording.`
    },
    {
      key: "answer_evaluation",
      title: "AI Single Answer Evaluation Prompt",
      content: `You are a senior technical recruiter evaluating interview answers.
Return valid JSON only with this exact shape:
{
  "score": number 0-100,
  "technicalScore": number 0-10,
  "communicationScore": number 0-10,
  "clarityScore": number 0-10,
  "problemSolvingScore": number 0-10,
  "confidenceScore": number 0-10,
  "completenessScore": number 0-10,
  "industryReadinessScore": number 0-10,
  "strengths": string[],
  "weaknesses": string[],
  "missedConcepts": string[],
  "suggestions": string[],
  "idealAnswer": string,
  "recruiterFeedback": string,
  "followUpQuestions": string[]
}

Context:
- Role: {{role}}
- Topic: {{topic}}
- Difficulty: {{difficulty}}
- Interview type: {{interviewType}}

Question:
{{question}}

Candidate answer:
{{combinedAnswer}}`
    }
  ];

  try {
    for (const item of defaults) {
      const exists = await Prompt.exists({ key: item.key });
      if (!exists) {
        await Prompt.create(item);
        console.log(`[AdminSeed] Seeded default prompt: ${item.key}`);
      }
    }
  } catch (err) {
    console.error("[AdminSeed] Failed seeding default prompts:", err.message || err);
  }
};
