import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiAlertTriangle,
  FiDownload,
  FiTrash2,
  FiX,
  FiCheck,
  FiAlertCircle
} from "react-icons/fi";
import Button from "../ui/Button";
import Modal from "../ui/Modal";
import Input from "../ui/Input";
import api from "../../api/client";

export const DangerZoneSection = ({ user, logout }) => {
  const [exporting, setExporting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deletePassword, setDeletePassword] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const navigate = useNavigate();

  const hasPassword = user?.hasPassword !== false;

  const handleExportData = async () => {
    try {
      setExporting(true);
      const [profileRes, historyRes, bookmarksRes] = await Promise.allSettled([
        api.get("/users/profile"),
        api.get("/users/history"),
        api.get("/users/bookmarks")
      ]);

      const exportData = {
        exportDate: new Date().toISOString(),
        profile: profileRes.status === "fulfilled" ? profileRes.value.data : user,
        history: historyRes.status === "fulfilled" ? historyRes.value.data : [],
        bookmarks: bookmarksRes.status === "fulfilled" ? bookmarksRes.value.data : []
      };

      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportData, null, 2));
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `skillnexa-export-${new Date().toISOString().split("T")[0]}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } catch (err) {
      console.error("Export data error:", err);
    } finally {
      setExporting(false);
    }
  };

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    setDeleteError("");

    if (deleteConfirmText !== "DELETE") {
      setDeleteError("You must type DELETE in all capital letters to confirm.");
      return;
    }

    if (hasPassword && !deletePassword) {
      setDeleteError("Password is required to confirm account deletion.");
      return;
    }

    try {
      setDeleting(true);
      await api.delete("/users/account", {
        data: {
          confirmationText: deleteConfirmText,
          password: deletePassword
        }
      });

      setShowDeleteModal(false);
      if (logout) {
        logout();
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error("Delete account error:", err);
      setDeleteError(err?.response?.data?.message || "Failed to delete account. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-base font-bold text-rose-600 dark:text-rose-400">
          Danger Zone & Data Export
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Irreversible actions, data privacy exports, and account decommissioning.
        </p>
      </div>

      <div className="space-y-4">
        {/* Data Portability Card */}
        <div className="rounded-2xl border border-[var(--snx-border)] bg-[var(--snx-surface)] p-5 shadow-subtle dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Export Preparation Data
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 max-w-lg leading-relaxed">
              Download a machine-readable JSON package of your complete SkillNexa history, including test attempts, code submissions, bookmarks, and performance scores.
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleExportData}
            loading={exporting}
            icon={FiDownload}
            className="shrink-0"
          >
            Export All Data (JSON)
          </Button>
        </div>

        {/* Delete Account Card */}
        <div className="rounded-2xl border border-rose-200 bg-rose-50/40 p-5 dark:border-rose-900/50 dark:bg-rose-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-rose-900 dark:text-rose-300">
              Delete Account & Reset Data
            </h3>
            <p className="text-xs text-rose-700/80 dark:text-rose-400/80 mt-0.5 max-w-lg leading-relaxed">
              Permanently wipe your account, test results, coding submissions, and streak points. This action cannot be undone.
            </p>
          </div>

          <Button
            type="button"
            variant="danger"
            size="sm"
            onClick={() => {
              setDeleteConfirmText("");
              setDeletePassword("");
              setDeleteError("");
              setShowDeleteModal(true);
            }}
            icon={FiTrash2}
            className="shrink-0"
          >
            Delete Account
          </Button>
        </div>
      </div>

      {/* Delete Account Confirmation Modal */}
      {showDeleteModal && (
        <Modal
          isOpen={showDeleteModal}
          onClose={() => !deleting && setShowDeleteModal(false)}
          title="Permanently Delete Account"
          maxWidth="max-w-md"
        >
          <form onSubmit={handleDeleteAccount} className="space-y-4">
            <div className="flex items-start gap-3 p-3 rounded-xl bg-rose-50 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300 border border-rose-200 dark:border-rose-900/60 text-xs">
              <FiAlertTriangle className="h-5 w-5 shrink-0 text-rose-600 dark:text-rose-400 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold">Warning: This action is permanent and irreversible.</p>
                <p className="text-[11px] leading-relaxed">
                  All test history, mock interview transcripts, bookmarks, practice code, and leaderboard standings will be deleted immediately.
                </p>
              </div>
            </div>

            {deleteError && (
              <div className="p-3 rounded-xl bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-200 text-xs font-medium">
                {deleteError}
              </div>
            )}

            {hasPassword && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Enter your password to confirm
                </label>
                <input
                  type="password"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-10 rounded-xl border border-[var(--snx-border)] bg-[var(--snx-surface)] px-3 text-xs font-medium text-slate-900 dark:text-white dark:border-slate-800 focus:outline-hidden focus:ring-2 focus:ring-rose-500"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Type <strong className="text-rose-600 dark:text-rose-400">DELETE</strong> to confirm
              </label>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="DELETE"
                className="w-full h-10 rounded-xl border border-[var(--snx-border)] bg-[var(--snx-surface)] px-3 text-xs font-medium text-slate-900 dark:text-white dark:border-slate-800 focus:outline-hidden focus:ring-2 focus:ring-rose-500 uppercase"
                required
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[var(--snx-border-subtle)] dark:border-slate-800">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setShowDeleteModal(false)}
                disabled={deleting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="danger"
                size="sm"
                loading={deleting}
                disabled={deleteConfirmText !== "DELETE" || deleting}
                icon={FiTrash2}
              >
                Confirm Account Deletion
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default DangerZoneSection;
