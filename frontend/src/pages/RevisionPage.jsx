import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiBookOpen, FiBookmark, FiClock, FiFileText, FiAlertCircle, FiChevronRight, FiPrinter } from "react-icons/fi";
import api from "../api/client";
import PageHeader from "../components/ui/PageHeader";
import LoadingScreen from "../components/ui/LoadingScreen";
import EmptyState from "../components/ui/EmptyState";
import { useToast } from "../components/ui/ToastProvider";

const RevisionPage = () => {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    wrongQuestions: [],
    bookmarkedQuestions: [],
    recentlyViewed: [],
    frequentlyFailedTopics: [],
    revisionSheet: []
  });

  useEffect(() => {
    fetchRevisionData();
  }, []);

  const fetchRevisionData = async () => {
    try {
      setLoading(true);
      const res = await api.get("/users/revision");
      setData(res.data);
    } catch (error) {
      showToast("Failed to load revision workspace", "error");
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return <LoadingScreen title="Loading Revision Workspace..." subtitle="Assembling wrong answers, bookmarks, and revision notes" />;
  }

  const hasContent = 
    data.wrongQuestions.length > 0 || 
    data.bookmarkedQuestions.length > 0 || 
    data.recentlyViewed.length > 0;

  if (!hasContent) {
    return (
      <div className="space-y-6">
        <PageHeader kicker="Practice Revision" title="Revision Workspace" description="Your centralized hub for wrong answers, bookmarks, and topic revisions." />
        <EmptyState
          title="Revision desk is empty"
          description="Practice questions, take mock tests, or bookmark topics to populate your personalized revision panel."
          action={<button className="snx-btn-primary" onClick={() => navigate("/practice")}>Practice Now</button>}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 snx-fade-in print:bg-white print:text-black">
      <div className="print:hidden">
        <PageHeader
          kicker="Track & Retain"
          title="Revision Workspace"
          description="Review recently viewed questions, failed topics, and study your automatically generated revision sheet."
          actions={
            <button onClick={handlePrint} className="snx-btn-primary flex items-center gap-2 cursor-pointer">
              <FiPrinter className="h-4 w-4" /> Print Revision Sheet
            </button>
          }
        />
      </div>

      {/* Grid: Wrong, Bookmarked, and Recent */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 print:hidden">
        
        {/* Wrong Questions Panel */}
        <div className="snx-panel-muted space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-custom-100 pb-2 dark:border-slate-custom-850">
            <FiAlertCircle className="h-5 w-5 text-red-500" />
            <h3 className="font-bold text-slate-custom-900 dark:text-white text-sm uppercase tracking-wider">Wrong Questions ({data.wrongQuestions.length})</h3>
          </div>
          {data.wrongQuestions.length > 0 ? (
            <div className="space-y-2 max-h-[380px] overflow-y-auto snx-scrollbar pr-1">
              {data.wrongQuestions.map((q) => (
                <Link
                  key={q._id}
                  to={`/practice/${q._id}`}
                  className="block p-3 rounded-xl border border-slate-custom-200 bg-white hover:border-red-400 hover:shadow-sm-soft dark:border-slate-custom-700 dark:bg-slate-custom-800 transition duration-150"
                >
                  <div className="font-semibold text-xs text-slate-custom-900 dark:text-white truncate">{q.title}</div>
                  <div className="mt-1 flex items-center justify-between text-[10px] text-slate-custom-500">
                    <span>{q.topic} • {q.difficulty}</span>
                    <span className="text-red-500 font-semibold flex items-center gap-1">Resolve <FiChevronRight className="h-3 w-3" /></span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-custom-500 italic">No wrong answers found. Great accuracy!</p>
          )}
        </div>

        {/* Bookmarked Questions Panel */}
        <div className="snx-panel-muted space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-custom-100 pb-2 dark:border-slate-custom-850">
            <FiBookmark className="h-5 w-5 text-brand-500" />
            <h3 className="font-bold text-slate-custom-900 dark:text-white text-sm uppercase tracking-wider">Bookmarked ({data.bookmarkedQuestions.length})</h3>
          </div>
          {data.bookmarkedQuestions.length > 0 ? (
            <div className="space-y-2 max-h-[380px] overflow-y-auto snx-scrollbar pr-1">
              {data.bookmarkedQuestions.map((q) => (
                <Link
                  key={q._id}
                  to={`/practice/${q._id}`}
                  className="block p-3 rounded-xl border border-slate-custom-200 bg-white hover:border-brand-400 hover:shadow-sm-soft dark:border-slate-custom-700 dark:bg-slate-custom-800 transition duration-150"
                >
                  <div className="font-semibold text-xs text-slate-custom-900 dark:text-white truncate">{q.title}</div>
                  <div className="mt-1 flex items-center justify-between text-[10px] text-slate-custom-500">
                    <span>{q.topic} • {q.difficulty}</span>
                    <span className="text-brand-500 font-semibold flex items-center gap-1">Practice <FiChevronRight className="h-3 w-3" /></span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-custom-500 italic">No bookmarked questions. Click the bookmark icon in questions to add.</p>
          )}
        </div>

        {/* Recently Viewed Panel */}
        <div className="snx-panel-muted space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-custom-100 pb-2 dark:border-slate-custom-850">
            <FiClock className="h-5 w-5 text-indigo-500" />
            <h3 className="font-bold text-slate-custom-900 dark:text-white text-sm uppercase tracking-wider">Recently Viewed ({data.recentlyViewed.length})</h3>
          </div>
          {data.recentlyViewed.length > 0 ? (
            <div className="space-y-2 max-h-[380px] overflow-y-auto snx-scrollbar pr-1">
              {data.recentlyViewed.map((q) => (
                <Link
                  key={q._id}
                  to={`/practice/${q._id}`}
                  className="block p-3 rounded-xl border border-slate-custom-200 bg-white hover:border-indigo-400 hover:shadow-sm-soft dark:border-slate-custom-700 dark:bg-slate-custom-800 transition duration-150"
                >
                  <div className="font-semibold text-xs text-slate-custom-900 dark:text-white truncate">{q.title}</div>
                  <div className="mt-1 flex items-center justify-between text-[10px] text-slate-custom-500">
                    <span>{q.topic} • {q.difficulty}</span>
                    <span className="text-indigo-500 font-semibold flex items-center gap-1">Revisit <FiChevronRight className="h-3 w-3" /></span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-custom-500 italic">No recently viewed questions logged yet.</p>
          )}
        </div>

      </div>

      {/* Frequently Failed Topics Alert */}
      {data.frequentlyFailedTopics.length > 0 && (
        <div className="snx-panel-muted !p-4 bg-red-50/50 border-red-200 dark:bg-red-950/10 dark:border-red-900/40 flex flex-wrap items-center justify-between gap-4 print:hidden">
          <div className="flex gap-3 items-center">
            <FiAlertCircle className="h-6 w-6 text-red-500 shrink-0" />
            <div>
              <h4 className="text-sm font-semibold text-red-900 dark:text-red-300">Weak Topics Identified</h4>
              <p className="text-xs text-red-700 dark:text-red-400 mt-0.5">We found repeated failed attempts in these topics. Study their cheat sheets below.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {data.frequentlyFailedTopics.map((item) => (
              <span key={item.topic} className="px-3 py-1 rounded-full text-xs font-bold bg-white text-red-700 border border-red-200 dark:bg-slate-custom-800 dark:text-red-300 dark:border-red-900">
                {item.topic} ({item.count} fails)
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Automated Study Revision Sheet */}
      <div className="snx-panel-muted space-y-6 print:border-0 print:shadow-none print:p-0">
        <div className="flex items-center justify-between border-b border-slate-custom-200 pb-3 dark:border-slate-custom-700">
          <div className="flex items-center gap-2">
            <FiFileText className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="font-bold text-slate-custom-900 dark:text-white text-base">Your Customized Study Revision Sheet</h3>
          </div>
          <span className="text-xs text-slate-custom-500 font-semibold print:hidden">Generated from weak and bookmarked topics</span>
        </div>

        {data.revisionSheet.length > 0 ? (
          <div className="space-y-6 divide-y divide-slate-custom-100 dark:divide-slate-custom-800 print:divide-slate-200">
            {data.revisionSheet.map((sheet, index) => (
              <div key={sheet.topic} className={`pt-6 first:pt-0 space-y-4 ${index > 0 ? "print:page-break-before" : ""}`}>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h4 className="text-lg font-bold text-slate-custom-900 dark:text-white print:text-black">{sheet.topic}</h4>
                  <span className="text-xs font-medium text-slate-custom-500 uppercase">
                    {sheet.subject} • {sheet.level}
                  </span>
                </div>

                <div className="space-y-2">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-slate-custom-700 dark:text-slate-custom-200 flex items-center gap-2 print:text-black">
                    <FiBookOpen className="h-3.5 w-3.5" /> Cheat Sheet Notes
                  </h5>
                  <p className="text-xs leading-relaxed text-slate-custom-600 dark:text-slate-custom-300 bg-slate-custom-50 dark:bg-slate-custom-850 p-4 rounded-xl print:bg-slate-100 print:text-black">
                    {sheet.cheatSheet}
                  </p>
                </div>

                {sheet.flashcards && sheet.flashcards.length > 0 && (
                  <div className="space-y-3">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-slate-custom-700 dark:text-slate-custom-200 flex items-center gap-2 print:text-black">
                      <FiFileText className="h-3.5 w-3.5" /> Quick Revision Flashcards
                    </h5>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {sheet.flashcards.map((fc, fcIdx) => (
                        <div key={fcIdx} className="p-3 border border-slate-custom-200 bg-white rounded-xl dark:border-slate-custom-700 dark:bg-slate-custom-800 print:bg-white print:border-slate-300">
                          <div className="text-[11px] font-bold text-slate-custom-800 dark:text-white print:text-black">Q: {fc.question}</div>
                          <div className="text-[11px] text-slate-custom-600 dark:text-slate-custom-400 mt-1.5 border-t border-slate-custom-50 pt-1.5 dark:border-slate-custom-750 print:text-slate-800 print:border-slate-200">
                            <strong>Ans:</strong> {fc.answer}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-custom-500 italic text-center py-6">Revision sheet compiled no results. Practice questions to fetch matching topics.</p>
        )}
      </div>
    </div>
  );
};

export default RevisionPage;
