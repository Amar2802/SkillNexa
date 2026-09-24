import User from "../models/User.js";
import { toSafeUser } from "../utils/auth.js";

export const getSubscriptionStatus = async (req, res) => {
  const user = req.user;
  const subscription = user.subscription || { plan: "free", status: "active", startDate: user.createdAt || new Date() };

  res.json({
    subscription,
    user: toSafeUser(user)
  });
};

export const upgradeSubscription = async (req, res) => {
  const user = req.user;
  const { plan = "premium", durationMonths = 12 } = req.body;

  const startDate = new Date();
  const endDate = new Date(startDate);
  endDate.setMonth(endDate.getMonth() + Number(durationMonths));

  user.subscription = {
    plan: plan === "premium" ? "premium" : "free",
    status: "active",
    startDate,
    endDate
  };

  await user.save();

  console.info("[Subscription] Plan upgraded successfully", {
    userId: String(user._id),
    email: user.email,
    plan: user.subscription.plan,
    endDate: user.subscription.endDate
  });

  res.json({
    message: `Successfully upgraded to ${user.subscription.plan.toUpperCase()} plan!`,
    user: toSafeUser(user)
  });
};

export const cancelSubscription = async (req, res) => {
  const user = req.user;

  user.subscription = {
    plan: "free",
    status: "cancelled",
    startDate: user.subscription?.startDate || new Date(),
    endDate: new Date()
  };

  await user.save();

  console.info("[Subscription] Plan cancelled", {
    userId: String(user._id),
    email: user.email
  });

  res.json({
    message: "Subscription cancelled. Your account has been reverted to the Free plan.",
    user: toSafeUser(user)
  });
};
