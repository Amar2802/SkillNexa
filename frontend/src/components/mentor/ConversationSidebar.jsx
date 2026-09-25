import { useMemo } from "react";
import { FiPlus, FiMessageSquare, FiTrash2, FiClock, FiX } from "react-icons/fi";
import Button from "../ui/Button";

export const ConversationSidebar = ({
  conversations = [],
  activeConversationId,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
  onCloseMobile
}) => {
  // Group conversations by Today, Yesterday, Previous 7 Days, Older
  const grouped = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const groups = {
      Today: [],
      Yesterday: [],
      "Previous 7 Days": [],
      Older: []
    };

    conversations.forEach((conv) => {
      const convDate = new Date(conv.updatedAt || conv.createdAt || Date.now());
      if (convDate >= today) {
        groups.Today.push(conv);
      } else if (convDate >= yesterday) {
        groups.Yesterday.push(conv);
      } else if (convDate >= sevenDaysAgo) {
        groups["Previous 7 Days"].push(conv);
      } else {
        groups.Older.push(conv);
      }
    });

    return groups;
  }, [conversations]);

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Top Header & New Chat Button */}
      <div className="flex items-center justify-between pb-3 border-b border-[var(--snx-border)]">
        <div className="flex items-center gap-2">
          <FiClock className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            Chat History
          </span>
        </div>

        {onCloseMobile && (
          <button
            type="button"
            onClick={onCloseMobile}
            className="md:hidden p-1 text-slate-400 hover:text-slate-600"
          >
            <FiX className="h-4 w-4" />
          </button>
        )}
      </div>

      <Button
        variant="primary"
        size="sm"
        iconLeft={FiPlus}
        onClick={onNewConversation}
        className="w-full justify-center"
      >
        New Chat
      </Button>

      {/* Scrollable Conversation List */}
      <div className="flex-1 overflow-y-auto snx-scrollbar pr-1 space-y-4">
        {conversations.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-400 space-y-2">
            <FiMessageSquare className="h-6 w-6 text-slate-300 dark:text-slate-600 mx-auto" />
            <p>No previous conversations recorded.</p>
          </div>
        ) : (
          Object.entries(grouped).map(([groupTitle, list]) => {
            if (list.length === 0) return null;

            return (
              <div key={groupTitle} className="space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1">
                  {groupTitle}
                </div>

                {list.map((conv) => {
                  const isActive = conv.id === activeConversationId;

                  return (
                    <div
                      key={conv.id}
                      onClick={() => onSelectConversation(conv.id)}
                      className={`group flex items-center justify-between p-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                        isActive
                          ? "bg-indigo-50/80 text-indigo-950 font-bold border border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-200 dark:border-indigo-800"
                          : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800/60"
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0 pr-2">
                        <FiMessageSquare className={`h-3.5 w-3.5 shrink-0 ${isActive ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400"}`} />
                        <span className="truncate">{conv.title || "Untitled Session"}</span>
                      </div>

                      {onDeleteConversation && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteConversation(conv.id);
                          }}
                          className="opacity-0 group-hover:opacity-100 p-1 rounded text-slate-400 hover:text-rose-500 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                          title="Delete conversation"
                        >
                          <FiTrash2 className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ConversationSidebar;
