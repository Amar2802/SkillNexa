import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  FiCheck,
  FiCreditCard,
  FiGlobe,
  FiLock,
  FiMapPin,
  FiNavigation,
  FiShield,
  FiStar,
  FiX,
  FiZap
} from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "./ToastProvider";
import api from "../../services/api";
import {
  CURRENCY_RATES,
  detectCurrencyFromGeolocation,
  detectCurrencyFromTimezone,
  formatCurrencyAmount
} from "../../utils/locationCurrency";

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
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [locationStatus, setLocationStatus] = useState("");

  // Currency & Plan State
  const [currency, setCurrency] = useState(() => detectCurrencyFromTimezone());
  const [billingCycle, setBillingCycle] = useState("annual"); // "monthly" | "annual"
  
  // Checkout Modal View: "select_plan" | "checkout"
  const [view, setView] = useState("select_plan");

  // Payment details state
  const [paymentMethod, setPaymentMethod] = useState("card"); // "card" | "upi" | "paypal"
  const [cardNumber, setCardNumber] = useState("4242 •••• •••• 4242");
  const [upiId, setUpiId] = useState("user@okaxis");

  useEffect(() => {
    if (isOpen) {
      setView("select_plan");
      const defaultCurr = detectCurrencyFromTimezone();
      setCurrency(defaultCurr);
      setLocationStatus(`Default pricing (${defaultCurr.country})`);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleRequestLocation = async () => {
    try {
      setDetectingLocation(true);
      setLocationStatus("Requesting location permission...");
      const result = await detectCurrencyFromGeolocation();
      setCurrency(result.currency);
      setLocationStatus(`📍 Detected location: ${result.country} (${result.currency.code})`);
      showToast(`Location detected: ${result.country}. Currency set to ${result.currency.symbol} ${result.currency.code}`, "success");
    } catch (err) {
      const fallback = err.currency || detectCurrencyFromTimezone();
      setCurrency(fallback);
      setLocationStatus(`Permission fallback: ${fallback.country}`);
      showToast(err.error || "Location access denied. Used standard timezone currency.", "info");
    } finally {
      setDetectingLocation(false);
    }
  };

  const handleCurrencyChange = (e) => {
    const code = e.target.value;
    const selected = CURRENCY_RATES[code] || CURRENCY_RATES.USD;
    setCurrency(selected);
    setLocationStatus(`Manually selected ${selected.label}`);
  };

  const currentPrice = billingCycle === "annual" ? currency.annualPrice : currency.monthlyPrice;
  const billingIntervalLabel = billingCycle === "annual" ? "/ year" : "/ month";

  const handleCompletePurchase = async () => {
    try {
      setLoading(true);
      const payload = {
        plan: "premium",
        billingCycle,
        currency: currency.code,
        amount: currentPrice,
        paymentMethod
      };

      const { data } = await api.post("/subscription/buy", payload);
      hydrateAuth(data.user);
      showToast(data.message || `Payment Confirmed! Premium Pro (${billingCycle.toUpperCase()}) Activated!`, "success");
      onClose();
    } catch (err) {
      showToast(err?.response?.data?.message || "Payment processing failed. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-md"
          onClick={onClose}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative z-10 w-full max-w-3xl overflow-hidden rounded-3xl border border-slate-700 bg-slate-900 text-white shadow-2xl my-8"
        >
          {/* Header */}
          <div className="relative bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 p-6 sm:p-8">
            <button
              type="button"
              className="absolute right-4 top-4 text-slate-400 hover:text-white cursor-pointer"
              onClick={onClose}
            >
              <FiX className="h-5 w-5" />
            </button>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <PremiumBadge className="mb-2" />
                <h2 className="text-2xl font-extrabold tracking-tight">SkillNexa Premium Pro</h2>
                <p className="mt-1 text-xs text-indigo-200">
                  Unlimited AI mock interviews, custom coding tracks, and detailed radar scorecards.
                </p>
              </div>

              {/* Location Permission & Currency Bar */}
              <div className="space-y-2 text-right">
                <button
                  type="button"
                  onClick={handleRequestLocation}
                  disabled={detectingLocation}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-indigo-400/40 bg-indigo-500/20 px-3 py-1.5 text-xs font-bold text-indigo-200 hover:bg-indigo-500/30 transition cursor-pointer"
                >
                  <FiMapPin className={`h-3.5 w-3.5 text-amber-400 ${detectingLocation ? "animate-spin" : ""}`} />
                  <span>{detectingLocation ? "Detecting..." : "Detect My Location"}</span>
                </button>
                {locationStatus && (
                  <div className="text-[10px] text-indigo-300/80 font-medium">
                    {locationStatus}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Body Section */}
          {view === "select_plan" ? (
            <div className="p-6 sm:p-8 space-y-6 bg-slate-900">
              
              {/* Currency Override & Billing Cycle Toggle */}
              <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-800/50 p-4">
                <div className="flex items-center gap-2">
                  <FiGlobe className="h-4 w-4 text-indigo-400" />
                  <span className="text-xs font-bold text-slate-300">Currency:</span>
                  <select
                    value={currency.code}
                    onChange={handleCurrencyChange}
                    className="rounded-xl border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-bold text-white focus:border-indigo-500 focus:outline-none cursor-pointer"
                  >
                    {Object.values(CURRENCY_RATES).map((curr) => (
                      <option key={curr.code} value={curr.code}>
                        {curr.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Billing Cycle Switch */}
                <div className="flex items-center rounded-xl bg-slate-900 p-1 border border-slate-700">
                  <button
                    type="button"
                    onClick={() => setBillingCycle("monthly")}
                    className={`rounded-lg px-3 py-1 text-xs font-bold transition cursor-pointer ${
                      billingCycle === "monthly"
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    Monthly
                  </button>
                  <button
                    type="button"
                    onClick={() => setBillingCycle("annual")}
                    className={`rounded-lg px-3 py-1 text-xs font-bold transition cursor-pointer flex items-center gap-1 ${
                      billingCycle === "annual"
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <span>Annual</span>
                    <span className="rounded-md bg-amber-500 px-1.5 py-0.2 text-[9px] font-black text-slate-950">
                      Save 33%
                    </span>
                  </button>
                </div>
              </div>

              {/* Pricing Cards */}
              <div className="grid gap-6 md:grid-cols-2">
                {/* Free Tier */}
                <div className="rounded-2xl border border-slate-800 bg-slate-800/40 p-5 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold uppercase text-slate-400">Free Tier</span>
                    <span className="text-xs font-bold text-slate-400">{currency.symbol}0 / forever</span>
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
                <div className="rounded-2xl border-2 border-indigo-500 bg-indigo-950/40 p-5 space-y-4 relative shadow-xl shadow-indigo-950/50">
                  <div className="absolute -top-3 right-4 rounded-full bg-gradient-to-r from-amber-500 to-indigo-600 px-3 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-white shadow-md">
                    POPULAR CHOICE
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-extrabold uppercase text-indigo-300">Premium Pro</span>
                    <div className="text-right">
                      <span className="text-2xl font-black text-white">{currency.symbol}{currentPrice}</span>
                      <span className="text-xs text-indigo-300 font-semibold">{billingIntervalLabel}</span>
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
                    onClick={() => setView("checkout")}
                    className="w-full snx-btn-primary bg-gradient-to-r from-indigo-500 via-purple-500 to-amber-500 text-white font-extrabold shadow-lg hover:brightness-110 cursor-pointer text-xs py-3"
                  >
                    <span>Proceed to Purchase ({currency.symbol}{currentPrice})</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Checkout View */
            <div className="p-6 sm:p-8 space-y-6 bg-slate-900">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-white">Payment Checkout</h3>
                  <p className="text-xs text-slate-400">Complete your subscription order securely.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setView("select_plan")}
                  className="text-xs text-indigo-400 hover:underline font-bold cursor-pointer"
                >
                  ← Back to Plans
                </button>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {/* Payment Methods */}
                <div className="space-y-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Select Payment Method</span>
                  <div className="grid gap-3">
                    {[
                      { id: "card", title: "Credit / Debit Card", icon: FiCreditCard },
                      { id: "upi", title: "UPI / GPay / PhonePe", icon: FiZap },
                      { id: "paypal", title: "PayPal / Apple Pay", icon: FiShield }
                    ].map((method) => (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => setPaymentMethod(method.id)}
                        className={`flex items-center gap-3 rounded-2xl border p-3.5 text-xs font-bold transition cursor-pointer ${
                          paymentMethod === method.id
                            ? "border-indigo-500 bg-indigo-950/40 text-white ring-2 ring-indigo-500/30"
                            : "border-slate-800 bg-slate-800/30 text-slate-400 hover:border-slate-700 hover:text-white"
                        }`}
                      >
                        <method.icon className="h-4 w-4 text-indigo-400" />
                        <span>{method.title}</span>
                      </button>
                    ))}
                  </div>

                  {paymentMethod === "card" && (
                    <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-800/30 p-4">
                      <label className="block space-y-1">
                        <span className="text-[11px] font-bold text-slate-400">Card Number</span>
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          className="snx-input text-xs"
                        />
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <label className="block space-y-1">
                          <span className="text-[11px] font-bold text-slate-400">Expiry</span>
                          <input type="text" defaultValue="12/28" className="snx-input text-xs" />
                        </label>
                        <label className="block space-y-1">
                          <span className="text-[11px] font-bold text-slate-400">CVC</span>
                          <input type="text" defaultValue="888" className="snx-input text-xs" />
                        </label>
                      </div>
                    </div>
                  )}

                  {paymentMethod === "upi" && (
                    <div className="space-y-2 rounded-2xl border border-slate-800 bg-slate-800/30 p-4">
                      <label className="block space-y-1">
                        <span className="text-[11px] font-bold text-slate-400">VPA / UPI ID</span>
                        <input
                          type="text"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          className="snx-input text-xs"
                          placeholder="username@upi"
                        />
                      </label>
                    </div>
                  )}
                </div>

                {/* Order Summary */}
                <div className="rounded-2xl border border-slate-800 bg-slate-800/50 p-5 space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Order Summary</span>
                    <div className="space-y-2 text-xs border-b border-slate-700/80 pb-3">
                      <div className="flex justify-between font-bold text-white">
                        <span>SkillNexa Premium Pro ({billingCycle.toUpperCase()})</span>
                        <span>{currency.symbol}{currentPrice}</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>Billing Region</span>
                        <span>{currency.country} ({currency.code})</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>Estimated Taxes</span>
                        <span className="text-emerald-400">Included</span>
                      </div>
                    </div>

                    <div className="flex justify-between text-base font-extrabold text-white pt-1">
                      <span>Total Amount</span>
                      <span className="text-indigo-400">{currency.symbol}{currentPrice}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleCompletePurchase}
                    disabled={loading}
                    className="w-full snx-btn-primary bg-gradient-to-r from-emerald-500 via-indigo-600 to-purple-600 text-white font-extrabold shadow-xl hover:brightness-110 cursor-pointer text-xs py-3.5 mt-4"
                  >
                    <FiZap className="h-4 w-4" />
                    <span>{loading ? "Processing Payment..." : `Pay ${currency.symbol}${currentPrice} & Activate`}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
