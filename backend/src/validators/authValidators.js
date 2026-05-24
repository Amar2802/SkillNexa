import { body } from "express-validator";

const emailRule = body("email")
  .trim()
  .normalizeEmail({ gmail_remove_dots: false })
  .isEmail()
  .withMessage("A valid email address is required");

const passwordRule = body("password")
  .isLength({ min: 6 })
  .withMessage("Password must be at least 6 characters long");

const rememberMeRule = body("rememberMe")
  .optional()
  .isBoolean()
  .withMessage("Remember me must be a boolean value");

export const signupValidator = [
  body("name").trim().isLength({ min: 2, max: 80 }).withMessage("Full name must be between 2 and 80 characters"),
  emailRule,
  passwordRule,
  rememberMeRule
];

export const loginValidator = [
  emailRule,
  body("password").notEmpty().withMessage("Password is required"),
  rememberMeRule
];

export const forgotPasswordValidator = [emailRule];

export const resetPasswordValidator = [
  emailRule,
  body("otp").trim().matches(/^\d{6}$/).withMessage("OTP must be a 6-digit code"),
  passwordRule
];
