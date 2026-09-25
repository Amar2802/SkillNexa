import { useState, useRef, useEffect } from "react";
import { FiSend, FiLoader, FiZap } from "react-icons/fi";
import Button from "../ui/Button";

const MODES = [
  { id: "general", label: "General Chat", icon: "💬" },
  { id: "hint", label: "DSA Hint", icon: "💡" },
  { id: "debug", label: "Code Debugger", icon: "🐞" },
  { id: "interview", label: "Mock Interview", icon: "🎯" },
  { id: "plan", label: "Study Plan", icon: "📅" }
];

export const ChatInput = ({
  onSendMessage,
  loading = false,
  activeMode = "general",
  onChangeMode
}) => {
  const [text, setText] = useState("");
  const textareaRef = useRef(null);

  // Auto-resize textarea height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  }, [text]);

  const handleSubmit = (e) => {
    e?.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    onSendMessage(trimmed);
    setText("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="space-y-3">
      {/* Mode Selector Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 snx-scrollbar">
        {MODES.map((mode) => {
          const isActive = activeMode === mode.id;
          return (
            <button
              key={mode.id}
              type="button"
              onClick={() => onChangeMode && onChangeMode(mode.id)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all shrink-0 cursor-pointer ${
                isActive
                  ? "bg-indigo-600 text-white font-semibold shadow-subtle"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
              }`}
            >
              <span>{mode.icon}</span>
              <span>{mode.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Input Form */}
      <form
        onSubmit={handleSubmit}
        className="relative rounded-2xl border border-[var(--snx-border)] bg-[var(--snx-surface)] shadow-subtle focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all p-2.5"
      >
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            activeMode === "hint"
              ? "Ask for progressive hints without spoiling the full solution..."
              : activeMode === "debug"
              ? "Paste your code and error message for root-cause debugging..."
              : activeMode === "interview"
              ? "Ask for high-yield technical interview questions or feedback..."
              : activeMode === "plan"
              ? "Describe your interview goals to generate a structured study plan..."
              : "Ask your developer mentor anything about code, DSA, or architecture..."
          }
          rows={1}
          disabled={loading}
          className="w-full resize-none bg-transparent px-2.5 py-1 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none dark:text-white dark:placeholder:text-slate-500 leading-relaxed max-h-[180px]"
        />

        <div className="flex items-center justify-between pt-2 px-1 border-t border-[var(--snx-border)] mt-1">
          <div className="text-[11px] text-slate-400 hidden sm:block">
            <span>Press </span>
            <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-[10px] text-slate-500">Enter</kbd>
            <span> to send, </span>
            <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-mono text-[10px] text-slate-500">Shift + Enter</kbd>
            <span> for new line</span>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={!text.trim() || loading}
            iconRight={loading ? FiLoader : FiSend}
            className={`ml-auto ${loading ? "opacity-75" : ""}`}
          >
            {loading ? "Thinking..." : "Send"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChatInput;
