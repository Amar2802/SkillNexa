import { useMemo, useState } from "react";
import api from "../api/client";

const formatTimer = (seconds) => {
  const mins = Math.floor(seconds / 60).toString().padStart(2, "0");
  const secs = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${mins}:${secs}`;
};

const MockTestsPage = ({ tests = [], refreshTests, refreshProfile, refreshHistory, questions = [] }) => {
  const [activeTest, setActiveTest] = useState(null);
  const [pendingTest, setPendingTest] = useState(null);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const questionCount = useMemo(() => activeTest ? activeTest.sections.flatMap((section) => section.questions).length : 0, [activeTest]);
  const pendingQuestionCount = useMemo(() => pendingTest ? pendingTest.sections.flatMap((section) => section.questions).length : 0, [pendingTest]);

  const generateTest = async () => {
    try {
      setLoading(true);
      const { data } = await api.post("/tests", {});
      setPendingTest(data);
      setActiveTest(null);
      setAnswers({});
      setResult(null);
      refreshTests?.();
    } finally {
      setLoading(false);
    }
  };

  const startPendingTest = () => {
    if (!pendingTest) return;
    setActiveTest(pendingTest);
    setPendingTest(null);
    setAnswers({});
    setResult(null);
  };

  const submitTest = async () => {
    if (!activeTest) return;
    const payload = Object.entries(answers).map(([questionId, submittedAnswer]) => ({ questionId, submittedAnswer, timeSpent: 0 }));
    const { data } = await api.post(`/tests/${activeTest._id}/submit`, { answers: payload, totalTimeSpent: 1800 });
    setResult(data);
    setActiveTest(null);
    setAnswers({});
    refreshProfile?.();
    refreshHistory?.();
  };

  return (
    <div className="container py-4">
      <div className="hero-panel mb-4 mock-tests-hero">
        <div>
          <p className="eyebrow mb-2">Mock Tests</p>
          <h1 className="h2 fw-bold mb-2">30-question software mock test</h1>
          <p className="text-secondary mb-0">Each generated test contains 30 software interview questions and a 30-minute timer.</p>
        </div>
        <div className="mock-tests-hero-actions">
          <button className="btn btn-info" onClick={generateTest} disabled={loading}>{loading ? "Generating..." : "Generate Mock Test"}</button>
        </div>
      </div>

      {pendingTest ? (
        <div className="glass-card p-4 mock-test-active-card mb-4">
          <p className="eyebrow mb-2">Generated Test</p>
          <div className="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-4">
            <div>
              <h2 className="h3 mb-2">{pendingTest.title}</h2>
              <p className="text-secondary mb-0">Your software mock is ready. Review the format below and start when you are ready.</p>
            </div>
            <div className="mock-test-timer-card">
              <span>Duration</span>
              <strong>{formatTimer((pendingTest.duration || 30) * 60)}</strong>
            </div>
          </div>

          <div className="mock-test-format-grid mb-4">
            <div><span>Questions</span><strong>{pendingQuestionCount}</strong></div>
            <div><span>Duration</span><strong>{pendingTest.duration || 30} minutes</strong></div>
          </div>

          <div className="d-flex gap-2 flex-wrap">
            <button className="btn btn-info" onClick={startPendingTest}>Start Test</button>
            <button className="btn btn-outline-light" onClick={generateTest} disabled={loading}>{loading ? "Generating..." : "Regenerate"}</button>
          </div>
        </div>
      ) : null}

      {activeTest ? (
        <div className="glass-card p-4 mock-test-active-card">
          <div className="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-4">
            <div>
              <h2 className="h3 mb-2">{activeTest.title}</h2>
              <p className="text-secondary mb-0">Answer each question and submit when ready.</p>
            </div>
            <div className="mock-test-timer-card">
              <span>Duration</span>
              <strong>{formatTimer((activeTest.duration || 30) * 60)}</strong>
            </div>
          </div>

          <div className="mock-test-format-grid mb-4">
            <div><span>Questions</span><strong>{questionCount}</strong></div>
            <div><span>Duration</span><strong>{activeTest.duration || 30} minutes</strong></div>
          </div>

          <div className="vstack gap-4">
            {activeTest.sections.flatMap((section) => section.questions).map((question, index) => (
              <div key={question._id} className="mock-test-question-block">
                <div className="mock-test-question-head mb-3">
                  <span className="mock-test-question-number">{index + 1}</span>
                  <div>
                    <h3 className="h5 mb-2">{question.title.replace(/\s+Practice Variant\s+\d+$/i, "")}</h3>
                    <p className="text-secondary mb-2">{String(question.description).replace(/\s*Practice focus\s*\d*:\s*.+$/i, "").trim()}</p>
                    <div className="d-flex gap-2 flex-wrap">
                      <span className="badge text-bg-dark">{question.category}</span>
                      <span className="badge text-bg-dark">{question.topic}</span>
                      <span className="badge text-bg-info">{question.type}</span>
                    </div>
                  </div>
                </div>
                {question.type === "MCQ" ? (
                  <div className="vstack gap-2">
                    {(question.options || []).map((option) => (
                      <button key={option} className={`btn text-start ${answers[question._id] === option ? "btn-info" : "btn-outline-light"}`} onClick={() => setAnswers((current) => ({ ...current, [question._id]: option }))}>{option}</button>
                    ))}
                  </div>
                ) : (
                  <textarea className="form-control" rows="5" value={answers[question._id] || ""} onChange={(event) => setAnswers((current) => ({ ...current, [question._id]: event.target.value }))} placeholder={question.type === "Coding" ? "Write code or approach here..." : "Write your answer here..."} />
                )}
              </div>
            ))}
          </div>

          <button className="btn btn-info mt-4" onClick={submitTest}>Submit Test</button>
        </div>
      ) : null}

      {result ? (
        <div className="glass-card p-4 mt-4">
          <p className="eyebrow mb-2">Latest Result</p>
          <h2 className="h4 mb-3">Mock test submitted successfully</h2>
          <div className="mock-test-result-grid mb-4">
            <div><span>Score</span><strong>{result.score}</strong></div>
            <div><span>Accuracy</span><strong>{result.accuracy}%</strong></div>
            <div><span>Weak Topics</span><strong>{(result.weakTopics || []).join(", ") || "None"}</strong></div>
            <div><span>Strengths</span><strong>{(result.strengths || []).join(", ") || "None"}</strong></div>
          </div>
        </div>
      ) : null}

      {!activeTest && !pendingTest && !result ? (
        <div className="glass-card p-4 mock-test-empty-state">
          <h2 className="h4 mb-2">Ready for a fresh mock?</h2>
          <p className="text-secondary mb-0">Generate a new software mock test to practice DSA, aptitude, HR, and core subjects in one round.</p>
        </div>
      ) : null}
    </div>
  );
};

export default MockTestsPage;
