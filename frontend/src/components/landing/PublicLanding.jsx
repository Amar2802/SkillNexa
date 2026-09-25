import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiCpu,
  FiCode,
  FiAward,
  FiCheckCircle,
  FiClock,
  FiTrendingUp,
  FiLayers,
  FiBookOpen,
  FiTerminal,
  FiShield,
  FiZap,
  FiArrowRight,
  FiPlay,
  FiChevronRight,
  FiCompass,
  FiTarget,
  FiHelpCircle,
  FiFileText
} from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import Button from "../ui/Button";
import Badge from "../ui/Badge";
import Card from "../ui/Card";

export const PublicLanding = ({ activeTab = "home", onTabChange }) => {
  const navigate = useNavigate();
  const { loginAsDemo, user } = useAuth();
  const [selectedPreviewTab, setSelectedPreviewTab] = useState("ide"); // 'ide' | 'interview' | 'analytics'

  const handleLaunchDemo = () => {
    loginAsDemo();
    navigate("/dashboard");
  };

  return (
    <div className="space-y-16 py-6 sm:py-10">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden rounded-3xl border border-[var(--snx-border)] bg-[var(--snx-surface)] p-6 sm:p-10 lg:p-14 shadow-subtle dark:border-slate-800">
        {/* Background Ambient Glow */}
        <div className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl dark:bg-indigo-500/15" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-purple-500/10 blur-3xl dark:bg-purple-500/15" />

        <div className="relative z-10 max-w-3xl space-y-6">
          {/* Badge Kicker */}
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3.5 py-1 text-xs font-bold text-indigo-700 dark:border-indigo-900/60 dark:bg-indigo-950/40 dark:text-indigo-300">
            <span className="flex h-2 w-2 rounded-full bg-indigo-600 animate-pulse" />
            <span>SkillNexa v2.5 — Engineering Interview Intelligence</span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.12]">
            Master technical interviews with <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">intelligent AI feedback.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base lg:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
            Simulate real employer interviews, practice algorithmic coding with instant execution, test under timed exam conditions, and get 7-dimension AI evaluations.
          </p>

          {/* Call-to-Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button
              variant="primary"
              size="lg"
              onClick={handleLaunchDemo}
              iconRight={FiArrowRight}
              className="shadow-lg shadow-indigo-500/25 text-sm font-bold"
            >
              Launch Instant Demo Workspace
            </Button>

            <Link to="/login">
              <Button variant="outline" size="lg" className="text-sm font-semibold">
                Sign In to Account
              </Button>
            </Link>

            <Link to="/signup">
              <Button variant="secondary" size="lg" className="text-sm font-semibold">
                Create Free Account
              </Button>
            </Link>
          </div>

          {/* Quick Value Props */}
          <div className="flex flex-wrap items-center gap-6 pt-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <FiCheckCircle className="h-4 w-4 text-emerald-500" /> No credit card required
            </span>
            <span className="flex items-center gap-1.5">
              <FiCheckCircle className="h-4 w-4 text-emerald-500" /> 1-click instant demo
            </span>
            <span className="flex items-center gap-1.5">
              <FiCheckCircle className="h-4 w-4 text-emerald-500" /> 1,000+ Curated problems
            </span>
          </div>
        </div>

        {/* 2. Interactive Mockup Showcase */}
        <div className="mt-10 pt-8 border-t border-[var(--snx-border-subtle)] dark:border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Live Interface Preview:
              </span>
              <div className="flex rounded-lg border border-[var(--snx-border)] bg-[var(--snx-surface-subtle)] p-0.5 text-xs font-semibold dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedPreviewTab("ide")}
                  className={`px-3 py-1 rounded-md transition ${
                    selectedPreviewTab === "ide"
                      ? "bg-white text-indigo-600 shadow-xs dark:bg-slate-800 dark:text-indigo-400"
                      : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                  }`}
                >
                  Monaco Coding IDE
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedPreviewTab("interview")}
                  className={`px-3 py-1 rounded-md transition ${
                    selectedPreviewTab === "interview"
                      ? "bg-white text-indigo-600 shadow-xs dark:bg-slate-800 dark:text-indigo-400"
                      : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                  }`}
                >
                  AI Interview Room
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedPreviewTab("analytics")}
                  className={`px-3 py-1 rounded-md transition ${
                    selectedPreviewTab === "analytics"
                      ? "bg-white text-indigo-600 shadow-xs dark:bg-slate-800 dark:text-indigo-400"
                      : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                  }`}
                >
                  Evaluation Analytics
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLaunchDemo}
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
            >
              <span>Test Drive This Feature</span>
              <FiChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Mockup Frame */}
          <div className="rounded-2xl border border-[var(--snx-border)] bg-slate-950 p-4 sm:p-6 shadow-2xl text-slate-100 overflow-hidden">
            {selectedPreviewTab === "ide" && (
              <div className="space-y-4 font-mono text-xs">
                {/* Editor Header Bar */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-rose-500/80" />
                    <div className="h-3 w-3 rounded-full bg-amber-500/80" />
                    <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
                    <span className="ml-2 text-slate-400 text-[11px]">two_sum_optimized.py</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-indigo-950 px-2 py-0.5 text-[10px] text-indigo-300 border border-indigo-800">Python 3.11</span>
                    <span className="rounded bg-emerald-950 px-2 py-0.5 text-[10px] text-emerald-300 border border-emerald-800">All Tests Passing (3/3)</span>
                  </div>
                </div>

                {/* Code Window */}
                <div className="py-2 leading-relaxed text-slate-300 overflow-x-auto">
                  <div><span className="text-purple-400">def</span> <span className="text-blue-400">two_sum</span>(nums: list[int], target: int) -&gt; list[int]:</div>
                  <div className="pl-4 text-slate-500"># Hash map approach achieving O(N) time and O(N) space</div>
                  <div className="pl-4">seen = &#123;&#125;</div>
                  <div className="pl-4"><span className="text-purple-400">for</span> i, num <span className="text-purple-400">in</span> enumerate(nums):</div>
                  <div className="pl-8">complement = target - num</div>
                  <div className="pl-8"><span className="text-purple-400">if</span> complement <span className="text-purple-400">in</span> seen:</div>
                  <div className="pl-12"><span className="text-purple-400">return</span> [seen[complement], i]</div>
                  <div className="pl-8">seen[num] = i</div>
                  <div className="pl-4"><span className="text-purple-400">return</span> []</div>
                </div>

                {/* Console Output Bar */}
                <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-400 font-sans text-xs">
                    <FiCheckCircle className="h-4 w-4 shrink-0" />
                    <span>Test Suite Passed: Output [0, 1] matches expected result in 18ms.</span>
                  </div>
                  <span className="text-slate-400 text-[11px]">Memory: 14.8 MB</span>
                </div>
              </div>
            )}

            {selectedPreviewTab === "interview" && (
              <div className="space-y-4 text-xs font-sans">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="flex h-2.5 w-2.5 rounded-full bg-rose-500 animate-ping" />
                    <span className="font-bold text-rose-400 uppercase tracking-wider text-[11px]">Live AI Interview Simulation</span>
                  </div>
                  <span className="font-mono text-slate-400">Round 2: System Architecture</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <span className="text-[10px] font-bold text-indigo-400 uppercase">Interviewer Prompt:</span>
                  <p className="text-sm font-semibold text-slate-200">
                    &quot;How would you design a distributed caching layer that avoids cache thundering herds during high traffic flash sales?&quot;
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Candidate Speech</span>
                    <span className="text-emerald-400 font-bold mt-1 block">Live Voice Transcription Active</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Real-time Pacing</span>
                    <span className="text-slate-200 font-mono font-bold mt-1 block">01:42 remaining</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Follow-up Engine</span>
                    <span className="text-purple-400 font-bold mt-1 block">Adaptive Depth: High</span>
                  </div>
                </div>
              </div>
            )}

            {selectedPreviewTab === "analytics" && (
              <div className="space-y-4 text-xs font-sans">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span className="font-bold text-indigo-400 uppercase tracking-wider text-[11px]">Automated Candidate Rubric</span>
                  <span className="font-mono text-emerald-400 font-bold">Overall Score: 88 / 100</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Technical Accuracy</span>
                    <div className="text-lg font-bold text-indigo-400 mt-1">9.2 / 10</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Communication</span>
                    <div className="text-lg font-bold text-purple-400 mt-1">8.5 / 10</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Time Complexity</span>
                    <div className="text-lg font-bold text-emerald-400 mt-1">Optimal O(N)</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-[10px] text-slate-400 block">Readiness Tier</span>
                    <div className="text-lg font-bold text-amber-400 mt-1">Tier-1 Ready</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 3. CORE MODULE HIGHLIGHTS */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <Badge variant="primary" size="md">Platform Features</Badge>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            Everything you need for product-grade engineering interviews
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            A cohesive developer preparation platform spanning coding, live interviewing, structured roadmaps, and analytics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Card 1: AI Interviewer */}
          <div className="p-6 rounded-2xl border border-[var(--snx-border)] bg-[var(--snx-surface)] shadow-subtle dark:border-slate-800 flex flex-col justify-between space-y-4 hover:border-indigo-400 transition">
            <div className="space-y-3">
              <div className="h-10 w-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <FiCpu className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Live AI Mock Interviewer
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Adaptive text and voice technical interview simulations with role-specific rounds, follow-up challenges, and consolidated debrief reports.
              </p>
            </div>
            <button
              type="button"
              onClick={handleLaunchDemo}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
            >
              <span>Explore AI Interviews</span>
              <FiArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Card 2: Coding Practice */}
          <div className="p-6 rounded-2xl border border-[var(--snx-border)] bg-[var(--snx-surface)] shadow-subtle dark:border-slate-800 flex flex-col justify-between space-y-4 hover:border-indigo-400 transition">
            <div className="space-y-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <FiTerminal className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Monaco Coding IDE
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Integrated multi-language coding editor with real-time runner, starter templates, custom test cases, and algorithmic complexity verification.
              </p>
            </div>
            <button
              type="button"
              onClick={handleLaunchDemo}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400"
            >
              <span>Start Problem Solving</span>
              <FiArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Card 3: Mock Tests */}
          <div className="p-6 rounded-2xl border border-[var(--snx-border)] bg-[var(--snx-surface)] shadow-subtle dark:border-slate-800 flex flex-col justify-between space-y-4 hover:border-indigo-400 transition">
            <div className="space-y-3">
              <div className="h-10 w-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <FiClock className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Timed Mock Assessments
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                30-minute balanced assessments simulating actual employer screening rounds with MCQs, coding logic, and instant scoring breakdown.
              </p>
            </div>
            <button
              type="button"
              onClick={handleLaunchDemo}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-600 hover:text-purple-700 dark:text-purple-400"
            >
              <span>Take a Mock Test</span>
              <FiArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Card 4: Learning Roadmaps */}
          <div className="p-6 rounded-2xl border border-[var(--snx-border)] bg-[var(--snx-surface)] shadow-subtle dark:border-slate-800 flex flex-col justify-between space-y-4 hover:border-indigo-400 transition">
            <div className="space-y-3">
              <div className="h-10 w-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <FiLayers className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Curated Roadmaps
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Step-by-step career progression tracks for Frontend, Backend, Full Stack, Data Science, and DevOps with progress checkoffs.
              </p>
            </div>
            <button
              type="button"
              onClick={handleLaunchDemo}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 hover:text-amber-700 dark:text-amber-400"
            >
              <span>View Career Tracks</span>
              <FiArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Card 5: AI Mentor */}
          <div className="p-6 rounded-2xl border border-[var(--snx-border)] bg-[var(--snx-surface)] shadow-subtle dark:border-slate-800 flex flex-col justify-between space-y-4 hover:border-indigo-400 transition">
            <div className="space-y-3">
              <div className="h-10 w-10 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center">
                <FiZap className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                24/7 AI Developer Coach
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Ask deep technical questions, debug edge cases, revise core CS fundamentals, and receive tailored advice from an AI technical mentor.
              </p>
            </div>
            <button
              type="button"
              onClick={handleLaunchDemo}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-600 hover:text-sky-700 dark:text-sky-400"
            >
              <span>Chat with Mentor</span>
              <FiArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Card 6: Revision & Spaced Repetition */}
          <div className="p-6 rounded-2xl border border-[var(--snx-border)] bg-[var(--snx-surface)] shadow-subtle dark:border-slate-800 flex flex-col justify-between space-y-4 hover:border-indigo-400 transition">
            <div className="space-y-3">
              <div className="h-10 w-10 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                <FiBookOpen className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Revision Studio
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Spaced repetition flashcards, automatic mistake reviews, and one-click printable cheat sheets to cement key technical concepts.
              </p>
            </div>
            <button
              type="button"
              onClick={handleLaunchDemo}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:text-rose-700 dark:text-rose-400"
            >
              <span>Open Revision Studio</span>
              <FiArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* 4. INSTANT DEMO CALLOUT BANNER */}
      <section className="rounded-3xl border border-indigo-200 bg-gradient-to-r from-indigo-50 via-white to-purple-50 p-8 sm:p-12 dark:border-indigo-900/50 dark:from-indigo-950/40 dark:via-slate-900 dark:to-purple-950/30 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <Badge variant="primary" size="sm">Zero Setup Required</Badge>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            Ready to explore the redesigned SkillNexa workspace?
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Click below to instantly launch the full platform as a demo developer. You will have immediate access to all 12 modules with zero registration needed.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          <Button
            variant="primary"
            size="lg"
            onClick={handleLaunchDemo}
            iconRight={FiPlay}
            className="shadow-lg shadow-indigo-500/20 font-bold"
          >
            Launch Instant Demo Workspace
          </Button>

          <Link to="/login">
            <Button variant="secondary" size="lg" className="font-semibold">
              Sign In
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default PublicLanding;
