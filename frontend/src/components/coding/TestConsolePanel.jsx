import { useState } from "react";
import { FiTerminal, FiCheckCircle, FiXCircle, FiCpu, FiArrowRight, FiCopy } from "react-icons/fi";
import Button from "../ui/Button";

export const TestConsolePanel = ({
  codeOutput = "",
  codeStatus = "",
  stdin = "",
  onStdinChange,
  feedback = null,
  evaluation = null,
  onNextProblem
}) => {
  const [activeTab, setActiveTab] = useState(feedback ? "result" : "output");
  const [copied, setCopied] = useState(false);

  const copyOutput = () => {
    if (!codeOutput) return;
    navigator.clipboard.writeText(codeOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const isAccepted = feedback?.isCorrect || evaluation?.score >= 70;

  return (
    <div className="flex flex-col h-full bg-[#181818] border-t border-slate-800 text-xs">
      {/* Console Tab Header */}
      <div className="flex items-center justify-between px-3 border-b border-slate-800 bg-[#121212]">
        <div className="flex items-center">
          <button
            type="button"
            onClick={() => setActiveTab("output")}
            className={`py-2 px-3 font-semibold border-b-2 transition flex items-center gap-1.5 ${
              activeTab === "output"
                ? "border-indigo-500 text-indigo-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <FiTerminal className="h-3.5 w-3.5" />
            <span>Console Output</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("stdin")}
            className={`py-2 px-3 font-semibold border-b-2 transition flex items-center gap-1.5 ${
              activeTab === "stdin"
                ? "border-indigo-500 text-indigo-400"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <span>Custom Input</span>
          </button>

          {(feedback || evaluation) && (
            <button
              type="button"
              onClick={() => setActiveTab("result")}
              className={`py-2 px-3 font-semibold border-b-2 transition flex items-center gap-1.5 ${
                activeTab === "result"
                  ? "border-indigo-500 text-indigo-400"
                  : "border-transparent text-slate-400 hover:text-slate-200"
              }`}
            >
              <span>Submission Result</span>
              <span
                className={`h-2 w-2 rounded-full ${
                  isAccepted ? "bg-emerald-400" : "bg-rose-400"
                }`}
              />
            </button>
          )}
        </div>

        {activeTab === "output" && codeOutput && (
          <button
            type="button"
            onClick={copyOutput}
            className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white transition"
          >
            <FiCopy className="h-3 w-3" />
            <span>{copied ? "Copied" : "Copy"}</span>
          </button>
        )}
      </div>

      {/* Tab Panes */}
      <div className="flex-1 p-3 overflow-y-auto snx-scrollbar font-mono text-slate-200 text-xs">
        {activeTab === "output" ? (
          <div>
            {codeStatus && (
              <div className="mb-2 flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Status:
                </span>
                <span
                  className={`font-semibold ${
                    codeStatus.toLowerCase().includes("error")
                      ? "text-rose-400"
                      : "text-emerald-400"
                  }`}
                >
                  {codeStatus}
                </span>
              </div>
            )}
            {codeOutput ? (
              <pre className="whitespace-pre-wrap leading-relaxed select-text bg-[#101010] p-3 rounded border border-slate-800/80">
                {codeOutput}
              </pre>
            ) : (
              <div className="text-slate-600 italic py-4">
                Click "Run Code" to compile and execute your solution in the cloud sandbox.
              </div>
            )}
          </div>
        ) : activeTab === "stdin" ? (
          <div className="space-y-2">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider font-sans block">
              Standard Input (stdin)
            </span>
            <textarea
              value={stdin}
              onChange={(e) => onStdinChange?.(e.target.value)}
              placeholder="Enter custom test input lines here..."
              className="w-full h-24 rounded border border-slate-800 bg-[#101010] p-2 text-xs font-mono text-slate-200 outline-none focus:border-indigo-500"
            />
          </div>
        ) : (
          /* Submission Result Tab */
          <div className="space-y-3 font-sans">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                {isAccepted ? (
                  <FiCheckCircle className="h-5 w-5 text-emerald-400" />
                ) : (
                  <FiXCircle className="h-5 w-5 text-rose-400" />
                )}
                <span
                  className={`text-sm font-bold ${
                    isAccepted ? "text-emerald-400" : "text-rose-400"
                  }`}
                >
                  {isAccepted ? "Accepted" : "Needs Review"}
                </span>
              </div>

              {evaluation?.score !== undefined && (
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                  Score: {evaluation.score}/100
                </span>
              )}
            </div>

            {feedback?.explanation && (
              <div className="rounded border border-slate-800 bg-[#121212] p-3 text-xs text-slate-300 leading-relaxed">
                <p className="font-semibold text-slate-400 uppercase text-[10px] mb-1">
                  Evaluation Feedback:
                </p>
                <p>{feedback.explanation}</p>
              </div>
            )}

            {onNextProblem && (
              <div className="pt-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={onNextProblem}
                  iconRight={FiArrowRight}
                  className="w-full"
                >
                  Next Problem
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TestConsolePanel;
