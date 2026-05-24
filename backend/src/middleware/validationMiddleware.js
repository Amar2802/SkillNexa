import { validationResult } from "express-validator";

export const validateRequest = (req, _res, next) => {
  const result = validationResult(req);
  if (result.isEmpty()) return next();

  return next({
    statusCode: 422,
    code: "VALIDATION_ERROR",
    message: result.array()[0]?.msg || "Invalid request payload"
  });
};
