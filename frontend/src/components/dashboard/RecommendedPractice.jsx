import { Link } from "react-router-dom";
import { FiCode, FiArrowRight, FiCheck } from "react-icons/fi";
import Card, { CardHeader, CardTitle, CardContent } from "../ui/Card";
import Badge from "../ui/Badge";
import Button from "../ui/Button";

export const RecommendedPractice = ({ questions = [], solvedIds = new Set() }) => {
  const displayQuestions = (questions || []).slice(0, 4);

  return (
    <Card className="p-0">
      <CardHeader
        action={
          <Link to="/questions">
            <Button variant="ghost" size="sm" iconRight={FiArrowRight}>
              Explore Bank
            </Button>
          </Link>
        }
      >
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
            <FiCode className="h-4 w-4" />
          </div>
          <div>
            <CardTitle>Recommended Practice</CardTitle>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Targeted algorithm & system design problems based on your preparation profile
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-4">
        {displayQuestions.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-500">
            No questions available at the moment.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {displayQuestions.map((question) => {
              const isSolved = solvedIds.has(question._id);
              const cleanTitle = (question.title || "Algorithm Challenge").replace(
                /\s+Practice Variant\s+\d+$/i,
                ""
              );

              return (
                <div
                  key={question._id}
                  className="group relative flex flex-col justify-between rounded-lg border border-[var(--snx-border)] bg-[var(--snx-surface)] p-3.5 transition-all duration-150 hover:border-indigo-500/40 hover:shadow-subtle dark:border-slate-800 dark:bg-slate-800/40"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <Badge difficulty={question.difficulty || "medium"} size="sm" />
                        {question.topic && (
                          <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                            {question.topic}
                          </span>
                        )}
                      </div>
                      {question.company && (
                        <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                          {question.company}
                        </span>
                      )}
                    </div>

                    <h4 className="text-sm font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1 dark:text-white dark:group-hover:text-indigo-400">
                      {cleanTitle}
                    </h4>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-[var(--snx-border-subtle)] dark:border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-400 text-[11px]">
                      {question.estimatedTime || "15-20 min"}
                    </span>
                    <Link to={`/practice/${question._id}`}>
                      <Button
                        variant={isSolved ? "secondary" : "primary"}
                        size="sm"
                        iconRight={FiArrowRight}
                        className="!h-7 !text-xs !px-2.5"
                      >
                        {isSolved ? "Review" : "Solve"}
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecommendedPractice;
