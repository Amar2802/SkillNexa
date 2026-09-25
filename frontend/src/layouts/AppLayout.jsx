import { useState } from "react";
import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";

export const AppLayout = ({ user, profile, logout, appError }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const currentUser = profile || user;

  return (
    <div className="snx-app-shell min-h-screen bg-[var(--snx-bg)] text-[var(--snx-text-primary)]">
      {/* Sidebar (Desktop + Mobile Drawer) */}
      <Sidebar
        user={currentUser}
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed((prev) => !prev)}
        logout={logout}
      />

      {/* Top Navbar */}
      <Navbar
        user={user}
        profile={profile}
        logout={logout}
        onOpenMobileMenu={() => setMobileMenuOpen(true)}
        isCollapsed={isCollapsed}
      />

      {/* Main Content Area */}
      <motion.main
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
        className={`min-h-screen pt-16 transition-all duration-200 ${
          isCollapsed ? "md:pl-16" : "md:pl-64"
        }`}
      >
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          {appError ? (
            <div
              className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-xs sm:text-sm font-medium text-rose-700 dark:text-rose-300"
              role="alert"
            >
              {appError}
            </div>
          ) : null}

          <Outlet />
        </div>
      </motion.main>
    </div>
  );
};

export default AppLayout;
