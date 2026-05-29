import { Bar, Line } from "react-chartjs-2";
import SurfaceCard from "../ui/SurfaceCard";

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    x: { grid: { display: false }, ticks: { color: "#64748B", font: { size: 10 } } },
    y: { min: 0, max: 100, grid: { color: "rgba(148,163,184,0.15)" }, ticks: { color: "#64748B" } }
  }
};

const MiniChart = ({ title, labels, values, color }) => (
  <div className="snx-card !p-4">
    <div className="snx-label mb-2">{title}</div>
    <div className="h-36">
      <Line
        data={{
          labels,
          datasets: [{
            data: values,
            borderColor: color,
            backgroundColor: `${color}33`,
            fill: true,
            tension: 0.35
          }]
        }}
        options={chartOptions}
      />
    </div>
  </div>
);

const EvaluationAnalyticsPanel = ({ analytics }) => {
  if (!analytics?.totalEvaluated) {
    return (
      <SurfaceCard className="text-sm text-slate-custom-500">
        Complete practice or AI interview answers to unlock AI evaluation analytics.
      </SurfaceCard>
    );
  }

  const weeklyLabels = analytics.weeklyProgress?.map((item) => item.label) || [];
  const weeklyValues = analytics.weeklyProgress?.map((item) => item.score) || [];
  const monthlyLabels = analytics.monthlyProgress?.map((item) => item.label) || [];
  const monthlyValues = analytics.monthlyProgress?.map((item) => item.score) || [];

  return (
    <div className="space-y-6">
      <div className="snx-grid-auto">
        {[
          { label: "Avg interview score", value: analytics.averageScore },
          { label: "AI readiness", value: analytics.aiReadinessScore },
          { label: "Improvement rate", value: `${analytics.improvementRate >= 0 ? "+" : ""}${analytics.improvementRate}` },
          { label: "Evaluated answers", value: analytics.totalEvaluated }
        ].map((item) => (
          <div key={item.label} className="snx-stat !p-4">
            <div className="snx-label">{item.label}</div>
            <div className="snx-stat-value mt-1">{item.value}</div>
          </div>
        ))}
      </div>

      <div className="snx-grid-2">
        <MiniChart title="Weekly progress" labels={weeklyLabels} values={weeklyValues} color="#4F46E5" />
        <MiniChart title="Monthly improvement" labels={monthlyLabels} values={monthlyValues} color="#8B5CF6" />
      </div>

      <div className="snx-grid-3">
        <MiniChart
          title="Accuracy trend"
          labels={analytics.accuracyTrend?.map((item) => item.label) || []}
          values={analytics.accuracyTrend?.map((item) => item.value) || []}
          color="#10B981"
        />
        <MiniChart
          title="Communication trend"
          labels={analytics.communicationTrend?.map((item) => item.label) || []}
          values={analytics.communicationTrend?.map((item) => item.value) || []}
          color="#06B6D4"
        />
        <MiniChart
          title="Confidence trend"
          labels={analytics.confidenceTrend?.map((item) => item.label) || []}
          values={analytics.confidenceTrend?.map((item) => item.value) || []}
          color="#F59E0B"
        />
      </div>

      {analytics.topicMastery?.length ? (
        <SurfaceCard>
          <span className="snx-kicker">Topic mastery</span>
          <h3 className="snx-heading-3 mt-1">Performance heatmap</h3>
          <div className="mt-4 h-56">
            <Bar
              data={{
                labels: analytics.topicMastery.map((item) => item.topic),
                datasets: [
                  {
                    label: "Score",
                    data: analytics.topicMastery.map((item) => item.score),
                    backgroundColor: "rgba(79,70,229,0.75)",
                    borderRadius: 8
                  }
                ]
              }}
              options={chartOptions}
            />
          </div>
          <div className="mt-4 flex flex-wrap gap-2 text-xs">
            <span className="snx-badge-primary">Best: {analytics.bestTopic || "—"}</span>
            <span className="snx-badge">Weakest: {analytics.weakestTopic || "—"}</span>
          </div>
        </SurfaceCard>
      ) : null}
    </div>
  );
};

export default EvaluationAnalyticsPanel;
