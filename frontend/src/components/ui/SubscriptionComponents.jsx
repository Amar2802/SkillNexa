import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiCheck, FiLock, FiStar, FiZap, FiX } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "./ToastProvider";
import api from "../../services/api";

export const PremiumBadge = ({ className = "" }) => (
  <span className={`inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-500 via-purple-500 to-indigo-600 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-white shadow-sm ${className}`}>
    <FiStar className="h-3 w-3 fill-white text-white animate-pulse" />
    <span>PREMIUM</span>
  </span>
);

export const SubscriptionLockBanner = ({
  title = "Premium Feature Locked",
  description = "Unlock unlimited AI-powered mock interviews, detailed radar evaluations, and company-specific coding tracks.",
  featureKey = "ADVANCED_AI_INTERVIEW",
  onUpgradeClick
}) => {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-indigo-200/80 bg-gradient-to-br from-indigo-900/90 via-slate-900 to-purple-950 p-6 sm:p-8 text-white shadow-xl">
      <div className="absolute right-0 top-0 -mr-12 -mt-12 h-48 w-48 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
      <div className="relative z-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2">
            <PremiumBadge />
            <span className="text-xs font-semibold text-indigo-300">Exclusive Content</span>
          </div>
          <h3 className="text-xl font-extrabold tracking-tight text-white">{title}</h3>
          <p className="text-xs text-slate-300 leading-relaxed font-medium">{description}</p>
        </div>

        <button
          type="button"
          onClick={onUpgradeClick}
          className="snx-btn-primary bg-gradient-to-r from-indigo-500 via-purple-500 to-amber-500 text-white hover:brightness-110 shadow-lg font-bold shrink-0 cursor-pointer"
        >
          <FiZap className="h-4 w-4" />
          <span>Upgrade to Premium</span>
        </button>
      </div>
    </div>
  );
};

export const UpgradeModal = ({ isOpen, onClose }) => {
  const { hydrateAuth } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleUpgrade = async () => {
    try {
      setLoading(true);
      const { data } = await api.post("/subscription/upgrade", { plan: "premium", durationMonths: 12 });
      hydrateAuth(data.user);
      showToast(data.message || "Upgraded to Premium Pro successfully!", "success");
      onClose();
    } catch (err) {
      showToast(err?.response?.data?.message || "Unable to upgrade right now.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
          onClick={onClose}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative z-10 w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-700 bg-slate-900 text-white shadow-2xl"
        >
          {/* Header */}
          <div className="relative bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 p-6 sm:p-8">
            <button
              type="button"
              className="absolute right-4 top-4 text-slate-400 hover:text-white"
              onClick={onClose}
            >
              <FiX className="h-5 w-5" />
            </button>
            <PremiumBadge className="mb-3" />
            <h2 className="text-2xl font-extrabold tracking-tight">Unlock SkillNexa Premium Pro</h2>
            <p className="mt-1 text-xs text-indigo-200">
              Get full unlimited access to live AI interview simulations, custom coding questions, and deep performance radar analytics.
            </p>
          </div>

          {/* Pricing Grid */}
          <div className="grid gap-6 p-6 sm:p-8 md:grid-cols-2 bg-slate-900">
            {/* Free Tier */}
            <div className="rounded-2xl border border-slate-800 bg-slate-800/40 p-5 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold uppercase text-slate-400">Free Tier</span>
                <span className="text-xs font-bold text-slate-400">$0 / forever</span>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-300">
                <li className="flex items-center gap-2"><FiCheck className="text-emerald-400 h-4 w-4" /> Basic Question Bank Access</li>
                <li className="flex items-center gap-2"><FiCheck className="text-emerald-400 h-4 w-4" /> Standard Monaco Coding IDE</li>
                <li className="flex items-center gap-2"><FiCheck className="text-emerald-400 h-4 w-4" /> Basic Flashcard Revision</li>
                <li className="flex items-center gap-2 text-slate-500"><FiLock className="h-3.5 w-3.5" /> Limited AI Mock Interviews</li>
                <li className="flex items-center gap-2 text-slate-500"><FiLock className="h-3.5 w-3.5" /> Standard Evaluation Reports</li>
              </ul>
            </div>

            {/* Premium Pro Tier */}
            <div className="rounded-2xl border-2 border-indigo-500 bg-indigo-950/30 p-5 space-y-4 relative">
              <div className="absolute -top-3 right-4 rounded-full bg-indigo-600 px-3 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-white shadow-md">
                RECOMMENDED
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-extrabold uppercase text-indigo-300">Premium Pro</span>
                <div className="text-right">
                  <span className="text-lg font-black text-white">$19</span>
                  <span className="text-[10px] text-indigo-300"> / month</span>
                </div>
              </div>
              <ul className="space-y-2.5 text-xs text-slate-200 font-medium">
                <li className="flex items-center gap-2"><FiCheck className="text-amber-400 h-4 w-4" /> Unlimited AI Video & Voice Interviews</li>
                <li className="flex items-center gap-2"><FiCheck className="text-amber-400 h-4 w-4" /> Deep Radar Evaluation & Feedback</li>
                <li className="flex items-center gap-2"><FiCheck className="text-amber-400 h-4 w-4" /> Top Company Mock Test Tracks</li>
                <li className="flex items-center gap-2"><FiCheck className="text-amber-400 h-4 w-4" /> Advanced Solution Complexity Analysis</li>
                <li className="flex items-center gap-2"><FiCheck className="text-amber-400 h-4 w-4" /> Priority AI Response Times</li>
              </ul>
              <button
                type="button"
                onClick={handleUpgrade}
                disabled={loading}
                className="w-full snx-btn-primary bg-gradient-to-r from-indigo-500 via-purple-500 to-amber-500 text-white font-extrabold shadow-lg hover:brightness-110 cursor-pointer text-xs"
              >
                {loading ? "Activating Premium..." : "Upgrade Now (1-Click Test)"}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
