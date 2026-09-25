import { Link } from "react-router-dom";
import { FiZap, FiCpu, FiBarChart2 } from "react-icons/fi";
import Button from "../ui/Button";

export const DashboardHeader = ({ profile = {}, streak = 1 }) => {
  const firstName = profile?.name ? profile.name.split(" ")[0] : "Developer";
  const streakCount = profile?.streakCount || streak || 0;

  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pb-2 border-b border-[var(--snx-border-subtle)] dark:border-slate-800">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Welcome back, {firstName} 👋
          </h1>
          {streakCount > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-xs font-semibold text-amber-700 dark:text-amber-400">
              <FiZap className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
              <span>{streakCount}d streak</span>
            </span>
          )}
        </div>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
          Your technical interview command center. Track readiness, solve targeted problems, and run live AI rounds.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2.5 shrink-0">
        <Link to="/ai-interviewer">
          <Button variant="primary" size="md" icon={FiZap}>
            Start AI Interview
          </Button>
        </Link>
        <Link to="/practice">
          <Button variant="secondary" size="md" icon={FiCpu}>
            Practice IDE
          </Button>
        </Link>
        <Link to="/mock-tests">
          <Button variant="outline" size="md" icon={FiBarChart2}>
            Mock Test
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default DashboardHeader;
