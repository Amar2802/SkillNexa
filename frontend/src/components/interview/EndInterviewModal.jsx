import { FiAlertTriangle } from "react-icons/fi";
import Modal from "../ui/Modal";
import Button from "../ui/Button";

export const EndInterviewModal = ({
  isOpen,
  onClose,
  onConfirmEnd,
  totalQuestions = 0,
  answeredCount = 0
}) => {
  const unansweredCount = Math.max(0, totalQuestions - answeredCount);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="End Interview Early?"
      size="sm"
    >
      <div className="space-y-4">
        <div className="flex items-start gap-3 p-3.5 rounded-xl border border-amber-500/20 bg-amber-50/50 dark:bg-amber-950/20 text-xs text-amber-900 dark:text-amber-200">
          <FiAlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-bold">Are you sure you want to exit?</p>
            <p className="text-slate-600 dark:text-slate-400">
              You have completed <strong>{answeredCount}</strong> of <strong>{totalQuestions}</strong> questions.
              {unansweredCount > 0 && ` Leaving now will leave ${unansweredCount} question(s) unassessed.`}
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400">
          If you end now, you can still generate a partial performance report based on your evaluated responses.
        </p>

        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[var(--snx-border)]">
          <Button variant="outline" size="sm" onClick={onClose}>
            Continue Interview
          </Button>
          <Button variant="danger" size="sm" onClick={onConfirmEnd}>
            End & Compile Report
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default EndInterviewModal;
