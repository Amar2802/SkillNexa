import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiBookmark, FiSearch, FiCode, FiArrowRight, FiTrash2 } from "react-icons/fi";
import PageContainer from "../components/layout/PageContainer";
import PageHeader from "../components/ui/PageHeader";
import Card, { CardHeader, CardTitle, CardContent, CardFooter } from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import EmptyState from "../components/ui/EmptyState";
import api from "../api/client";
import { useToast } from "../components/ui/ToastProvider";

export const BookmarksPage = ({ bookmarks = [], refreshBookmarks }) => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [removingId, setRemovingId] = useState("");

  const handleRemove = async (questionId, e) => {
    e.stopPropagation();
    try {
      setRemovingId(questionId);
      await api.post(`/users/bookmarks/${questionId}`);
      if (refreshBookmarks) await refreshBookmarks();
      showToast("Question removed from saved bookmarks.", "info");
    } catch (err) {
      console.error("Remove bookmark error:", err);
      showToast("Failed to remove bookmark.", "error");
    } finally {
      setRemovingId("");
    }
  };

  const getDifficultyVariant = (diff) => {
    switch (diff?.toLowerCase()) {
      case "easy":
        return "success";
      case "hard":
        return "danger";
      case "medium":
      default:
        return "warning";
    }
  };

  return (
    <PageContainer>
      <PageHeader
        title="Saved Questions"
        subtitle="Your curated revision shortlist of technical questions, edge cases, and high-frequency patterns."
        breadcrumbs={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Bookmarks" }
        ]}
        actions={
          bookmarks.length > 0 && (
            <Badge variant="primary" size="md">
              <FiBookmark className="h-3.5 w-3.5 mr-1 fill-current" />
              <span>{bookmarks.length} Saved</span>
            </Badge>
          )
        }
      />

      {bookmarks.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {bookmarks.map((question) => {
            const cleanTitle = question.title ? question.title.replace(/\s+Practice Variant\s+\d+$/i, "") : "Untitled Question";
            const cleanDesc = question.description ? String(question.description).replace(/\s*Practice focus\s*\d*:\s*.+$/i, "").trim() : "";
            const isRemoving = removingId === question._id;

            return (
              <Card
                key={question._id}
                hoverable
                className="flex flex-col justify-between transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <Badge variant="neutral" size="sm">
                        {question.category || "DSA"}
                      </Badge>
                      <Badge variant={getDifficultyVariant(question.difficulty)} size="sm">
                        {question.difficulty || "Medium"}
                      </Badge>
                      {question.topic && (
                        <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                          {question.topic}
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={(e) => handleRemove(question._id, e)}
                      disabled={isRemoving}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 dark:hover:text-rose-400 transition"
                      title="Remove bookmark"
                      aria-label="Remove bookmark"
                    >
                      <FiTrash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-2">
                      {cleanTitle}
                    </h3>
                    <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                      {cleanDesc || "No description provided."}
                    </p>
                  </div>
                </div>

                <div className="mt-5 pt-3.5 border-t border-[var(--snx-border-subtle)] dark:border-slate-800 flex items-center justify-between gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(`/questions?topic=${encodeURIComponent(question.topic || "")}`)}
                    className="!px-2 text-xs"
                  >
                    Similar Questions
                  </Button>

                  <Button
                    variant="primary"
                    size="sm"
                    icon={FiCode}
                    onClick={() => navigate(question.type === "Coding" ? `/practice/${question._id}` : `/questions?search=${encodeURIComponent(cleanTitle)}`)}
                  >
                    Practice Now
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <EmptyState
          title="No saved questions yet"
          description="Mark questions with the bookmark icon across the Question Bank or Coding IDE to build your personal revision shortlist."
          action={
            <Button
              variant="primary"
              size="md"
              icon={FiSearch}
              onClick={() => navigate("/questions")}
            >
              Explore Question Bank
            </Button>
          }
        />
      )}
    </PageContainer>
  );
};

export default BookmarksPage;
