import { useState } from "react";
import {
  FiZap,
  FiAward,
  FiClock,
  FiBriefcase,
  FiLayers,
  FiCheckCircle,
  FiArrowRight,
  FiArrowLeft,
  FiMic,
  FiFileText,
  FiCompass
} from "react-icons/fi";
import Card, { CardHeader, CardTitle, CardContent } from "../ui/Card";
import Button from "../ui/Button";
import Badge from "../ui/Badge";
import Select from "../ui/Select";

const ROLE_OPTIONS = [
  "Software Engineer",
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Data Analyst",
  "QA Engineer"
];

const DOMAIN_OPTIONS = [
  "DSA",
  "JavaScript",
  "React",
  "Node",
  "MongoDB",
  "DBMS",
  "OS",
  "CN",
  "SQL",
  "Mixed"
];

const EXPERIENCE_OPTIONS = ["Fresher", "1-2 Years", "3-5 Years", "5+ Years"];
const DIFFICULTY_OPTIONS = ["Easy", "Medium", "Hard"];
const COMPANY_OPTIONS = ["General", "Amazon", "Microsoft", "Google", "Infosys", "TCS", "Accenture"];
const ROUND_TYPES = ["Full Loop", "Technical", "HR", "Mixed"];

export const InterviewConfigurator = ({
  config,
  onChangeConfig,
  onLaunchInterview,
  loading = false,
  pastSessions = [],
  onSelectPastSession
}) => {
  const [step, setStep] = useState(1);

  return (
    <div className="space-y-8">
      {/* Setup Step Progress Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 snx-scrollbar">
        {[
          { id: 1, label: "Role & Domain" },
          { id: 2, label: "Level & Company" },
          { id: 3, label: "Mode & Summary" }
        ].map((s) => {
          const isActive = step === s.id;
          const isComplete = step > s.id;

          return (
            <button
              key={s.id}
              type="button"
              onClick={() => setStep(s.id)}
              className={`flex items-center gap-2.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                isActive
                  ? "bg-indigo-600 text-white shadow-subtle"
                  : isComplete
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
              }`}
            >
              <span className={`flex h-5 w-5 items-center justify-center rounded-lg text-[10px] font-black ${
                isActive ? "bg-white/20 text-white" : isComplete ? "bg-emerald-500 text-white" : "bg-slate-200 dark:bg-slate-700"
              }`}>
                {isComplete ? "✓" : s.id}
              </span>
              <span>{s.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main 2-Column Configuration Body */}
      <div className="grid gap-6 lg:grid-cols-[1fr_360px] items-start">
        {/* Step Forms */}
        <Card className="p-6 border border-[var(--snx-border)] bg-[var(--snx-surface)] space-y-6">
          {/* STEP 1: Role & Domain */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  Step 1 of 3
                </span>
                <h2 className="text-xl font-black text-slate-900 dark:text-white mt-1">
                  Choose Your Target Engineering Role
                </h2>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Tailors questions to match industry hiring standards for your specialization.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Select
                  label="Target Job Role"
                  value={config.role}
                  onChange={(e) => onChangeConfig({ ...config, role: e.target.value })}
                  options={ROLE_OPTIONS.map((r) => ({ label: r, value: r }))}
                />

                <Select
                  label="Technical Domain Focus"
                  value={config.domain}
                  onChange={(e) => onChangeConfig({ ...config, domain: e.target.value })}
                  options={DOMAIN_OPTIONS.map((d) => ({ label: d, value: d }))}
                />
              </div>

              {/* Experience Tier Selector */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Experience Tier
                </span>
                <div className="grid gap-2.5 sm:grid-cols-2 md:grid-cols-4">
                  {EXPERIENCE_OPTIONS.map((exp) => {
                    const isSelected = config.experienceLevel === exp;
                    return (
                      <button
                        key={exp}
                        type="button"
                        onClick={() => onChangeConfig({ ...config, experienceLevel: exp })}
                        className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? "border-indigo-600 bg-indigo-50/70 text-indigo-950 font-bold ring-2 ring-indigo-500/20 dark:bg-indigo-950/40 dark:text-indigo-200 dark:border-indigo-800"
                            : "border-[var(--snx-border)] bg-[var(--snx-surface)] text-slate-700 hover:border-slate-300 dark:text-slate-300 dark:hover:border-slate-700"
                        }`}
                      >
                        <div className="text-xs font-bold">{exp}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {exp === "Fresher" ? "Foundational fundamentals" : "System & scaling depth"}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-[var(--snx-border)]">
                <Button
                  variant="primary"
                  size="sm"
                  iconRight={FiArrowRight}
                  onClick={() => setStep(2)}
                >
                  Continue to Difficulty
                </Button>
              </div>
            </div>
          )}

          {/* STEP 2: Difficulty & Company */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  Step 2 of 3
                </span>
                <h2 className="text-xl font-black text-slate-900 dark:text-white mt-1">
                  Difficulty & Company Benchmark
                </h2>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Calibrate the evaluation rigor against specific company interview loops.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Select
                  label="Difficulty Level"
                  value={config.difficulty}
                  onChange={(e) => onChangeConfig({ ...config, difficulty: e.target.value })}
                  options={DIFFICULTY_OPTIONS.map((d) => ({ label: d, value: d }))}
                />

                <Select
                  label="Target Company Standard"
                  value={config.company}
                  onChange={(e) => onChangeConfig({ ...config, company: e.target.value })}
                  options={COMPANY_OPTIONS.map((c) => ({ label: c, value: c }))}
                />
              </div>

              {/* Round Type Choice */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Interview Round Structure
                </span>
                <div className="grid gap-2.5 sm:grid-cols-2">
                  {ROUND_TYPES.map((rt) => {
                    const isSelected = config.roundType === rt;
                    return (
                      <button
                        key={rt}
                        type="button"
                        onClick={() => onChangeConfig({ ...config, roundType: rt })}
                        className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? "border-indigo-600 bg-indigo-50/70 text-indigo-950 font-bold ring-2 ring-indigo-500/20 dark:bg-indigo-950/40 dark:text-indigo-200 dark:border-indigo-800"
                            : "border-[var(--snx-border)] bg-[var(--snx-surface)] text-slate-700 hover:border-slate-300 dark:text-slate-300 dark:hover:border-slate-700"
                        }`}
                      >
                        <div className="text-xs font-bold">{rt} Round</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {rt === "Full Loop"
                            ? "DSA + Core CS + HR Final"
                            : rt === "Technical"
                            ? "Coding & System architecture"
                            : rt === "HR"
                            ? "STAR behavioral & communication"
                            : "Balanced comprehensive mix"}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-between pt-4 border-t border-[var(--snx-border)]">
                <Button
                  variant="outline"
                  size="sm"
                  iconLeft={FiArrowLeft}
                  onClick={() => setStep(1)}
                >
                  Back
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  iconRight={FiArrowRight}
                  onClick={() => setStep(3)}
                >
                  Continue to Format
                </Button>
              </div>
            </div>
          )}

          {/* STEP 3: Mode & Pre-Launch Review */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  Step 3 of 3
                </span>
                <h2 className="text-xl font-black text-slate-900 dark:text-white mt-1">
                  Interview Mode & Final Review
                </h2>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Select your preferred interaction mode to launch the interview room.
                </p>
              </div>

              {/* Mode Selection */}
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  {
                    mode: "Text",
                    title: "Text & Code Format",
                    icon: FiFileText,
                    desc: "Type answers in structured markdown & code editor format. Ideal for coding rounds."
                  },
                  {
                    mode: "Voice",
                    title: "Speech & Audio Simulation",
                    icon: FiMic,
                    desc: "Speak your answers via microphone. AI transcribes and assesses verbal communication style."
                  }
                ].map((item) => {
                  const isSelected = config.mode === item.mode;
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.mode}
                      type="button"
                      onClick={() => onChangeConfig({ ...config, mode: item.mode })}
                      className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? "border-indigo-600 bg-indigo-50/70 text-indigo-950 font-bold ring-2 ring-indigo-500/20 dark:bg-indigo-950/40 dark:text-indigo-200 dark:border-indigo-800"
                          : "border-[var(--snx-border)] bg-[var(--snx-surface)] text-slate-700 hover:border-slate-300 dark:text-slate-300 dark:hover:border-slate-700"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Icon className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                        <span className="text-xs font-bold">{item.title}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                        {item.desc}
                      </p>
                    </button>
                  );
                })}
              </div>

              <div className="flex justify-between pt-4 border-t border-[var(--snx-border)]">
                <Button
                  variant="outline"
                  size="sm"
                  iconLeft={FiArrowLeft}
                  onClick={() => setStep(2)}
                >
                  Back
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  iconRight={FiZap}
                  disabled={loading}
                  onClick={onLaunchInterview}
                  className="font-bold shadow-md"
                >
                  {loading ? "Generating Loop..." : "Launch Interview"}
                </Button>
              </div>
            </div>
          )}
        </Card>

        {/* Sidebar: Pre-Start Summary & History */}
        <aside className="space-y-6">
          {/* Summary Card */}
          <Card className="p-5 border border-[var(--snx-border)] bg-[var(--snx-surface)] space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-[var(--snx-border)]">
              <FiBriefcase className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Interview Session Summary
              </h3>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1 border-b border-[var(--snx-border)]">
                <span className="text-slate-400">Target Role</span>
                <span className="font-bold text-slate-900 dark:text-white">{config.role}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[var(--snx-border)]">
                <span className="text-slate-400">Domain</span>
                <Badge variant="primary" size="sm">{config.domain}</Badge>
              </div>
              <div className="flex justify-between py-1 border-b border-[var(--snx-border)]">
                <span className="text-slate-400">Rounds</span>
                <span className="font-bold text-slate-900 dark:text-white">{config.roundType}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[var(--snx-border)]">
                <span className="text-slate-400">Difficulty</span>
                <Badge
                  variant={config.difficulty === "Easy" ? "success" : config.difficulty === "Medium" ? "warning" : "danger"}
                  size="sm"
                >
                  {config.difficulty}
                </Badge>
              </div>
              <div className="flex justify-between py-1 border-b border-[var(--snx-border)]">
                <span className="text-slate-400">Target Benchmark</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">{config.company} Standard</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Interaction</span>
                <span className="font-semibold text-indigo-600 dark:text-indigo-400">{config.mode} Stream</span>
              </div>
            </div>

            <Button
              variant="primary"
              size="sm"
              iconRight={FiZap}
              disabled={loading}
              onClick={onLaunchInterview}
              className="w-full justify-center mt-2 shadow-subtle"
            >
              {loading ? "Generating Loop..." : "Start Interview"}
            </Button>
          </Card>

          {/* Past Sessions History (If any) */}
          {pastSessions.length > 0 && (
            <Card className="p-5 border border-[var(--snx-border)] bg-[var(--snx-surface)] space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-[var(--snx-border)]">
                <FiClock className="h-4 w-4 text-purple-500" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Recent Interviews ({pastSessions.length})
                </h4>
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto snx-scrollbar pr-1">
                {pastSessions.map((session) => (
                  <div
                    key={session._id}
                    onClick={() => onSelectPastSession && onSelectPastSession(session)}
                    className="p-3 rounded-xl border border-[var(--snx-border)] hover:border-indigo-400 transition cursor-pointer bg-white dark:bg-slate-800/60 flex items-center justify-between gap-2"
                  >
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {session.role}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {new Date(session.createdAt).toLocaleDateString()} • {session.difficulty}
                      </div>
                    </div>
                    <Badge variant="primary" size="sm">
                      {session.overallScore}%
                    </Badge>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </aside>
      </div>
    </div>
  );
};

export default InterviewConfigurator;
