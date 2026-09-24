export const requireSubscription = (featureKey) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required", code: "AUTH_REQUIRED" });
    }

    const sub = req.user.subscription || { plan: "free", status: "active" };
    const plan = sub.plan || "free";
    const status = sub.status || "active";

    // If subscription has an endDate in the past, consider it expired
    const isExpired = sub.endDate && new Date(sub.endDate).getTime() < Date.now();
    const isActivePremium = plan === "premium" && status === "active" && !isExpired;

    if (!isActivePremium) {
      console.warn(`[Subscription] Access denied for feature '${featureKey}'`, {
        userId: String(req.user._id),
        email: req.user.email,
        plan,
        status,
        isExpired
      });

      return res.status(403).json({
        message: "Premium subscription required for this feature",
        code: "SUBSCRIPTION_PREMIUM_REQUIRED",
        feature: featureKey
      });
    }

    next();
  };
};
