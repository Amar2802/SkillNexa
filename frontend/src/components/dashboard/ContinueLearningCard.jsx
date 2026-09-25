import { Link } from "react-router-dom";
import { FiBookOpen, FiArrowRight, FiCompass } from "react-icons/fi";
import Card from "../ui/Card";
import Progress from "../ui/Progress";
import Button from "../ui/Button";

export const ContinueLearningCard = ({
  title = "Full-Stack & DSA Interview Track",
  topic = "Arrays & Binary Search Trees",
  progress = 45,
  estimatedTime = "35 mins",
  linkTo = "/learn"
}) => {
  return (
    <Card className="p-5 flex flex-col justify-between space-y-4">
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
              <FiCompass className="h-4 w-4" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Continue Learning
            </span>
          </div>
          <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
            {estimatedTime} remaining
          </span>
        </div>

        <div className="mt-3">
          <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">
            Active Milestone
          </span>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-snug">
            {title}
          </h3>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
            Current Module: <strong className="text-slate-700 dark:text-slate-200">{topic}</strong>
          </p>
        </div>

        <div className="mt-4">
          <Progress
            value={progress}
            max={100}
            label="Module Completion"
            showPercentage
            size="md"
            variant="primary"
          />
        </div>
      </div>

      <div className="pt-2">
        <Link to={linkTo}>
          <Button variant="primary" size="sm" className="w-full" iconRight={FiArrowRight}>
            Continue Learning
          </Button>
        </Link>
      </div>
    </Card>
  );
};

export default ContinueLearningCard;
