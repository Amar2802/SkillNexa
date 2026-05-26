import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiAlertCircle, FiCheckCircle, FiInfo, FiX } from "react-icons/fi";

const ToastContext = createContext(null);

const toneMap = {
  info: {
    icon: FiInfo,
    className: "border-sky-200/80 bg-sky-50/95 text-sky-900"
  },
  success: {
    icon: FiCheckCircle,
    className: "border-emerald-200/80 bg-emerald-50/95 text-emerald-900"
  },
  error: {
    icon: FiAlertCircle,
    className: "border-rose-200/80 bg-rose-50/95 text-rose-900"
  }
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const dismissToast = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback((message, tone = "info") => {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    setToasts((current) => [...current, { id, message, tone }]);
    window.setTimeout(() => dismissToast(id), 3400);
  }, [dismissToast]);

  const value = useMemo(() => ({ showToast, dismissToast }), [dismissToast, showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed right-4 top-4 z-[70] flex w-full max-w-sm flex-col gap-3">
        <AnimatePresence>
          {toasts.map((toast) => {
            const tone = toneMap[toast.tone] || toneMap.info;
            const Icon = tone.icon;
            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, y: -14, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.96 }}
                className={`pointer-events-auto rounded-3xl border px-4 py-4 shadow-[0_20px_50px_rgba(15,23,42,0.12)] backdrop-blur-xl ${tone.className}`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 rounded-2xl bg-white/70 p-2">
                    <Icon className="h-4 w-4" />
                  </div>
                  <p className="flex-1 text-sm font-medium leading-6">{toast.message}</p>
                  <button
                    type="button"
                    className="rounded-full p-1 text-current/70 transition hover:bg-white/60 hover:text-current"
                    onClick={() => dismissToast(toast.id)}
                    aria-label="Dismiss notification"
                  >
                    <FiX className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used inside ToastProvider");
  }
  return context;
};
