import { Link } from "react-router-dom";
import { FiTrendingUp, FiArrowRight } from "react-icons/fi";
import Card, { CardHeader, CardTitle, CardContent } from "../ui/Card";
import Progress from "../ui/Progress";
import Button from "../ui/Button";

export const SkillPerformance = ({ topicHealth = [], weakTopics = [] }) => {
  const weakTopic = weakTopics[0] || "Trees";

  return (
    <Card className="p-0 flex flex-col justify-between">
      <div>
        <CardHeader
          action={
            <Link to={`/questions?topic=${encodeURIComponent(weakTopic)}`}>
              <Button variant="ghost" size="sm" iconRight={FiArrowRight}>
                Practice Weak Areas
              </Button>
            </Link>
          }
        >
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
              <FiTrendingUp className="h-4 w-4" />
            </div>
            <div>
              <CardTitle>Skill Performance</CardTitle>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Performance breakdown across technical interview domains
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 pt-4">
          {topicHealth.map((topic) => {
            let variant = "primary";
            if (topic.score >= 80) variant = "success";
            else if (topic.score < 60) variant = "warning";

            return (
              <div key={topic.label} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {topic.label}
                    </span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${
                        topic.status === "Strong"
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400"
                          : topic.status === "Improving"
                          ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-400"
                          : "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400"
                      }`}
                    >
                      {topic.status}
                    </span>
                  </div>
                  <span className="font-mono text-slate-600 dark:text-slate-300 font-semibold">
                    {topic.score}%
                  </span>
                </div>
                <Progress value={topic.score} max={100} size="sm" variant={variant} />
              </div>
            );
          })}
        </CardContent>
      </div>

      <div className="p-4 sm:p-5 pt-0">
        <Link to={`/questions?filter=weak`}>
          <Button variant="secondary" size="sm" className="w-full" iconRight={FiArrowRight}>
            Target Weak Domains
          </Button>
        </Link>
      </div>
    </Card>
  );
};

export default SkillPerformance;
