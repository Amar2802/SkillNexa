import { Link } from "react-router-dom";
import { FiClock, FiCheckCircle, FiBarChart2, FiCpu, FiZap, FiArrowRight } from "react-icons/fi";
import Card, { CardHeader, CardTitle, CardContent } from "../ui/Card";
import Button from "../ui/Button";

const formatRelativeTime = (timestamp) => {
  if (!timestamp) return "Recently";
  const date = new Date(timestamp);
  const now = new Date();
  const diffInMinutes = Math.floor((now - date) / (1000 * 60));

  if (diffInMinutes < 1) return "Just now";
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) return "Yesterday";
  if (diffInDays < 7) return `${diffInDays}d ago`;
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
};

export const RecentActivityTimeline = ({ history = [] }) => {
  const recentItems = (history || []).slice(0, 5);

  return (
    <Card className="p-0">
      <CardHeader
        action={
          <Link to="/history">
            <Button variant="ghost" size="sm" iconRight={FiArrowRight}>
              Full History
            </Button>
          </Link>
        }
      >
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
            <FiClock className="h-4 w-4" />
          </div>
          <div>
            <CardTitle>Recent Activity</CardTitle>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Your latest mock tests, coding rounds, and interview answers
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-4">
        {recentItems.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-500 space-y-3">
            <p>You haven't completed any test sessions or submissions yet.</p>
            <Link to="/mock-tests">
              <Button variant="outline" size="sm">
                Take First Mock Test
              </Button>
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-[var(--snx-border-subtle)] dark:divide-slate-800">
            {recentItems.map((item, index) => {
              const isTest = item.type === "test" || item.title?.toLowerCase().includes("test");
              const isInterview = item.type === "interview" || item.title?.toLowerCase().includes("interview");
              const Icon = isInterview ? FiZap : isTest ? FiBarChart2 : FiCpu;

              const title = item.title || item.testName || `Practice Round #${index + 1}`;
              const score = item.score !== undefined ? item.score : item.accuracy;

              return (
                <div
                  key={item._id || index}
                  className="py-3 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[var(--snx-surface-subtle)] text-slate-600 dark:text-slate-300">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-900 truncate dark:text-white">
                        {title}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {formatRelativeTime(item.createdAt)}
                      </p>
                    </div>
                  </div>

                  {score !== undefined && (
                    <div className="shrink-0">
                      <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                        {score}%
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentActivityTimeline;
