import { useNavigate } from "react-router-dom";
import { FiClock, FiCheckCircle, FiAlertCircle, FiArrowRight, FiRotateCcw, FiLayers } from "react-icons/fi";
import PageContainer from "../components/layout/PageContainer";
import PageHeader from "../components/ui/PageHeader";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import EmptyState from "../components/ui/EmptyState";

export const HistoryPage = ({ history = [] }) => {
  const navigate = useNavigate();

  return (
    <PageContainer>
      <PageHeader
        title="Test History & Submissions"
        subtitle="Review your previous timed mock assessments, score trajectories, and identified weak areas."
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "History" }
        ]}
        actions={
          history.length > 0 && (
            <Badge variant="primary" size="md">
              <FiClock className="h-3.5 w-3.5 mr-1" />
              <span>{history.length} Attempt{history.length === 1 ? "" : "s"}</span>
            </Badge>
          )
        }
      />

      {history.length > 0 ? (
        <div className="space-y-4">
          {history.map((item, idx) => {
            const formattedDate = item.createdAt
              ? new Date(item.createdAt).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit"
                })
              : "Recently";

            const score = item.score ?? 0;
            const accuracy = item.accuracy ?? (item.answers?.length ? Math.round(((item.answers.filter(a => a.isCorrect).length) / item.answers.length) * 100) : 0);
            const weakTopics = item.weakTopics || [];

            return (
              <Card
                key={item._id || idx}
                hoverable
                className="transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base font-bold text-slate-900 dark:text-white">
                        {item.test?.title || "Full Software Engineering Assessment"}
                      </h3>
                      <Badge variant={accuracy >= 75 ? "success" : accuracy >= 50 ? "warning" : "danger"} size="sm">
                        {accuracy}% Accuracy
                      </Badge>
                    </div>

                    <p className="text-xs text-slate-400">
                      Completed on {formattedDate}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Score</span>
                      <span className="text-lg font-mono font-bold text-indigo-600 dark:text-indigo-400">
                        {score} pts
                      </span>
                    </div>

                    <div className="flex items-center gap-2 pl-3 border-l border-[var(--snx-border-subtle)] dark:border-slate-800">
                      <Button
                        variant="secondary"
                        size="sm"
                        icon={FiLayers}
                        onClick={() => navigate("/review-mistakes")}
                      >
                        Mistakes
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        icon={FiRotateCcw}
                        onClick={() => navigate("/mock-tests")}
                      >
                        Retake
                      </Button>
                    </div>
                  </div>
                </div>

                {weakTopics.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-[var(--snx-border-subtle)] dark:border-slate-800 flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] font-semibold text-slate-400">Weak Topics:</span>
                    {weakTopics.map((topic, tIdx) => (
                      <Badge key={tIdx} variant="neutral" size="sm">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      ) : (
        <EmptyState
          title="No test history recorded"
          description="Complete a timed assessment in Mock Tests to evaluate your score trajectory and identify topics requiring revision."
          action={
            <Button
              variant="primary"
              size="md"
              icon={FiRotateCcw}
              onClick={() => navigate("/mock-tests")}
            >
              Take a Mock Test
            </Button>
          }
        />
      )}
    </PageContainer>
  );
};

export default HistoryPage;
