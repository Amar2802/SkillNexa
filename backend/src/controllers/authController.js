import bcrypt from "bcryptjs";
import passport from "passport";
import User from "../models/User.js";
import { tokenFor } from "../utils/auth.js";
import { FIELD_DEFAULT_TOPICS, FIELD_OPTIONS } from "../utils/prepFields.js";

const normalizeTargetField = (value) => (FIELD_OPTIONS.includes(value) ? value : "Software");

export const signup = async (req, res) => {
  const { name, email, password, targetField } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (await User.findOne({ email })) {
    return res.status(400).json({ message: "User already exists" });
  }

  const safeField = normalizeTargetField(targetField);

  const user = await User.create({
    name,
    email,
    password,
    targetField: safeField,
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

  res.json({ token: tokenFor(user._id), user });
};

export const googleAuth = passport.authenticate("google", {
  scope: ["profile", "email"],
  session: false
});

export const googleCallback = [
  passport.authenticate("google", { session: false, failureRedirect: "/" }),
  (req, res) => {
    const token = tokenFor(req.user._id);
    res.redirect(`${process.env.CLIENT_URL || "http://localhost:5173"}/oauth-success?token=${token}`);
  }
];
