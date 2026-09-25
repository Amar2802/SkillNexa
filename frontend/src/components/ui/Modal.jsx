import { useEffect, useRef } from "react";
import { FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

export const Modal = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  maxWidth = "max-w-lg",
  showClose = true
}) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.setAttribute("data-overlay", "true");
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.removeAttribute("data-overlay");
    }

    return () => {
      document.body.removeAttribute("data-overlay");
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Modal Card */}
          <motion.div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? "modal-title" : undefined}
            aria-describedby={description ? "modal-description" : undefined}
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className={`relative z-10 w-full ${maxWidth} rounded-xl border border-[var(--snx-border)] bg-[var(--snx-surface-elevated)] p-5 sm:p-6 shadow-dropdown dark:border-slate-800`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                {title && (
                  <h3 id="modal-title" className="text-base font-semibold text-slate-900 dark:text-white">
                    {title}
                  </h3>
                )}
                {description && (
                  <p id="modal-description" className="text-xs text-slate-500 dark:text-slate-400">
                    {description}
                  </p>
                )}
              </div>

              {showClose && (
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition dark:hover:bg-slate-800 dark:hover:text-slate-200"
                  aria-label="Close modal"
                >
                  <FiX className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="mt-4 text-sm text-slate-700 dark:text-slate-300">
              {children}
            </div>

            {footer && (
              <div className="mt-6 flex items-center justify-end gap-2.5 pt-4 border-t border-[var(--snx-border-subtle)] dark:border-slate-800">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
