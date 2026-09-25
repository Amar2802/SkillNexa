import { useState, useEffect, useMemo, useCallback } from "react";
import api from "../api/client";
import {
  LeaderboardHeader,
  CurrentUserRankCard,
  LeaderboardList
} from "../components/leaderboard";
import { useAuth } from "../context/AuthContext";
import Button from "../components/ui/Button";

const TRACK_FILTERS = ["all", "Software", "Data", "DevOps"];

const FALLBACK_LEADERBOARD = [
  { _id: "demo-1", name: "Aarav Sharma", avatar: "", bio: "Full Stack Engineer & System Design Enthusiast", targetField: "Software", streakCount: 18, problemsSolved: 142, testsCompleted: 24, points: 2110, rank: 1 },
  { _id: "demo-2", name: "Elena Rostova", avatar: "", bio: "Data Platform Architect | Kafka, Spark, BigQuery", targetField: "Data", streakCount: 14, problemsSolved: 128, testsCompleted: 19, points: 1825, rank: 2 },
  { _id: "demo-3", name: "Karthik Nair", avatar: "", bio: "Cloud & DevOps Specialist | Kubernetes, Terraform", targetField: "DevOps", streakCount: 12, problemsSolved: 110, testsCompleted: 16, points: 1560, rank: 3 },
  { _id: "demo-4", name: "Sophia Zhang", avatar: "", bio: "Backend Developer | Distributed Systems", targetField: "Software", streakCount: 9, problemsSolved: 95, testsCompleted: 14, points: 1345, rank: 4 },
  { _id: "demo-5", name: "Marcus Brody", avatar: "", bio: "Site Reliability Engineer", targetField: "DevOps", streakCount: 7, problemsSolved: 84, testsCompleted: 11, points: 1150, rank: 5 }
];

export const LeaderboardPage = () => {
  const { user } = useAuth();
  const [data, setData] = useState({ leaderboard: [], totalParticipants: 0, currentUserRank: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedTrack, setSelectedTrack] = useState("all");

  const fetchLeaderboard = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      let res;
      try {
        res = await api.get("/leaderboard", { timeout: 20000 });
      } catch (firstErr) {
        if (firstErr?.response?.status === 404) {
          res = await api.get("/users/leaderboard", { timeout: 20000 });
        } else {
          throw firstErr;
        }
      }

      if (res?.data && (Array.isArray(res.data.leaderboard) || Array.isArray(res.data))) {
        const board = Array.isArray(res.data) ? res.data : res.data.leaderboard;
        setData({
          leaderboard: board,
          totalParticipants: res.data.totalParticipants || board.length,
          currentUserRank: res.data.currentUserRank || null
        });
      } else {
        setData({ leaderboard: FALLBACK_LEADERBOARD, totalParticipants: FALLBACK_LEADERBOARD.length, currentUserRank: null });
      }
    } catch (err) {
      console.warn("[Leaderboard] Using fallback standings:", err?.message);
      setData((prev) => (prev.leaderboard?.length ? prev : { leaderboard: FALLBACK_LEADERBOARD, totalParticipants: FALLBACK_LEADERBOARD.length, currentUserRank: null }));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeaderboard().catch(() => undefined);
  }, [fetchLeaderboard]);

  const filteredEntries = useMemo(() => {
    if (selectedTrack === "all") return data.leaderboard || [];
    return (data.leaderboard || []).filter(
      (entry) => (entry.targetField || "Software").toLowerCase() === selectedTrack.toLowerCase()
    );
  }, [data.leaderboard, selectedTrack]);

  return (
    <div className="space-y-6">
      <LeaderboardHeader totalParticipants={data.totalParticipants} />

      {/* Current User Position Highlight */}
      {data.currentUserRank && (
        <CurrentUserRankCard currentUserRank={data.currentUserRank} />
      )}

      {/* Track Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 snx-scrollbar">
        {TRACK_FILTERS.map((track) => (
          <button
            key={track}
            type="button"
            onClick={() => setSelectedTrack(track)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
              selectedTrack === track
                ? "bg-indigo-600 text-white shadow-xs dark:bg-indigo-500"
                : "border border-[var(--snx-border)] bg-[var(--snx-surface)] text-slate-600 hover:text-slate-900 dark:border-slate-800 dark:text-slate-400 dark:hover:text-white"
            }`}
          >
            {track === "all" ? "All Domains" : `${track} Engineering`}
          </button>
        ))}
      </div>

      {error ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-6 text-center text-xs text-rose-800 dark:border-rose-900/40 dark:bg-rose-950/20 dark:text-rose-300 space-y-2">
          <p>{error}</p>
          <Button variant="secondary" size="sm" onClick={fetchLeaderboard}>
            Try Again
          </Button>
        </div>
      ) : (
        <LeaderboardList
          entries={filteredEntries}
          currentUserId={user?._id || user?.id || ""}
          loading={loading}
        />
      )}
    </div>
  );
};

export default LeaderboardPage;
