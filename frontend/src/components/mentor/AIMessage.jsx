import { useState, useMemo } from "react";
import { FiCopy, FiCheck, FiRotateCcw, FiThumbsUp, FiThumbsDown, FiCpu } from "react-icons/fi";
import CodeBlock from "./CodeBlock";

export const AIMessage = ({
  content = "",
  timestamp,
  onRegenerate,
  isLatest = false
}) => {
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState(null); // 'like' | 'dislike' | null

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Custom lightweight parser for technical Markdown (code blocks, headings, lists, bold)
  const renderedContent = useMemo(() => {
    if (!content) return null;

    // Split content by triple backticks code blocks
    const parts = content.split(/(```[\s\S]*?```)/g);

    return parts.map((part, index) => {
      // Check if it's a code block
      if (part.startsWith("```") && part.endsWith("```")) {
        const lines = part.slice(3, -3).trim().split("\n");
        const firstLine = lines[0].trim();
        const hasLang = /^[a-zA-Z0-9_-]+$/.test(firstLine);
        const language = hasLang ? firstLine : "javascript";
        const code = hasLang ? lines.slice(1).join("\n") : lines.join("\n");

        return <CodeBlock key={index} language={language} code={code} />;
      }

      // Normal text with headings, lists, paragraphs, bold, inline code
      const paragraphs = part.split(/\n\n+/);

      return (
        <div key={index} className="space-y-2.5">
          {paragraphs.map((p, pIdx) => {
            const trimmed = p.trim();
            if (!trimmed) return null;

            // Headings
            if (trimmed.startsWith("### ")) {
              return (
                <h4 key={pIdx} className="text-sm font-bold text-slate-900 dark:text-white mt-3 mb-1">
                  {trimmed.replace(/^###\s+/, "")}
                </h4>
              );
            }
            if (trimmed.startsWith("## ")) {
              return (
                <h3 key={pIdx} className="text-base font-extrabold text-slate-900 dark:text-white mt-4 mb-1.5 pb-1 border-b border-[var(--snx-border)]">
                  {trimmed.replace(/^##\s+/, "")}
                </h3>
              );
            }
            if (trimmed.startsWith("# ")) {
              return (
                <h2 key={pIdx} className="text-lg font-black text-slate-900 dark:text-white mt-4 mb-2">
                  {trimmed.replace(/^#\s+/, "")}
                </h2>
              );
            }

            // Bullet lists
            if (trimmed.split("\n").some((l) => l.trim().startsWith("- ") || l.trim().startsWith("* "))) {
              const items = trimmed.split("\n").filter((l) => l.trim());
              return (
                <ul key={pIdx} className="list-disc list-inside space-y-1 my-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                  {items.map((item, iIdx) => {
                    const cleanItem = item.replace(/^[\s\-*]+\s*/, "");
                    return <li key={iIdx} dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(cleanItem) }} />;
                  })}
                </ul>
              );
            }

            // Numbered lists
            if (trimmed.split("\n").some((l) => /^\d+\.\s+/.test(l.trim()))) {
              const items = trimmed.split("\n").filter((l) => l.trim());
              return (
                <ol key={pIdx} className="list-decimal list-inside space-y-1 my-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                  {items.map((item, iIdx) => {
                    const cleanItem = item.replace(/^\d+\.\s*/, "");
                    return <li key={iIdx} dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(cleanItem) }} />;
                  })}
                </ol>
              );
            }

            // Standard paragraph
            return (
              <p
                key={pIdx}
                className="text-xs sm:text-sm leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-line"
                dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(trimmed) }}
              />
            );
          })}
        </div>
      );
    });
  }, [content]);

  return (
    <div className="flex gap-3 sm:gap-4 items-start max-w-3xl mr-auto">
      {/* Mentor Avatar */}
      <div className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white shadow-subtle mt-0.5">
        <FiCpu className="h-4 w-4" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-xs font-bold text-slate-900 dark:text-white">
            SkillNexa Mentor
          </span>
          {timestamp && (
            <span className="text-[10px] text-slate-400">
              {new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
          )}
        </div>

        {/* Message Content Bubble */}
        <div className="p-4 sm:p-5 rounded-2xl rounded-tl-sm border border-[var(--snx-border)] bg-[var(--snx-surface)] text-slate-900 dark:text-slate-100 shadow-subtle leading-relaxed">
          {renderedContent}
        </div>

        {/* Message Footer Actions */}
        <div className="flex items-center gap-3 mt-2 text-slate-400 text-xs">
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1 hover:text-slate-600 dark:hover:text-slate-200 transition cursor-pointer"
            title="Copy response"
          >
            {copied ? (
              <>
                <FiCheck className="h-3 w-3 text-emerald-500" />
                <span className="text-emerald-500 text-[11px] font-medium">Copied</span>
              </>
            ) : (
              <>
                <FiCopy className="h-3 w-3" />
                <span className="text-[11px]">Copy</span>
              </>
            )}
          </button>

          {isLatest && onRegenerate && (
            <button
              type="button"
              onClick={onRegenerate}
              className="flex items-center gap-1 hover:text-indigo-600 dark:hover:text-indigo-400 transition cursor-pointer"
              title="Regenerate response"
            >
              <FiRotateCcw className="h-3 w-3" />
              <span className="text-[11px]">Regenerate</span>
            </button>
          )}

          <div className="flex items-center gap-1 ml-auto">
            <button
              type="button"
              onClick={() => setFeedback(feedback === "like" ? null : "like")}
              className={`p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer ${
                feedback === "like" ? "text-emerald-500 font-bold" : "hover:text-slate-600 dark:hover:text-slate-300"
              }`}
              title="Helpful response"
            >
              <FiThumbsUp className="h-3 w-3" />
            </button>
            <button
              type="button"
              onClick={() => setFeedback(feedback === "dislike" ? null : "dislike")}
              className={`p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer ${
                feedback === "dislike" ? "text-rose-500 font-bold" : "hover:text-slate-600 dark:hover:text-slate-300"
              }`}
              title="Needs improvement"
            >
              <FiThumbsDown className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper to escape HTML and format bold, inline code
function formatInlineMarkdown(text = "") {
  let escaped = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Bold **text**
  escaped = escaped.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-slate-900 dark:text-white">$1</strong>');

  // Inline code `code`
  escaped = escaped.replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded text-[11px] font-mono font-medium bg-slate-100 text-indigo-700 dark:bg-slate-800 dark:text-indigo-300 border border-[var(--snx-border)]">$1</code>');

  return escaped;
}

export default AIMessage;
