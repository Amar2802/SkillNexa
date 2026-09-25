import { FiCpu, FiPlus, FiRotateCcw, FiMenu, FiTrash2 } from "react-icons/fi";
import Button from "../ui/Button";

export const MentorHeader = ({
  onNewChat,
  onClearChat,
  onToggleSidebar,
  hasMessages = false
}) => {
  return (
    <div className="flex items-center justify-between gap-4 pb-4 border-b border-[var(--snx-border)]">
      {/* Left: Mentor branding & status */}
      <div className="flex items-center gap-3 min-w-0">
        <Button
          variant="outline"
          size="sm"
          className="md:hidden h-8 w-8 p-0"
          onClick={onToggleSidebar}
          aria-label="Toggle chat history"
        >
          <FiMenu className="h-4 w-4" />
        </Button>

        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white shadow-subtle">
          <FiCpu className="h-4 w-4" />
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-base sm:text-lg font-black text-slate-900 dark:text-white truncate">
              AI Developer Mentor
            </h1>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 text-[10px] font-bold">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Online</span>
            </div>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
            Your developer coach for learning, coding, and interview preparation.
          </p>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2 shrink-0">
        {hasMessages && onClearChat && (
          <Button
            variant="ghost"
            size="sm"
            iconLeft={FiTrash2}
            onClick={onClearChat}
            className="text-xs text-slate-500 hover:text-rose-600 dark:hover:text-rose-400"
            title="Clear current messages"
          >
            Clear
          </Button>
        )}

        <Button
          variant="outline"
          size="sm"
          iconLeft={FiPlus}
          onClick={onNewChat}
          className="text-xs"
        >
          New Chat
        </Button>
      </div>
    </div>
  );
};

export default MentorHeader;
