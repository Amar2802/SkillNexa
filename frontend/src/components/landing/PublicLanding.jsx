import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FiBarChart2,
  FiBookOpen,
  FiCpu,
  FiLayers,
  FiMessageCircle,
  FiTarget,
  FiTrendingUp,
  FiZap
} from "react-icons/fi";

const fade = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -6 },
  transition: { duration: 0.2 }
};

const exploreFeatures = [
  { title: "AI Mock Interviews", body: "Role-aware loops with recruiter-style follow-ups.", icon: FiCpu },
  { title: "Question Bank", body: "Company-tagged prompts across DSA, core, and HR.", icon: FiBookOpen },
  { title: "DSA Practice", body: "Timed coding with solution explanations.", icon: FiZap },
  { title: "Core Subjects", body: "DBMS, OS, networks, and OOP revision.", icon: FiLayers },
  { title: "Progress Tracking", body: "Scores, trends, and topic mastery charts.", icon: FiTrendingUp },
  { title: "AI Feedback", body: "7-dimension evaluation on every answer.", icon: FiMessageCircle }
];

const workflowSteps = ["Choose Role", "Generate Questions", "Answer", "Get AI Feedback"];

const aboutStats = [
  { label: "Interview prompts", value: "1000+" },
  { label: "Evaluation dimensions", value: "7" },
  { label: "Practice modules", value: "6+" }
];

const roadmap = [
  "Voice-based mock interviews",
  "Company-specific adaptive loops",
  "Peer comparison benchmarks"
];

const HomeSection = ({ onExplore }) => (
  <motion.div {...fade} className="space-y-6">
    <div className="snx-panel relative overflow-hidden !p-6 md:!p-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(79,70,229,0.12),transparent_40%)]" />
      <div className="relative space-y-5">
        <span className="snx-kicker">SkillNexa</span>
        <h1 className="text-3xl font-bold tracking-tight text-slate-custom-900 dark:text-white md:text-4xl">
          Your AI-powered interview preparation workspace.
        </h1>
        <blockquote className="border-l-4 border-brand-500 pl-4 text-sm italic text-slate-custom-600 dark:text-slate-custom-300">
          &ldquo;Every expert was once a beginner who refused to stop learning.&rdquo;
        </blockquote>
        <div className="flex flex-wrap gap-3">
          <Link to="/signup" className="snx-btn-primary">Get Started</Link>
          <button type="button" className="snx-btn-secondary" onClick={onExplore}>
            Explore Features
          </button>
        </div>
      </div>
    </div>
  </motion.div>
);

const ExploreSection = () => (
  <motion.div {...fade} className="space-y-4">
    <div>
      <span className="snx-kicker">Explore</span>
      <h2 className="mt-1 text-xl font-semibold text-slate-custom-900 dark:text-white">Everything you need to prepare</h2>
    </div>
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {exploreFeatures.map(({ title, body, icon: Icon }) => (
        <div key={title} className="snx-card flex h-full flex-col !p-5">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-brand-600 dark:bg-indigo-500/20 dark:text-indigo-300">
            <Icon className="h-4 w-4" />
          </span>
          <h3 className="mt-3 text-sm font-semibold text-slate-custom-900 dark:text-white">{title}</h3>
          <p className="mt-1 flex-1 text-xs leading-relaxed text-slate-custom-500">{body}</p>
        </div>
      ))}
    </div>
  </motion.div>
);

const MockInterviewsSection = () => (
  <motion.div {...fade} className="space-y-4">
    <div>
      <span className="snx-kicker">Mock Interviews</span>
      <h2 className="mt-1 text-xl font-semibold text-slate-custom-900 dark:text-white">How it works</h2>
    </div>
    <div className="snx-panel-muted !p-5">
      <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-custom-600 dark:text-slate-custom-300">
        {workflowSteps.map((step, index) => (
          <span key={step} className="inline-flex items-center gap-2">
            <span className="inline-flex h-7 min-w-[7rem] items-center justify-center rounded-lg bg-gradient-to-r from-brand-500 to-accent-500 px-3 text-white">
              {step}
            </span>
            {index < workflowSteps.length - 1 ? <span className="text-slate-custom-400">→</span> : null}
          </span>
        ))}
      </div>
    </div>
    <div className="grid gap-4 md:grid-cols-2">
      <div className="snx-card h-full !p-5">
        <span className="snx-label">Sample question</span>
        <p className="mt-3 text-sm leading-relaxed text-slate-custom-700 dark:text-slate-custom-200">
          Explain how you would design a rate limiter for an API. Cover algorithm choice, trade-offs, and how you would test it in production.
        </p>
        <span className="snx-badge-primary mt-3">Technical · Medium</span>
      </div>
      <div className="snx-card h-full !p-5">
        <span className="snx-label">AI score preview</span>
        <div className="mt-4 flex items-center gap-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-accent-500 text-2xl font-bold text-white shadow-elevation-1">
            84
          </div>
          <div className="flex-1 space-y-2 text-xs">
            {[
              { label: "Technical", value: 9 },
              { label: "Communication", value: 8 },
              { label: "Clarity", value: 8 }
            ].map((row) => (
              <div key={row.label}>
                <div className="mb-0.5 flex justify-between text-slate-custom-600 dark:text-slate-custom-300">
                  <span>{row.label}</span>
                  <span>{row.value}/10</span>
                </div>
                <div className="h-1.5 rounded-full bg-slate-custom-100 dark:bg-slate-custom-700">
                  <div className="h-1.5 rounded-full bg-brand-500" style={{ width: `${row.value * 10}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <p className="mt-3 text-xs text-slate-custom-500">Recruiter-style feedback and follow-up questions included.</p>
      </div>
    </div>
  </motion.div>
);

const AboutSection = () => (
  <motion.div {...fade} className="space-y-4">
    <div className="snx-panel-muted !p-5">
      <span className="snx-kicker">Mission</span>
      <p className="mt-2 text-sm leading-relaxed text-slate-custom-600 dark:text-slate-custom-300">
        SkillNexa helps learners practice like they are in a real interview room — with structured questions, instant AI evaluation, and actionable improvement paths.
      </p>
    </div>
    <div className="grid gap-4 md:grid-cols-2">
      <div className="snx-card h-full !p-5">
        <div className="flex items-center gap-2">
          <FiTarget className="h-4 w-4 text-brand-500" />
          <h3 className="text-sm font-semibold text-slate-custom-900 dark:text-white">Why SkillNexa</h3>
        </div>
        <ul className="mt-3 space-y-2 text-xs text-slate-custom-600 dark:text-slate-custom-300">
          <li>• One workspace for mocks, practice, and analytics</li>
          <li>• AI scoring on every submitted answer</li>
          <li>• Built for product-grade interview readiness</li>
        </ul>
      </div>
      <div className="snx-card h-full !p-5">
        <div className="flex items-center gap-2">
          <FiBarChart2 className="h-4 w-4 text-brand-500" />
          <h3 className="text-sm font-semibold text-slate-custom-900 dark:text-white">Platform stats</h3>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {aboutStats.map((item) => (
            <div key={item.label} className="rounded-lg bg-slate-custom-50 p-2 text-center dark:bg-slate-custom-800">
              <div className="text-lg font-bold text-brand-600 dark:text-brand-400">{item.value}</div>
              <div className="mt-0.5 text-[10px] uppercase tracking-wide text-slate-custom-500">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
    <div className="snx-card !p-5">
      <span className="snx-label">Roadmap highlights</span>
      <ul className="mt-3 flex flex-wrap gap-2">
        {roadmap.map((item) => (
          <li key={item} className="snx-badge-primary">{item}</li>
        ))}
      </ul>
    </div>
  </motion.div>
);

const sections = {
  home: HomeSection,
  explore: ExploreSection,
  mock: MockInterviewsSection,
  about: AboutSection
};

const PublicLanding = ({ activeTab, onTabChange }) => {
  const Section = sections[activeTab] || HomeSection;

  return (
    <div className="py-4 md:py-6">
      <AnimatePresence mode="wait">
        <Section key={activeTab} onExplore={() => onTabChange("explore")} />
      </AnimatePresence>
    </div>
  );
};

export default PublicLanding;
