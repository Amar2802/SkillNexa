import { FiAlertTriangle, FiCheckCircle, FiClock, FiHelpCircle } from "react-icons/fi";
import Modal from "../ui/Modal";
import Button from "../ui/Button";

export const SubmitConfirmationModal = ({
  isOpen,
  onClose,
  onSubmit,
  totalQuestions = 0,
  answeredCount = 0,
  flaggedCount = 0,
  submitting = false
}) => {
  const unansweredCount = Math.max(0, totalQuestions - answeredCount);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Submit Mock Test?"
      description="Review your assessment completion summary before final grading."
      maxWidth="max-w-md"
      footer={
        <div className="flex items-center justify-end gap-2.5 w-full">
          <Button variant="ghost" size="sm" onClick={onClose} disabled={submitting}>
            Continue Test
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={onSubmit}
            loading={submitting}
          >
            Confirm & Submit
          </Button>
        </div>
      }
    >
      <div className="space-y-4 text-xs">
        {unansweredCount > 0 && (
          <div className="flex items-start gap-2.5 p-3 rounded-lg border border-amber-500/30 bg-amber-50/50 text-amber-800 dark:border-amber-900/40 dark:bg-amber-950/20 dark:text-amber-200">
            <FiAlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-amber-600" />
            <div>
              <strong className="block font-semibold">
                You have {unansweredCount} unanswered {unansweredCount === 1 ? "question" : "questions"}.
              </strong>
              <span>Unanswered questions will receive 0 points.</span>
            </div>
          </div>
        )}

        {/* Breakdown Summary */}
        <div className="grid grid-cols-3 gap-2.5 p-3 rounded-lg border border-[var(--snx-border)] bg-[var(--snx-surface-subtle)] text-center dark:border-slate-800">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Answered</span>
            <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 block">
              {answeredCount}
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Review</span>
            <span className="text-lg font-bold text-amber-600 dark:text-amber-400 mt-0.5 block">
              {flaggedCount}
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Unanswered</span>
            <span className="text-lg font-bold text-rose-600 dark:text-rose-400 mt-0.5 block">
              {unansweredCount}
            </span>
          </div>
        </div>

        <p className="text-slate-500 text-[11px] leading-relaxed">
          Once submitted, your responses will be evaluated, accuracy calculated, and deep AI evaluation performed.
        </p>
      </div>
    </Modal>
  );
};

export default SubmitConfirmationModal;
