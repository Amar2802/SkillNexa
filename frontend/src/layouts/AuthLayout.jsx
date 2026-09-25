import { useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { FiArrowRight, FiCompass, FiCpu, FiLayers, FiSearch, FiSun, FiMoon, FiPlay } from "react-icons/fi";
import PublicLanding from "../components/landing/PublicLanding";
import SkillNexaLogo from "../components/SkillNexaLogo";
import Button from "../components/ui/Button";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

const publicPaths = new Set(["/", "/login", "/signup", "/forgot-password"]);

export const AuthLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { user, loginAsDemo } = useAuth();
  const showLanding = publicPaths.has(location.pathname);

  const handleLaunchDemo = () => {
    loginAsDemo();
    navigate("/dashboard");
  };

  return (
    <div className="snx-app-shell min-h-screen bg-[var(--snx-bg)] text-[var(--snx-text-primary)]">
      {/* Public Top Navbar */}
      <header className="sticky top-0 z-30 border-b border-[var(--snx-border)] bg-[var(--snx-surface)]/90 backdrop-blur-md dark:border-slate-800">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between gap-4">
          <SkillNexaLogo showTagline linkTo={user ? "/dashboard" : "/"} imageClassName="h-7 w-7 rounded-lg object-contain" />

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--snx-border)] text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            >
              {theme === "dark" ? <FiSun className="h-4 w-4" /> : <FiMoon className="h-4 w-4" />}
            </button>

            {user ? (
              <Link to="/dashboard">
                <Button variant="primary" size="sm" iconRight={FiArrowRight}>
                  Go to Dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLaunchDemo}
                  icon={FiPlay}
                  className="hidden sm:inline-flex text-indigo-600 border-indigo-200 hover:bg-indigo-50 dark:text-indigo-400 dark:border-indigo-900/60 dark:hover:bg-indigo-950/40"
                >
                  Instant Demo
                </Button>

                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>

                <Link to="/signup">
                  <Button variant="primary" size="sm" iconRight={FiArrowRight}>
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 pb-12">
        {showLanding ? <PublicLanding /> : null}
        <Outlet />
      </main>
    </div>
  );
};

export default AuthLayout;
