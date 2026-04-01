import bcrypt from "bcryptjs";
import passport from "passport";
import User from "../models/User.js";
import { tokenFor } from "../utils/auth.js";
import { FIELD_DEFAULT_TOPICS, FIELD_OPTIONS } from "../utils/prepFields.js";

const normalizeTargetField = (value) => (FIELD_OPTIONS.includes(value) ? value : "Software");

const sanitizeInterests = (interests) => {
  if (!Array.isArray(interests)) return [];
  return interests.map((item) => String(item).trim()).filter(Boolean).slice(0, 12);
};

export const signup = async (req, res) => {
  const { name, email, password, targetField, interests } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (await User.findOne({ email })) {
    return res.status(400).json({ message: "User already exists" });
  }

  const safeField = normalizeTargetField(targetField);
  const safeInterests = sanitizeInterests(interests);

  const user = await User.create({
    name,
    email,
    password,
    targetField: safeField,
    interests: safeInterests,
    progress: {
      testsTaken: 0,
      accuracy: 0,
      weakTopics: [],
      recommendedTopics: FIELD_DEFAULT_TOPICS[safeField] || FIELD_DEFAULT_TOPICS.Software
    }
  });

  res.status(201).json({ token: tokenFor(user._id), user });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !user.password || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const safeField = normalizeTargetField(user.targetField);
  if (user.targetField !== safeField) {
    user.targetField = safeField;
    user.progress = {
      ...(user.progress || {}),
      recommendedTopics: FIELD_DEFAULT_TOPICS[safeField] || FIELD_DEFAULT_TOPICS.Software
    };
    await user.save();
  }

  res.json({ token: tokenFor(user._id), user });
};

export const googleAuth = (req, res, next) => {
  const safeField = normalizeTargetField(req.query.targetField);
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
    state: safeField
  })(req, res, next);
};

export const googleCallback = [
  passport.authenticate("google", { session: false, failureRedirect: "/" }),
  (req, res) => {
    const token = tokenFor(req.user._id);
    res.redirect(`${process.env.CLIENT_URL || "http://localhost:5173"}/oauth-success?token=${token}`);
  }
];

