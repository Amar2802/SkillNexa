import { FiUser } from "react-icons/fi";

export const UserMessage = ({ content = "", timestamp, user }) => {
  const initials = (user?.name || "ME")
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex gap-3 sm:gap-4 items-start max-w-2xl ml-auto flex-row-reverse">
      {/* User Avatar */}
      {user?.avatar ? (
        <img
          src={user.avatar}
          alt={user?.name || "User"}
          className="h-8 w-8 sm:h-9 sm:w-9 shrink-0 rounded-xl object-cover ring-1 ring-[var(--snx-border)] mt-0.5"
        />
      ) : (
        <div className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-xl bg-slate-800 text-white text-xs font-bold shadow-subtle mt-0.5">
          {initials}
        </div>
      )}

      <div className="flex-1 min-w-0 text-right">
        <div className="flex items-center justify-end gap-2 mb-1.5">
          {timestamp && (
            <span className="text-[10px] text-slate-400">
              {new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
          )}
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
            You
          </span>
        </div>

        <div className="inline-block text-left p-4 sm:p-4.5 rounded-2xl rounded-tr-sm bg-indigo-600 text-white shadow-subtle text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
          {content}
        </div>
      </div>
    </div>
  );
};

export default UserMessage;
