import Editor from "@monaco-editor/react";
import { FiPlay, FiSend, FiRotateCcw, FiMaximize2, FiMinimize2 } from "react-icons/fi";
import Button from "../ui/Button";

const languageConfigs = [
  { id: "python", label: "Python 3", monaco: "python" },
  { id: "cpp", label: "C++ (GCC)", monaco: "cpp" },
  { id: "java", label: "Java (OpenJDK)", monaco: "java" }
];

export const CodeEditorPanel = ({
  code = "",
  onChange,
  language = "python",
  onLanguageChange,
  onResetCode,
  onRun,
  onSubmit,
  running = false,
  submitting = false,
  explanation = "",
  onExplanationChange,
  isFullscreen = false,
  onToggleFullscreen
}) => {
  const currentLang = languageConfigs.find((l) => l.id === language) || languageConfigs[0];

  return (
    <div className={`flex flex-col h-full bg-[#1e1e1e] ${isFullscreen ? "fixed inset-0 z-50" : ""}`}>
      {/* Editor Top Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800 bg-[#181818] text-xs">
        {/* Language Selector */}
        <div className="flex items-center gap-2">
          <select
            value={language}
            onChange={(e) => onLanguageChange(e.target.value)}
            className="h-7 rounded-md border border-slate-700 bg-slate-800 px-2 text-xs font-semibold text-slate-200 outline-none hover:border-slate-600 focus:border-indigo-500"
            aria-label="Select programming language"
          >
            {languageConfigs.map((lang) => (
              <option key={lang.id} value={lang.id}>
                {lang.label}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={onResetCode}
            title="Reset to starter code template"
            className="flex items-center gap-1 px-2 py-1 rounded text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition"
          >
            <FiRotateCcw className="h-3 w-3" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>

        {/* Fullscreen Toggle */}
        {onToggleFullscreen && (
          <button
            type="button"
            onClick={onToggleFullscreen}
            title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen Mode"}
            className="p-1 rounded text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition"
          >
            {isFullscreen ? <FiMinimize2 className="h-4 w-4" /> : <FiMaximize2 className="h-4 w-4" />}
          </button>
        )}
      </div>

      {/* Monaco Code Editor */}
      <div className="flex-1 min-h-[300px] overflow-hidden">
        <Editor
          height="100%"
          theme="vs-dark"
          language={currentLang.monaco}
          value={code}
          onChange={(val) => onChange(val || "")}
          options={{
            minimap: { enabled: false },
            fontSize: 13,
            lineNumbers: "on",
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 4,
            padding: { top: 12, bottom: 12 },
            fontFamily: "'Fira Code', Menlo, Monaco, 'Courier New', monospace"
          }}
        />
      </div>

      {/* Logic / Complexity Explanation Field */}
      <div className="border-t border-slate-800 bg-[#181818] p-3 space-y-1.5">
        <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
          Approach & Complexity Explanation (Optional)
        </label>
        <textarea
          value={explanation}
          onChange={(e) => onExplanationChange(e.target.value)}
          placeholder="Briefly explain your approach, time complexity (e.g. O(N)), and space complexity..."
          className="w-full h-14 rounded-md border border-slate-800 bg-[#121212] px-2.5 py-1.5 text-xs text-slate-200 placeholder:text-slate-600 outline-none focus:border-indigo-500 transition"
        />
      </div>

      {/* Action Bar (Run & Submit) */}
      <div className="flex items-center justify-between px-4 py-2.5 border-t border-slate-800 bg-[#141414]">
        <span className="text-[11px] text-slate-500 hidden sm:inline-block">
          Judge0 Sandbox • Python, C++, Java
        </span>

        <div className="flex items-center gap-2.5 ml-auto">
          <Button
            variant="secondary"
            size="sm"
            onClick={onRun}
            loading={running}
            disabled={running || submitting}
            icon={FiPlay}
            className="!bg-slate-800 !text-slate-200 !border-slate-700 hover:!bg-slate-700"
          >
            Run Code
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={onSubmit}
            loading={submitting}
            disabled={running || submitting}
            icon={FiSend}
          >
            Submit Solution
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CodeEditorPanel;
