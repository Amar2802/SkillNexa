import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import SectionLoader from "../components/ui/SectionLoader";
import SkillNexaLogo from "../components/SkillNexaLogo";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/ui/ToastProvider";
import { setAccessToken } from "../utils/authStorage";
import api from "../services/api";

const OAuthSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { applyAuth, restoreSession } = useAuth();
  const [error, setError] = useState("");

  useEffect(() => {
    const accessToken = String(searchParams.get("accessToken") || "").trim();

    if (accessToken) {
      setAccessToken(accessToken);
    }

    let active = true;
    const finishSignIn = async () => {
      try {
        if (accessToken) {
          try {
            const profileRes = await api.get("/users/profile", {
              headers: { Authorization: `Bearer ${accessToken}` },
              timeout: 15000
            });
            if (!active) return;
            const userData = profileRes.data?.user || profileRes.data;
            applyAuth({ accessToken, user: userData, rememberMe: true });
            showToast("Signed in successfully with Google.", "success");
            navigate("/dashboard", { replace: true });
            return;
          } catch (profileErr) {
            console.warn("[OAuth] Direct profile fetch fallback:", profileErr?.message);
          }
        }

        await restoreSession();
        if (!active) return;
        showToast("Signed in successfully with Google.", "success");
        navigate("/dashboard", { replace: true });
      } catch (requestError) {
        if (!active) return;
        setError(requestError.response?.data?.message || "Unable to complete Google sign-in.");
      }
    };

    void finishSignIn();
    return () => {
      active = false;
    };
  }, [applyAuth, navigate, restoreSession, searchParams, showToast]);

  if (error) {
    return (
      <div className="min-h-screen bg-[var(--snx-bg)] flex items-center justify-center p-4">
        <div className="max-w-md w-full rounded-2xl border border-rose-200 bg-[var(--snx-surface)] p-6 shadow-subtle dark:border-rose-900/50 space-y-4 text-center">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            Google Sign-in Failed
          </h2>
          <p className="text-xs text-rose-600 dark:text-rose-400">
            {error}
          </p>
          <div className="pt-2">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700 transition"
              onClick={() => navigate("/login", { replace: true })}
            >
              Return to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="snx-page-loader-wrap">
      <SkillNexaLogo imageClassName="snx-brand-logo-image snx-brand-logo-loader" />
      <SectionLoader title="Completing Google sign-in..." subtitle="Finalizing your SkillNexa session" />
    </div>
  );
};

export default OAuthSuccessPage;
