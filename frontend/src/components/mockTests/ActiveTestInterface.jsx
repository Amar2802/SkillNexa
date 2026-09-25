import { useState, useMemo } from "react";
import { FiClock, FiChevronLeft, FiChevronRight, FiBookmark, FiSend, FiGrid, FiCheck } from "react-icons/fi";
import QuestionNavigator from "./QuestionNavigator";
import SubmitConfirmationModal from "./SubmitConfirmationModal";
import Badge from "../ui/Badge";
import Button from "../ui/Button";

const formatTimer = (seconds) => {
  const mins = Math.floor(seconds / 60).toString().padStart(2, "0");
  const secs = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${mins}:${secs}`;
};

export const ActiveTestInterface = ({
  test,
  remainingSeconds,
  answers = {},
  onAnswerChange,
  onSubmit,
  submitting = false
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flaggedIds, setFlaggedIds] = useState(new Set());
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const flatQuestions = useMemo(() => {
    if (!test?.sections) return [];
    return test.sections.flatMap((section) => section.questions);
  }, [test]);

  const currentQuestion = flatQuestions[currentIndex] || null;
  const isFlagged = currentQuestion ? flaggedIds.has(String(currentQuestion._id)) : false;

  const toggleFlagCurrent = () => {
    if (!currentQuestion) return;
    const id = String(currentQuestion._id);
    setFlaggedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const answeredCount = Object.keys(answers).filter((id) => String(answers[id] || "").trim()).length;

  // Timer urgency
  const isCritical = remainingSeconds <= 60;
  const isWarning = remainingSeconds <= 300 && !isCritical;

  if (!test || !currentQuestion) return null;

  return (
    <div className="flex flex-col h-[calc(100vh-5.5rem)] rounded-xl border border-[var(--snx-border)] bg-[var(--snx-surface)] overflow-hidden shadow-subtle dark:border-slate-800">
      {/* 1. Test Header Bar */}
      <header className="flex items-center justify-between px-4 py-2.5 border-b border-[var(--snx-border)] bg-[var(--snx-surface)] dark:border-slate-800 z-10">
        <div className="flex items-center gap-3 min-w-0">
          <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate">
            {test.title || "Mock Test"}
          </h2>
          <span className="hidden sm:inline-block text-xs font-mono text-slate-400">
            Question {currentIndex + 1} of {flatQuestions.length}
          </span>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          {/* Timer Display */}
          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border font-mono text-xs font-bold transition select-none ${
              isCritical
                ? "border-rose-500 bg-rose-50 text-rose-600 animate-pulse dark:bg-rose-950/50 dark:text-rose-300"
                : isWarning
                ? "border-amber-500 bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300"
                : "border-[var(--snx-border)] bg-[var(--snx-surface-subtle)] text-slate-700 dark:border-slate-800 dark:text-slate-200"
            }`}
          >
            <FiClock className={`h-3.5 w-3.5 ${isCritical ? "text-rose-500" : isWarning ? "text-amber-500" : "text-slate-400"}`} />
            <span>{formatTimer(remainingSeconds)}</span>
          </div>

          {/* Mobile Navigator Button */}
          <button
            type="button"
            onClick={() => setMobileNavOpen(true)}
            className="flex lg:hidden items-center gap-1 h-8 px-2.5 rounded-lg border border-[var(--snx-border)] text-xs font-medium text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <FiGrid className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Questions</span>
          </button>

          {/* Submit Action */}
          <Button
            variant="primary"
            size="sm"
            onClick={() => setSubmitModalOpen(true)}
            iconRight={FiSend}
            disabled={submitting}
          >
            Submit Test
          </Button>
        </div>
      </header>

      {/* 2. Main Question & Navigation Workspace */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_260px] overflow-hidden">
        {/* Left: Active Question Area */}
        <div className="flex flex-col h-full overflow-hidden">
          <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6 snx-scrollbar">
            {/* Question Header & Meta */}
            <div className="space-y-3 pb-4 border-b border-[var(--snx-border-subtle)] dark:border-slate-800">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                  Question {currentIndex + 1}
                </span>

                <div className="flex items-center gap-2">
                  {currentQuestion.difficulty && (
                    <Badge difficulty={currentQuestion.difficulty} size="sm" />
                  )}
                  {currentQuestion.category && (
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {currentQuestion.category}
                    </span>
                  )}
                  {currentQuestion.topic && (
                    <span className="text-xs font-mono text-slate-400">
                      • {currentQuestion.topic}
                    </span>
                  )}
                </div>
              </div>

              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug">
                {currentQuestion.title.replace(/\s+Practice Variant\s+\d+$/i, "")}
              </h3>

              {currentQuestion.description && (
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                  {String(currentQuestion.description).replace(/\s*Practice focus\s*\d*:\s*.+$/i, "").trim()}
                </p>
              )}
            </div>

            {/* Answer Options */}
            <div className="space-y-4">
              {currentQuestion.type === "MCQ" ? (
                <div className="space-y-2.5 max-w-2xl">
                  {(currentQuestion.options || []).map((option, optIdx) => {
                    const isSelected = answers[currentQuestion._id] === option;
                    const letter = String.fromCharCode(65 + optIdx);

                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => onAnswerChange(currentQuestion._id, option)}
                        className={`w-full p-3.5 rounded-xl border text-left text-xs sm:text-sm font-medium transition duration-150 flex items-center justify-between select-none ${
                          isSelected
                            ? "border-indigo-600 bg-indigo-50/70 text-indigo-950 dark:bg-indigo-950/40 dark:text-indigo-200 shadow-subtle ring-1 ring-indigo-500/20"
                            : "border-[var(--snx-border)] bg-[var(--snx-surface)] text-slate-800 hover:border-slate-300 hover:bg-slate-50/50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800/40"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md font-mono text-xs font-bold ${
                              isSelected
                                ? "bg-indigo-600 text-white"
                                : "bg-[var(--snx-surface-subtle)] text-slate-500 dark:bg-slate-800"
                            }`}
                          >
                            {letter}
                          </span>
                          <span>{option}</span>
                        </div>
                        {isSelected && <FiCheck className="h-4 w-4 text-indigo-600 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="space-y-2 max-w-3xl">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wide block">
                    {currentQuestion.type === "Coding" ? "Write Solution / Code" : "Your Answer Explanation"}
                  </label>
                  <textarea
                    value={answers[currentQuestion._id] || ""}
                    onChange={(e) => onAnswerChange(currentQuestion._id, e.target.value)}
                    placeholder={
                      currentQuestion.type === "Coding"
                        ? "Write your implementation or algorithm approach here..."
                        : "Type your detailed technical explanation here..."
                    }
                    className="w-full h-44 rounded-xl border border-[var(--snx-border)] bg-[var(--snx-surface)] p-3 text-xs sm:text-sm font-mono text-slate-800 outline-none focus:border-indigo-500 transition dark:border-slate-800 dark:text-slate-200"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Bottom Action / Step Bar */}
          <footer className="flex items-center justify-between px-4 py-3 border-t border-[var(--snx-border)] bg-[var(--snx-surface-subtle)] dark:border-slate-800 z-10">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setCurrentIndex((idx) => Math.max(0, idx - 1))}
              disabled={currentIndex <= 0}
              icon={FiChevronLeft}
            >
              Previous
            </Button>

            <button
              type="button"
              onClick={toggleFlagCurrent}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition select-none ${
                isFlagged
                  ? "border-amber-500 bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300"
                  : "border-[var(--snx-border)] bg-[var(--snx-surface)] text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
              }`}
            >
              <FiBookmark className={`h-3.5 w-3.5 ${isFlagged ? "fill-current" : ""}`} />
              <span>{isFlagged ? "Marked for Review" : "Mark for Review"}</span>
            </button>

            {currentIndex < flatQuestions.length - 1 ? (
              <Button
                variant="primary"
                size="sm"
                onClick={() => setCurrentIndex((idx) => Math.min(flatQuestions.length - 1, idx + 1))}
                iconRight={FiChevronRight}
              >
                Next
              </Button>
            ) : (
              <Button
                variant="primary"
                size="sm"
                onClick={() => setSubmitModalOpen(true)}
                iconRight={FiSend}
              >
                Finish Test
              </Button>
            )}
          </footer>
        </div>

        {/* Right: Desktop Question Navigator Column */}
        <div className="hidden lg:block h-full overflow-hidden">
          <QuestionNavigator
            questions={flatQuestions}
            currentIndex={currentIndex}
            onSelectQuestion={(idx) => setCurrentIndex(idx)}
            answers={answers}
            flaggedIds={flaggedIds}
          />
        </div>
      </div>

      {/* Mobile Navigator Drawer / Modal */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-slate-950/60 backdrop-blur-sm lg:hidden">
          <div className="max-h-[75vh] overflow-y-auto rounded-t-2xl border-t border-[var(--snx-border)] bg-[var(--snx-surface-elevated)] p-4 dark:border-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--snx-border-subtle)] dark:border-slate-800 mb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Questions</h3>
              <Button variant="ghost" size="sm" onClick={() => setMobileNavOpen(false)}>
                Close
              </Button>
            </div>
            <QuestionNavigator
              questions={flatQuestions}
              currentIndex={currentIndex}
              onSelectQuestion={(idx) => {
                setCurrentIndex(idx);
                setMobileNavOpen(false);
              }}
              answers={answers}
              flaggedIds={flaggedIds}
            />
          </div>
        </div>
      )}

      {/* Submit Confirmation Modal */}
      <SubmitConfirmationModal
        isOpen={submitModalOpen}
        onClose={() => setSubmitModalOpen(false)}
        onSubmit={() => {
          setSubmitModalOpen(false);
          onSubmit(false);
        }}
        totalQuestions={flatQuestions.length}
        answeredCount={answeredCount}
        flaggedCount={flaggedIds.size}
        submitting={submitting}
      />
    </div>
  );
};

export default ActiveTestInterface;
