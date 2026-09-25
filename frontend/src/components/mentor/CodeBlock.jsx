import { useState } from "react";
import { FiCopy, FiCheck } from "react-icons/fi";

export const CodeBlock = ({ language = "javascript", code = "" }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-3 rounded-xl border border-slate-700/80 bg-slate-950 text-slate-100 overflow-hidden shadow-md">
      {/* Code Header Bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800 bg-slate-900/90 text-xs">
        <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          {language || "code"}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2 py-1 rounded text-[11px] font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          title="Copy code"
        >
          {copied ? (
            <>
              <FiCheck className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-bold">Copied</span>
            </>
          ) : (
            <>
              <FiCopy className="h-3.5 w-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Body */}
      <pre className="p-4 text-xs font-mono leading-relaxed overflow-x-auto snx-scrollbar text-slate-200">
        <code>{code}</code>
      </pre>
    </div>
  );
};

export default CodeBlock;
