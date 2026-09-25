import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/client";
import PageContainer from "../components/layout/PageContainer";
import EmptyState from "../components/ui/EmptyState";
import Button from "../components/ui/Button";
import { useToast } from "../components/ui/ToastProvider";
import {
  QuestionStatsBar,
  CategoryTabs,
  QuestionFilterToolbar,
  QuestionListItem,
  QuestionGridCard,
  QuestionDetailModal
} from "../components/questions";

const PAGE_SIZE = 25;
const softwareCategoryOptions = ["DSA", "Aptitude", "Core Subjects", "HR", "Behavioral"];
const initialFilters = { category: "", difficulty: "", topic: "", company: "", search: "" };

export const QuestionBankPage = ({
  questions = [],
  loadQuestions,
  defaultField = "Software",
  bookmarks = [],
  refreshBookmarks,
  refreshProfile,
  history = []
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const requestRef = useRef(0);

  // Filter & Search states
  const [filters, setFilters] = useState(initialFilters);
  const [type, setType] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all"); // 'all' | 'solved' | 'unsolved' | 'bookmarked'
  const [viewMode, setViewMode] = useState("list"); // 'list' | 'grid'

  const deferredFilters = useDeferredValue(filters);
  const deferredType = useDeferredValue(type);
  const deferredStatus = useDeferredValue(statusFilter);

  // Pagination & items state
  const [page, setPage] = useState(1);
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [bookmarkLoadingId, setBookmarkLoadingId] = useState("");

  // Detail Modal state
  const [activeQuestion, setActiveQuestion] = useState(null);

  const sourceQuestions = questions.length ? questions : items;

  // Bookmarked and Solved sets
  const bookmarkedIds = useMemo(
    () => new Set((bookmarks || []).map((item) => String(item._id || item))),
    [bookmarks]
  );

  const solvedIds = useMemo(() => {
    const ids = new Set();
    (history || []).forEach((h) => {
      if (h.questionId) ids.add(String(h.questionId));
      if (Array.isArray(h.questions)) {
        h.questions.forEach((q) => {
          if (q._id) ids.add(String(q._id));
          if (q.questionId) ids.add(String(q.questionId));
        });
      }
      if (Array.isArray(h.test?.questions)) {
        h.test.questions.forEach((q) => {
          if (q._id) ids.add(String(q._id));
        });
      }
    });
    return ids;
  }, [history]);

  // Dynamic filter options
  const filterOptions = useMemo(() => {
    const currentCategory = filters.category;
    const relevantQuestions = currentCategory
      ? sourceQuestions.filter((q) => q.category === currentCategory || (currentCategory === "HR" && q.category === "Behavioral"))
      : sourceQuestions;

    return {
      category: softwareCategoryOptions,
      difficulty: ["Easy", "Medium", "Hard"],
      topic: [...new Set(relevantQuestions.map((q) => q.topic).filter(Boolean))].sort(),
      company: [...new Set(sourceQuestions.map((q) => q.company).filter(Boolean))].sort()
    };
  }, [sourceQuestions, filters.category]);

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts = { "DSA": 0, "Core Subjects": 0, "Aptitude": 0, "HR": 0 };
    sourceQuestions.forEach((q) => {
      const cat = q.category === "Behavioral" ? "HR" : q.category;
      if (counts[cat] !== undefined) {
        counts[cat] = (counts[cat] || 0) + 1;
      }
    });
    return counts;
  }, [sourceQuestions]);

  const activeFilterCount = useMemo(
    () => Object.values(filters).filter(Boolean).length + (type !== "all" ? 1 : 0) + (statusFilter !== "all" ? 1 : 0),
    [filters, type, statusFilter]
  );

  const buildApiFilters = (nextFilters) => {
    const normalized = { ...nextFilters };
    if (normalized.category === "Behavioral") {
      normalized.category = "HR";
      if (!normalized.topic) normalized.topic = "Behavioral Interviews";
    }
    return normalized;
  };

  const matchesCategory = (question, selectedCategory) => {
    if (!selectedCategory) return true;
    if (selectedCategory === "Behavioral" || selectedCategory === "HR") {
      return question.category === "HR" || question.category === "Behavioral";
    }
    return question.category === selectedCategory;
  };

  const matchesStatus = (question, status) => {
    if (status === "all") return true;
    const qId = String(question._id);
    if (status === "bookmarked") return bookmarkedIds.has(qId);
    if (status === "solved") return solvedIds.has(qId);
    if (status === "unsolved") return !solvedIds.has(qId);
    return true;
  };

  const fetchQuestions = async (nextPage = 1, nextFilters = deferredFilters, nextType = deferredType, nextStatus = deferredStatus) => {
    const requestId = requestRef.current + 1;
    requestRef.current = requestId;
    setLoading(true);

    try {
      const params = {
        field: defaultField,
        paginated: true,
        page: nextPage,
        limit: PAGE_SIZE,
        ...buildApiFilters(nextFilters)
      };

      if (!params.category) delete params.category;
      if (!params.difficulty) delete params.difficulty;
      if (!params.topic) delete params.topic;
      if (!params.company) delete params.company;
      if (!params.search) delete params.search;
      if (nextType !== "all") params.type = nextType;

      const { data } = await api.get("/questions", { params, timeout: 25000 });
      if (requestRef.current !== requestId) return;

      let nextItems = data.items || [];
      if (nextStatus !== "all") {
        nextItems = nextItems.filter((q) => matchesStatus(q, nextStatus));
      }

      setItems(nextItems);
      setTotal(data.total || nextItems.length);
      setTotalPages(data.totalPages || 1);
      setPage(data.page || nextPage);
    } catch {
      const fallback = await loadQuestions({
        ...buildApiFilters(nextFilters),
        limit: PAGE_SIZE * nextPage,
        type: nextType !== "all" ? nextType : undefined
      }).catch(() => []);

      if (requestRef.current !== requestId) return;

      const fallbackItems = (fallback || [])
        .filter((question) => matchesCategory(question, nextFilters.category))
        .filter((question) => !nextFilters.difficulty || question.difficulty === nextFilters.difficulty)
        .filter((question) => !nextFilters.topic || String(question.topic || "").toLowerCase().includes(nextFilters.topic.toLowerCase()))
        .filter((question) => !nextFilters.company || String(question.company || "").toLowerCase().includes(nextFilters.company.toLowerCase()))
        .filter((question) => nextType === "all" || question.type === nextType)
        .filter((question) => matchesStatus(question, nextStatus))
        .filter((question) => {
          if (!nextFilters.search) return true;
          const haystack = `${question.title} ${question.description} ${question.topic} ${question.company}`.toLowerCase();
          return haystack.includes(nextFilters.search.toLowerCase());
        });

      setItems(fallbackItems.slice((nextPage - 1) * PAGE_SIZE, nextPage * PAGE_SIZE));
      setTotal(fallbackItems.length);
      setTotalPages(Math.max(1, Math.ceil(fallbackItems.length / PAGE_SIZE)));
      setPage(nextPage);
    } finally {
      if (requestRef.current === requestId) {
        setLoading(false);
      }
    }
  };

  const updateFilter = (key, value) => {
    setFilters((current) => ({ ...current, [key]: value }));
    setPage(1);
  };

  const handleSelectCategory = (category) => {
    setFilters((current) => ({
      ...current,
      category,
      topic: "" // Reset topic when switching categories
    }));
    setPage(1);
  };

  const clearFilters = () => {
    setFilters(initialFilters);
    setType("all");
    setStatusFilter("all");
    setPage(1);
  };

  const toggleBookmark = async (questionId) => {
    try {
      setBookmarkLoadingId(questionId);
      await api.post(`/users/bookmarks/${questionId}`, {}, { timeout: 25000 });
      await refreshBookmarks?.();
      showToast("Bookmark updated.", "success");
    } catch {
      showToast("Unable to update bookmark.", "error");
    } finally {
      setBookmarkLoadingId("");
    }
  };

  // Synchronize URL parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const nextFilters = {
      category: params.get("category") || "",
      difficulty: params.get("difficulty") || "",
      topic: params.get("topic") || "",
      company: params.get("company") || "",
      search: params.get("search") || ""
    };
    const nextType = params.get("type") || "all";
    const nextStatus = params.get("status") || "all";

    setFilters(nextFilters);
    if (nextType) setType(nextType);
    if (nextStatus) setStatusFilter(nextStatus);
  }, [location.search]);

  // Debounced fetch
  useEffect(() => {
    const timerId = setTimeout(() => {
      fetchQuestions(page, deferredFilters, deferredType, deferredStatus).catch(() => undefined);
    }, 180);

    return () => clearTimeout(timerId);
  }, [deferredFilters, deferredType, deferredStatus, page]);

  // Modal Stepper Helpers
  const activeIndex = useMemo(() => {
    if (!activeQuestion) return -1;
    return items.findIndex((q) => String(q._id) === String(activeQuestion._id));
  }, [items, activeQuestion]);

  const handlePrevQuestion = () => {
    if (activeIndex > 0) {
      setActiveQuestion(items[activeIndex - 1]);
    }
  };

  const handleNextQuestion = () => {
    if (activeIndex !== -1 && activeIndex < items.length - 1) {
      setActiveQuestion(items[activeIndex + 1]);
    }
  };

  return (
    <PageContainer
      title="Interview Question Library"
      description="Curated collection of technical interview problems, system design concepts, and behavioral frameworks."
    >
      <div className="space-y-4">
        {/* Top High-Level Metric Stats */}
        <QuestionStatsBar
          total={total || sourceQuestions.length}
          categoryCounts={categoryCounts}
          solvedCount={solvedIds.size}
          bookmarkedCount={bookmarkedIds.size}
        />

        {/* Category Domain Tabs */}
        <CategoryTabs
          activeCategory={filters.category}
          onSelectCategory={handleSelectCategory}
          categoryCounts={categoryCounts}
        />

        {/* Discovery & Filter Toolbar */}
        <QuestionFilterToolbar
          filters={filters}
          onFilterChange={updateFilter}
          onClearFilters={clearFilters}
          topics={filterOptions.topic}
          companies={filterOptions.company}
          selectedType={type}
          onTypeChange={(newType) => {
            setType(newType);
            setPage(1);
          }}
          statusFilter={statusFilter}
          onStatusChange={(newStatus) => {
            setStatusFilter(newStatus);
            setPage(1);
          }}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          totalCount={total}
          activeFilterCount={activeFilterCount}
        />

        {/* Content Area: Table / Grid / Loading / Empty */}
        {loading ? (
          <div className="rounded-2xl border border-[var(--snx-border)] bg-[var(--snx-surface)] p-12 text-center text-xs text-slate-500 animate-pulse dark:border-slate-800">
            <div className="h-4 w-48 bg-slate-200 dark:bg-slate-800 rounded mx-auto mb-2" />
            <div className="h-3 w-32 bg-slate-100 dark:bg-slate-850 rounded mx-auto" />
          </div>
        ) : items.length > 0 ? (
          <div className="space-y-4">
            {/* View Mode: List / Table View */}
            {viewMode === "list" ? (
              <div className="overflow-hidden rounded-2xl border border-[var(--snx-border)] bg-[var(--snx-surface)] shadow-subtle dark:border-slate-800">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-[var(--snx-border)] bg-[var(--snx-surface-subtle)] text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:text-slate-400">
                        <th className="py-3 px-3.5 w-10 text-center">Status</th>
                        <th className="py-3 px-3">Title</th>
                        <th className="py-3 px-3 hidden md:table-cell">Topic & Category</th>
                        <th className="py-3 px-3 hidden lg:table-cell">Company</th>
                        <th className="py-3 px-3 w-28">Difficulty</th>
                        <th className="py-3 px-3 hidden sm:table-cell w-28">Format</th>
                        <th className="py-3 px-3 w-16 text-center">Save</th>
                        <th className="py-3 px-4 w-36 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--snx-border-subtle)] dark:divide-slate-800/80">
                      {items.map((question, index) => {
                        const qId = String(question._id);
                        return (
                          <QuestionListItem
                            key={question._id || index}
                            question={question}
                            isSolved={solvedIds.has(qId)}
                            isBookmarked={bookmarkedIds.has(qId)}
                            onToggleBookmark={toggleBookmark}
                            isBookmarkLoading={bookmarkLoadingId === question._id}
                            onOpenDetail={(q) => setActiveQuestion(q)}
                          />
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              /* View Mode: Grid Cards View */
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5">
                {items.map((question, index) => {
                  const qId = String(question._id);
                  return (
                    <QuestionGridCard
                      key={question._id || index}
                      question={question}
                      isSolved={solvedIds.has(qId)}
                      isBookmarked={bookmarkedIds.has(qId)}
                      onToggleBookmark={toggleBookmark}
                      isBookmarkLoading={bookmarkLoadingId === question._id}
                      onOpenDetail={(q) => setActiveQuestion(q)}
                    />
                  );
                })}
              </div>
            )}

            {/* Pagination Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-[var(--snx-border-subtle)] text-xs text-slate-500 dark:border-slate-800">
              <span>
                Showing page <strong className="text-slate-900 dark:text-white">{page}</strong> of{" "}
                <strong className="text-slate-900 dark:text-white">{totalPages}</strong> ({total} questions found)
              </span>

              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={page <= 1 || loading}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  Previous
                </Button>
                <span className="px-2 text-xs font-mono font-semibold text-slate-700 dark:text-slate-300">
                  {page} / {totalPages}
                </span>
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={page >= totalPages || loading}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <EmptyState
            title="No interview questions match your filters"
            description="Try selecting a different category, clearing search terms, or resetting your difficulty filters."
            action={
              <Button variant="primary" size="sm" onClick={clearFilters}>
                Reset All Filters
              </Button>
            }
          />
        )}
      </div>

      {/* Interactive Question Detail & Practice Modal */}
      {activeQuestion && (
        <QuestionDetailModal
          isOpen={Boolean(activeQuestion)}
          onClose={() => setActiveQuestion(null)}
          question={activeQuestion}
          isBookmarked={bookmarkedIds.has(String(activeQuestion._id))}
          onToggleBookmark={toggleBookmark}
          isBookmarkLoading={bookmarkLoadingId === activeQuestion._id}
          onPrevQuestion={handlePrevQuestion}
          onNextQuestion={handleNextQuestion}
          hasPrev={activeIndex > 0}
          hasNext={activeIndex !== -1 && activeIndex < items.length - 1}
          refreshProfile={refreshProfile}
        />
      )}
    </PageContainer>
  );
};

export default QuestionBankPage;
