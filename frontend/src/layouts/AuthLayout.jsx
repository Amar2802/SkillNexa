import { useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { FiArrowRight, FiCompass, FiCpu, FiLayers, FiSearch } from "react-icons/fi";
import PublicLanding from "../components/landing/PublicLanding";
import SkillNexaLogo from "../components/SkillNexaLogo";

const navItems = [
  { id: "home", label: "Home", icon: FiCompass },
  { id: "explore", label: "Explore", icon: FiSearch },
  { id: "mock", label: "Mock Interviews", icon: FiCpu },
  { id: "about", label: "About", icon: FiLayers }
];

const publicPaths = new Set(["/", "/login", "/signup", "/forgot-password"]);

const AuthLayout = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("home");
  const showLanding = publicPaths.has(location.pathname);

  return (
    <div className="snx-app-shell min-h-screen">
      <header className="sticky top-0 z-30 border-b border-slate-custom-200/80 bg-white/85 backdrop-blur-md dark:border-slate-custom-700 dark:bg-slate-custom-900/85">
        <div className="snx-container flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between">
          <SkillNexaLogo showTagline linkTo="/" />

          {showLanding ? (
            <nav className="flex flex-wrap gap-1 sm:justify-center">
              {navItems.map(({ id, label, icon: Icon }) => {
                const active = activeTab === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setActiveTab(id)}
                    className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition duration-200 sm:text-sm ${
                      active
                        ? "bg-gradient-to-r from-brand-500 to-accent-500 text-white shadow-elevation-1"
                        : "text-slate-custom-600 hover:bg-slate-custom-100 hover:text-slate-custom-900 dark:text-slate-custom-300 dark:hover:bg-slate-custom-800 dark:hover:text-white"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {label}
                  </button>
                );
              })}
            </nav>
          ) : null}

          <div className="flex items-center gap-2 sm:shrink-0">
            <Link to="/login" className="snx-btn-secondary snx-btn-sm">Login</Link>
            <Link to="/signup" className="snx-btn-primary snx-btn-sm">
              Get Started
              <FiArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      <main className="snx-container pb-10">
        {showLanding ? <PublicLanding activeTab={activeTab} onTabChange={setActiveTab} /> : null}
        <Outlet />
      </main>
    </div>
  );
};

export default AuthLayout;
