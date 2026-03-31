import { useEffect, useMemo, useState } from "react";
import api from "../api/client";

const companyOptions = ["", "Amazon", "Microsoft", "Google", "Infosys", "TCS", "Accenture"];
const DEFAULT_DURATION = 30;
const DEFAULT_TOTAL_QUESTIONS = 30;

const formatTimeLeft = (seconds) => {
  const safeSeconds = Math.max(seconds, 0);
  const minutes = Math.floor(safeSeconds / 60);
  const secs = safeSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
};

const MockTestsPage = ({ tests, setTests, refreshProfile, refreshHistory }) => {
  const [activeTest, setActiveTest] = useState(null);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [result, setResult] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState("");
  const flat = useMemo(() => activeTest?.sections?.flatMap((section) => section.questions) || [], [activeTest]);

  useEffect(() => {
    if (!activeTest || timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((value) => value - 1), 1000);
    return () => clearInterval(timer);
  }, [activeTest, timeLeft]);

  useEffect(() => {
    if (activeTest && timeLeft === 0) submit();
  }, [timeLeft]);

  const generate = async () => {
    const { data } = await api.post("/tests", {
      company: selectedCompany,
      totalQuestions: DEFAULT_TOTAL_QUESTIONS,
      duration: DEFAULT_DURATION
    });
    setTests((current) => [data, ...current]);
  };

  const start = (test) => {
    setActiveTest(test);
    setAnswers({});
    setTimeLeft(test.duration * 60);
    setResult(null);
  };

  const submit = async () => {
    if (!activeTest) return;
    const payload = flat.map((q) => ({ questionId: q._id, submittedAnswer: answers[q._id] || "", timeSpent: 60 }));
    const { data } = await api.post(`/tests/${activeTest._id}/submit`, {
      answers: payload,
      totalTimeSpent: activeTest.duration * 60 - timeLeft
    });
    setResult(data);
    setActiveTest(null);
    setTimeLeft(0);
    await Promise.allSettled([refreshProfile?.(), refreshHistory?.()]);
  };

  const attemptedCount = flat.filter((question) => {
    const currentAnswer = answers[question._id];
    return typeof currentAnswer === "string" ? currentAnswer.trim().length > 0 : Boolean(currentAnswer);
  }).length;
  const unansweredCount = Math.max(flat.length - attemptedCount, 0);
  const progressPercent = flat.length ? Math.round((attemptedCount / flat.length) * 100) : 0;

  return (
    <div className="container py-4 mock-tests-page">
      <div className="mock-tests-hero mb-4">
        <div>
          <p className="eyebrow mb-2">Mock Test System</p>
          <h1 className="h2 fw-bold mb-2">Simulate a real interview assessment</h1>
          <p className="text-secondary mb-0">Generate a timed 30-question test, track how much you have attempted, and review your latest result in one place.</p>
        </div>
        <div className="mock-tests-hero-actions">
          <select className="form-select question-select" value={selectedCompany} onChange={(e) => setSelectedCompany(e.target.value)}>
            {companyOptions.map((company) => <option key={company || "general"} value={company}>{company || "General Mix"}</option>)}
          </select>
          <button className="btn btn-info" onClick={generate}>Generate Mock Test</button>
        </div>
      </div>

      {!activeTest ? (
        <div className="row g-4">
          <div className="col-lg-8">
            <div className="row g-3">
              {tests.length ? tests.map((test) => {
                const questionCount = test.sections?.reduce((sum, section) => sum + (section.questions?.length || 0), 0) || 0;

                return (
                  <div className="col-md-6" key={test._id}>
                    <div className="card glass-card h-100 mock-test-card">
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-start gap-3 mb-3">
                          <div>
                            <p className="eyebrow mb-2">Generated Test</p>
                            <h2 className="h5 mb-1">{test.title}</h2>
                            <p className="text-secondary mb-0">{test.description}</p>
                          </div>
                          <span className="badge text-bg-info">{questionCount} Qs</span>
                        </div>
                        <div className="mock-test-meta mb-3">
                          <div>
                            <span>Duration</span>
                            <strong>{test.duration} mins</strong>
                          </div>
                          <div>
                            <span>Sections</span>
                            <strong>{test.sections?.length || 0}</strong>
                          </div>
                        </div>
                        <button className="btn btn-outline-light" onClick={() => start(test)}>Start Test</button>
                      </div>
                    </div>
                  </div>
                );
              }) : (
                <div className="col-12">
                  <div className="card glass-card mock-test-empty-state">
                    <div className="card-body">
                      <h2 className="h4 mb-2">No tests generated yet</h2>
                      <p className="text-secondary mb-0">Generate your first 30-minute assessment to start building a realistic interview rhythm.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="col-lg-4">
            <div className="vstack gap-3">
              <div className="card glass-card mock-test-side-card">
                <div className="card-body">
                  <p className="eyebrow mb-2">Default Test Format</p>
                  <h2 className="h5 mb-3">Interview-style structure</h2>
                  <div className="mock-test-format-grid">
                    <div>
                      <span>Questions</span>
                      <strong>{DEFAULT_TOTAL_QUESTIONS}</strong>
                    </div>
                    <div>
                      <span>Duration</span>
                      <strong>{DEFAULT_DURATION} mins</strong>
                    </div>
                    <div>
                      <span>Company</span>
                      <strong>{selectedCompany || "General"}</strong>
                    </div>
                    <div>
                      <span>Result</span>
                      <strong>Instant</strong>
                    </div>
                  </div>
                </div>
              </div>

              {result && (
                <div className="card glass-card mock-test-side-card">
                  <div className="card-body">
                    <p className="eyebrow mb-2">Latest Result</p>
                    <h2 className="h5 mb-3">Performance Snapshot</h2>
                    <div className="mock-test-result-grid mb-3">
                      <div>
                        <span>Score</span>
                        <strong>{result.score}</strong>
                      </div>
                      <div>
                        <span>Accuracy</span>
                        <strong>{result.accuracy}%</strong>
                      </div>
                    </div>
                    <p className="mb-2"><strong>Weak topics:</strong> {result.weakTopics.join(", ") || "None"}</p>
                    <p className="mb-0"><strong>Strong topics:</strong> {result.strengths.join(", ") || "Keep practicing"}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="row g-4 align-items-start">
          <div className="col-xl-4">
            <div className="card glass-card mock-test-side-card mock-test-active-summary">
              <div className="card-body">
                <p className="eyebrow mb-2">Live Test Summary</p>
                <h2 className="h4 mb-1">{activeTest.title}</h2>
                <p className="text-secondary mb-4">Stay aware of your pace and finish every question with a deliberate answer.</p>

                <div className="mock-test-timer-card mb-4">
                  <span>Time Left</span>
                  <strong>{formatTimeLeft(timeLeft)}</strong>
                </div>

                <div className="mock-test-progress-block mb-4">
                  <div className="d-flex justify-content-between mb-2">
                    <span>Attempt Progress</span>
                    <strong>{progressPercent}%</strong>
                  </div>
                  <div className="progress mock-test-progress-bar">
                    <div className="progress-bar bg-warning" role="progressbar" style={{ width: `${progressPercent}%` }} aria-valuenow={progressPercent} aria-valuemin="0" aria-valuemax="100" />
                  </div>
                </div>

                <div className="mock-test-format-grid">
                  <div>
                    <span>Attempted</span>
                    <strong>{attemptedCount}</strong>
                  </div>
                  <div>
                    <span>Pending</span>
                    <strong>{unansweredCount}</strong>
                  </div>
                  <div>
                    <span>Questions</span>
                    <strong>{flat.length}</strong>
                  </div>
                  <div>
                    <span>Duration</span>
                    <strong>{activeTest.duration} mins</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-8">
            <div className="card glass-card mock-test-active-card">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                  <div>
                    <p className="eyebrow mb-2">Active Assessment</p>
                    <h2 className="h4 mb-1">Answer each question before time runs out</h2>
                    <p className="text-secondary mb-0">{flat.length} questions | {activeTest.duration} minutes</p>
                  </div>
                  <button className="btn btn-success" onClick={submit}>Submit Test</button>
                </div>
                {flat.map((q, i) => (
                  <div key={q._id} className="mock-test-question-block mb-4">
                    <div className="mock-test-question-head">
                      <span className="mock-test-question-number">Q{i + 1}</span>
                      <div>
                        <p className="fw-semibold mb-1">{q.title}</p>
                        <p className="text-secondary mb-0">{q.description}</p>
                      </div>
                    </div>
                    {q.type === "MCQ" ? (
                      <div className="vstack gap-2 mt-3">
                        {q.options.map((option) => (
                          <button
                            key={option}
                            className={`btn ${answers[q._id] === option ? "btn-info" : "btn-outline-light"} text-start`}
                            onClick={() => setAnswers({ ...answers, [q._id]: option })}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <textarea
                        className="form-control mt-3"
                        rows="4"
                        value={answers[q._id] || ""}
                        onChange={(e) => setAnswers({ ...answers, [q._id]: e.target.value })}
                        placeholder="Write your answer here..."
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MockTestsPage;
