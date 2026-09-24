export const FEATURE_PERMISSIONS = {
  BASIC_PRACTICE: "free",
  QUESTION_BANK: "free",
  ROADMAPS: "free",
  REVISION_FLASHCARDS: "free",
  BASIC_AI_INTERVIEW: "free",
  ADVANCED_AI_INTERVIEW: "premium",
  UNLIMITED_AI_EVALUATION: "premium",
  ADVANCED_ANALYTICS: "premium",
  COMPANY_MOCK_TESTS: "premium",
  PREMIUM_QUESTIONS: "premium"
};

/**
 * Reusable authorization check for frontend feature entitlement UX.
 * Note: Real security is enforced independently on the backend server.
 */
export const hasFeatureAccess = (user, featureKey) => {
  const normalizedKey = String(featureKey || "").toUpperCase().replace(/[- ]/g, "_");
  const requiredPlan = FEATURE_PERMISSIONS[normalizedKey] || FEATURE_PERMISSIONS[featureKey] || "free";

  if (requiredPlan === "free") {
    return true;
  }

  const sub = user?.subscription || { plan: "free", status: "active" };
  const plan = String(sub.plan || "free").toLowerCase();
  const status = String(sub.status || "active").toLowerCase();

  const isExpired = sub.endDate && new Date(sub.endDate).getTime() < Date.now();

  return plan === "premium" && status === "active" && !isExpired;
};

export const getSubscriptionInfo = (user) => {
  const sub = user?.subscription || { plan: "free", status: "active" };
  const isPremium = hasFeatureAccess(user, "ADVANCED_AI_INTERVIEW");

  return {
    plan: isPremium ? "premium" : "free",
    status: sub.status || "active",
    isPremium,
    startDate: sub.startDate ? new Date(sub.startDate) : null,
    endDate: sub.endDate ? new Date(sub.endDate) : null
  };
};
