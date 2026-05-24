import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import SectionLoader from "../components/ui/SectionLoader";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/ui/ToastProvider";
import { setAccessToken } from "../utils/authStorage";

const OAuthSuccessPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { restoreSession } = useAuth();
  const [error, setError] = useState("");

  useEffect(() => {
    const accessToken = String(searchParams.get("accessToken") || "").trim();

    if (accessToken) {
      setAccessToken(accessToken);
    }

    let active = true;
    const finishSignIn = async () => {
      try {
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
  }, [navigate, restoreSession, searchParams, showToast]);

  if (error) {
    return (
      <div className="container-fluid py-4 snx-page-shell">
        <div className="snx-surface-card">
          <h2 className="mb-2">Google sign-in failed</h2>
          <p className="text-secondary mb-3">{error}</p>
          <button className="btn snx-btn-primary" onClick={() => navigate("/login", { replace: true })}>Return to Login</button>
        </div>
      </div>
    );
  }

  return <SectionLoader title="Completing Google sign-in..." subtitle="Finalizing your SkillNexa session" />;
};

export default OAuthSuccessPage;
