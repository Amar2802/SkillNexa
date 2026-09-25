import { FiClock, FiHelpCircle, FiCheckCircle, FiAlertCircle, FiArrowRight } from "react-icons/fi";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import Badge from "../ui/Badge";

export const TestInstructionsModal = ({
  isOpen,
  onClose,
  test,
  onStart,
  loading = false
}) => {
  if (!test) return null;

  const questionsCount = test.sections
    ? test.sections.flatMap((s) => s.questions).length
    : test.questionsCount || 30;

  const durationMinutes = test.duration || 30;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={test.title || "Software Interview Mock Test"}
      description="Review instructions before your timed interview session begins."
      maxWidth="max-w-xl"
      footer={
        <div className="flex items-center justify-end gap-3 w-full">
          <Button variant="ghost" size="sm" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={onStart}
            loading={loading}
            iconRight={FiArrowRight}
          >
            Start Test Now
          </Button>
        </div>
      }
    >
      <div className="space-y-4 text-xs">
        {/* Quick Metrics */}
        <div className="grid grid-cols-3 gap-3 p-3 rounded-lg border border-[var(--snx-border)] bg-[var(--snx-surface-subtle)] text-center dark:border-slate-800">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Duration</span>
            <span className="text-base font-bold text-slate-900 dark:text-white mt-0.5 block">
              {durationMinutes} mins
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Questions</span>
            <span className="text-base font-bold text-slate-900 dark:text-white mt-0.5 block">
              {questionsCount} Qs
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Pacing</span>
            <span className="text-base font-bold text-indigo-600 dark:text-indigo-400 mt-0.5 block">
              ~1 min/Q
            </span>
          </div>
        </div>

        {/* Test Rules List */}
        <div className="space-y-2.5">
          <h4 className="font-semibold text-slate-800 dark:text-slate-200 uppercase text-[11px] tracking-wide">
            Test Guidelines & Pacing
          </h4>
          <ul className="space-y-2 text-slate-600 dark:text-slate-300">
            <li className="flex items-start gap-2">
              <FiClock className="h-4 w-4 text-indigo-500 shrink-0 mt-0.5" />
              <span>
                <strong>Timer begins immediately:</strong> The countdown starts as soon as you click "Start Test Now".
              </span>
            </li>
            <li className="flex items-start gap-2">
              <FiCheckCircle className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>
                <strong>Answer Auto-Saving:</strong> Your selections are saved in real-time as you navigate between questions.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <FiHelpCircle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
              <span>
                <strong>Mark for Review:</strong> Flag tricky questions to revisit them before final submission.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <FiAlertCircle className="h-4 w-4 text-rose-500 shrink-0 mt-0.5" />
              <span>
                <strong>Auto-Submit on Zero:</strong> If the timer expires, the test automatically submits your current progress.
              </span>
            </li>
          </ul>
        </div>
      </div>
    </Modal>
  );
};

export default TestInstructionsModal;
