import { useEffect, useState } from "react";
import api from "../api/client";

const companyOptions = ["", "Amazon", "Microsoft", "Google", "Infosys", "TCS", "Accenture"];

const MockTestsPage = ({ tests, setTests, refreshProfile }) => {
  const [activeTest, setActiveTest] = useState(null);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [result, setResult] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState("");
  const flat = activeTest?.sections?.flatMap((section) => section.questions) || [];

  useEffect(() => {
    if (!activeTest || timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((value) => value - 1), 1000);
    return () => clearInterval(timer);
  }, [activeTest, timeLeft]);

  useEffect(() => {
    if (activeTest && timeLeft === 0) submit();
  }, [timeLeft]);

  const generate = async () => {
    const { data } = await api.post("/tests", { company: selectedCompany });
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
    const { data } = await api.post(`/tests/${activeTest._id}/submit`, { answers: payload, totalTimeSpent: activeTest.duration * 60 - timeLeft });
    setResult(data);
    setActiveTest(null);
    setTimeLeft(0);
    refreshProfile();
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <div>
          <p className="eyebrow mb-1">Mock Test System</p>
          <h1 className="h2 fw-bold mb-0">Simulate a real interview assessment</h1>
        </div>
        <div className="d-flex gap-2 flex-wrap align-items-center">
          <select className="form-select question-select" value={selectedCompany} onChange={(e) => setSelectedCompany(e.target.value)}>
            {companyOptions.map((company) => <option key={company || "general"} value={company}>{company || "General Mix"}</option>)}
          </select>
          <button className="btn btn-info" onClick={generate}>Generate Mock Test</button>
        </div>
      </div>
      {!activeTest ? <div className="row g-3">{tests.map((test) => <div className="col-lg-6" key={test._id}><div className="card glass-card h-100"><div className="card-body"><h2 className="h5">{test.title}</h2><p className="text-secondary">{test.description}</p><p>Duration: {test.duration} minutes</p><button className="btn btn-outline-light" onClick={() => start(test)}>Start Test</button></div></div></div>)}{result && <div className="col-12"><div className="card glass-card"><div className="card-body"><h2 className="h4">Latest Result</h2><p>Score: {result.score} | Accuracy: {result.accuracy}%</p><p><strong>Weak topics:</strong> {result.weakTopics.join(", ") || "None"}</p><p className="mb-0"><strong>Strong topics:</strong> {result.strengths.join(", ") || "Keep practicing"}</p></div></div></div>}</div> : <div className="card glass-card"><div className="card-body"><div className="d-flex justify-content-between align-items-center mb-4"><h2 className="h4 mb-0">{activeTest.title}</h2><span className="badge text-bg-danger">Time Left: {timeLeft}s</span></div>{flat.map((q, i) => <div key={q._id} className="mb-4 pb-3 border-bottom border-secondary-subtle"><p className="fw-semibold">{i + 1}. {q.title}</p><p className="text-secondary">{q.description}</p>{q.type === "MCQ" ? <div className="vstack gap-2">{q.options.map((option) => <button key={option} className={`btn ${answers[q._id] === option ? "btn-info" : "btn-outline-light"} text-start`} onClick={() => setAnswers({ ...answers, [q._id]: option })}>{option}</button>)}</div> : <textarea className="form-control" rows="4" value={answers[q._id] || ""} onChange={(e) => setAnswers({ ...answers, [q._id]: e.target.value })} />}</div>)}<button className="btn btn-success" onClick={submit}>Submit Test</button></div></div>}
    </div>
  );
};

export default MockTestsPage;
